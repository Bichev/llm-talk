import { createOpenAIProvider } from './llm-providers/openai';
import { generateConversationPrompt, generateIterativeOptimizationPrompt } from './prompts';
import { analyzeTokenEfficiency } from './token-counter';
import { EvolutionTracker } from './evolution-tracker';
import { 
  createSession, 
  createParticipants, 
  addMessage, 

  completeSession,
  getSessionWithDetails 
} from './database/operations';
import type { 
  SessionState, 
 
  ConversationMessage, 
  SessionStatus,
  StartSessionRequest,
  SendMessageRequest
} from '@/types/session';
import type { LLMParticipant } from '@/types/llm';
import type { 
  DatabaseSession, 
  DatabaseParticipant, 
  InsertSession, 
  InsertParticipant 
} from '@/types/database';

/**
 * Core session management class that handles LLM conversations
 */
export class SessionManager {
  private currentSession: SessionState | null = null;
  private providers: Map<string, any> = new Map();
  private messageHistory: ConversationMessage[] = [];
  private isProcessing = false;
  private evolutionTracker: EvolutionTracker | null = null;

  constructor() {
    // Only initialize providers on server-side
    if (typeof window === 'undefined') {
      this.initializeProviders();
    }
  }

  /**
   * Initialize LLM providers based on available API keys (server-side only)
   */
  private initializeProviders(): void {
    // Initialize OpenAI provider if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.providers.set('openai', createOpenAIProvider());
    }
    
    // TODO: Add other providers (Claude, Gemini, Perplexity) when implemented
    console.log(`Initialized ${this.providers.size} LLM providers`);
  }

  /**
   * Start a new conversation session
   */
  async startSession(request: StartSessionRequest): Promise<SessionState> {
    if (this.currentSession && this.currentSession.status === 'running') {
      throw new Error('A session is already running. Stop the current session first.');
    }

    try {
      // Validate participants have available providers
      this.validateParticipants(request.participants);

      // Create session in database
      const sessionData: InsertSession = {
        topic: request.topic,
        scenario: request.scenario,
        max_iterations: request.maxIterations,
        config: {
          participants: request.participants as any,
          customPrompt: request.customPrompt,
          estimatedCost: this.estimateSessionCost(request.participants, request.maxIterations)
        } as any
      };

      const dbSession = await createSession(sessionData);

      // Create participants in database
      const participantData: InsertParticipant[] = request.participants.map(p => ({
        session_id: dbSession.id,
        name: p.name,
        provider: p.provider,
        model: p.model,
        temperature: p.temperature,
        config: p.config || {}
      }));

      const dbParticipants = await createParticipants(participantData);

      // Initialize session state
      this.currentSession = {
        id: dbSession.id,
        status: 'running',
        config: {
          topic: request.topic,
          scenario: request.scenario,
          participants: request.participants,
          maxIterations: request.maxIterations,
          customPrompt: request.customPrompt
        },
        messages: [],
        analytics: {
          totalTokens: 0,
          averageTokensPerMessage: 0,
          tokenEfficiencyTrend: [],
          participantStats: dbParticipants.map(p => ({
            participantId: p.id,
            name: p.name,
            provider: p.provider,
            messageCount: 0,
            totalTokens: 0,
            averageTokens: 0,
            averageResponseTime: 0,
            efficiencyTrend: [],
            innovationScore: 0
          })),
          evolutionMarkers: [],
          efficiencyImprovement: 0,
          communicationPatterns: []
        },
        currentIteration: 0,
        participants: request.participants.map((p, index) => ({
          ...p,
          id: dbParticipants[index].id
        })),
        startedAt: new Date(dbSession.created_at),
        updatedAt: new Date(dbSession.updated_at)
      };

      this.messageHistory = [];
      
      // Initialize evolution tracker for new session
      this.evolutionTracker = new EvolutionTracker();
      
      console.log(`Session started: ${this.currentSession.id}`);
      
      return this.currentSession;
    } catch (error) {
      console.error('Failed to start session:', error);
      throw new Error(`Failed to start session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Send the next message in the conversation
   */
  async sendMessage(request: SendMessageRequest): Promise<ConversationMessage> {
    if (!this.currentSession || this.currentSession.status !== 'running') {
      throw new Error('No active session. Start a session first.');
    }

    if (this.isProcessing) {
      throw new Error('Already processing a message. Please wait.');
    }

    if (this.currentSession.currentIteration >= this.currentSession.config.maxIterations) {
      throw new Error('Session has reached maximum iterations.');
    }

    this.isProcessing = true;

    try {
      const nextIteration = this.currentSession.currentIteration + 1;
      const currentSpeaker = this.getCurrentSpeaker(nextIteration);
      
      if (!currentSpeaker) {
        throw new Error('Unable to determine current speaker');
      }

      // Generate prompt for current speaker
      const prompt = this.generatePromptForSpeaker(currentSpeaker, nextIteration);
      
      // Get LLM provider for current speaker
      const provider = this.getProviderForParticipant(currentSpeaker);
      
      // Send message to LLM
      const startTime = Date.now();
      const llmResponse = await provider.sendMessage({
        prompt,
        model: currentSpeaker.model,
        temperature: currentSpeaker.temperature,
        context: this.buildConversationContext(),
        maxTokens: request.contextLimit || 4000 // Default to 4000 tokens if not specified
      });
      
      const processingTime = Date.now() - startTime;

      // Create conversation message
      const message: ConversationMessage = {
        id: '', // Will be set by database
        sessionId: this.currentSession.id,
        participantId: currentSpeaker.id!,
        timestamp: new Date(),
        iteration: nextIteration,
        speaker: currentSpeaker.name,
        originalPrompt: prompt,
        evolvedMessage: llmResponse.content,
        translation: this.extractTranslation(llmResponse.content),
        tokenCount: llmResponse.tokenCount,
        processingTime,
        evolutionMarkers: this.detectEvolutionMarkers(llmResponse.content, nextIteration) as any,
        efficiencyScore: this.calculateEfficiencyScore(llmResponse.tokenCount.total, nextIteration)
      };

      // Update evolution tracker with new message
      if (this.evolutionTracker) {
        this.evolutionTracker.addMessage(message);
      }

      // Save message to database
      const messageId = await addMessage(
        this.currentSession.id,
        currentSpeaker.id!,
        nextIteration,
        llmResponse.content,
        llmResponse.tokenCount,
        prompt,
        message.translation,
        processingTime,
        message.evolutionMarkers as any
      );

      message.id = messageId;

      // Update session state
      this.currentSession.currentIteration = nextIteration;
      this.currentSession.messages.push(message);
      this.currentSession.updatedAt = new Date();
      this.messageHistory.push(message);

      // Update analytics
      this.updateAnalytics(message);

      // Check if session is complete
      if (nextIteration >= this.currentSession.config.maxIterations) {
        await this.completeSession();
      }

      console.log(`Message ${nextIteration} processed for ${currentSpeaker.name}`);
      return message;

    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Stop the current session
   */
  async stopSession(reason: 'manual' | 'completed' | 'error' | 'timeout' = 'manual'): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session to stop');
    }

    try {
      await this.completeSession(reason === 'completed' ? 'completed' : 'stopped');
      console.log(`Session stopped: ${reason}`);
    } catch (error) {
      console.error('Failed to stop session:', error);
      throw error;
    }
  }

  /**
   * Get current session state
   */
  getCurrentSession(): SessionState | null {
    return this.currentSession;
  }

  /**
   * Get session status
   */
  getSessionStatus(): SessionStatus {
    return this.currentSession?.status || 'idle';
  }

  /**
   * Check if session is processing
   */
  isProcessingMessage(): boolean {
    return this.isProcessing;
  }

  /**
   * Load existing session from database
   */
  async loadSession(sessionId: string): Promise<SessionState> {
    try {
      const sessionData = await getSessionWithDetails(sessionId);
      
      if (!sessionData.session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      // Convert database data to session state
      this.currentSession = this.convertDatabaseToSessionState(
        sessionData.session,
        sessionData.participants,
        sessionData.messages
      );

      this.messageHistory = [...this.currentSession.messages];
      
      // Initialize evolution tracker with existing messages
      this.evolutionTracker = new EvolutionTracker(this.messageHistory);
      
      return this.currentSession;
    } catch (error) {
      console.error('Failed to load session:', error);
      throw error;
    }
  }

  /**
   * Private helper methods
   */

  private validateParticipants(participants: LLMParticipant[]): void {
    if (participants.length < 2) {
      throw new Error('At least 2 participants are required');
    }

    if (participants.length > 5) {
      throw new Error('Maximum 5 participants allowed');
    }

    // On client-side, skip provider availability check since providers are only initialized on server
    // The actual provider validation will happen in the API routes
    if (typeof window === 'undefined') {
      for (const participant of participants) {
        if (!this.providers.has(participant.provider)) {
          throw new Error(`Provider ${participant.provider} is not available. Check API key configuration.`);
        }
      }
    }
  }

  private estimateSessionCost(participants: LLMParticipant[], maxIterations: number): number {
    // Rough cost estimation - will be refined with actual usage
    const avgTokensPerMessage = 200;
    const totalMessages = maxIterations * participants.length;
    const totalTokens = totalMessages * avgTokensPerMessage;
    
    // Average cost per 1K tokens across providers
    const avgCostPer1KTokens = 0.02;
    
    return (totalTokens / 1000) * avgCostPer1KTokens;
  }

  private getCurrentSpeaker(iteration: number): LLMParticipant | null {
    if (!this.currentSession) return null;
    
    const speakerIndex = (iteration - 1) % this.currentSession.participants.length;
    return this.currentSession.participants[speakerIndex];
  }

  private generatePromptForSpeaker(speaker: LLMParticipant, iteration: number): string {
    if (!this.currentSession) throw new Error('No active session');

    const context = {
      topic: this.currentSession.config.topic,
      scenario: this.currentSession.config.scenario,
      participantName: speaker.name,
      iteration,
      maxIterations: this.currentSession.config.maxIterations,
      previousMessages: this.messageHistory.slice(-5).map(msg => ({
        speaker: msg.speaker,
        message: msg.evolvedMessage,
        iteration: msg.iteration
      })),
      customPrompt: this.currentSession.config.customPrompt
    };

    let prompt = generateConversationPrompt(context);

    // Add special handling for iterative optimization scenario
    if (this.currentSession.config.scenario === 'iterative-optimization') {
      const previousOptimizations = this.messageHistory
        .filter(msg => msg.speaker === speaker.name)
        .map(msg => msg.evolvedMessage)
        .slice(-5); // Last 5 optimizations
      
      const optimizationPrompt = generateIterativeOptimizationPrompt(context, previousOptimizations);
      prompt += `\n\n${optimizationPrompt}`;
    }

    // Add evolution guidance if available
    if (this.evolutionTracker) {
      const evolutionGuidance = this.evolutionTracker.getEvolutionGuidance(speaker.name);
      prompt += `\n\nEVOLUTION GUIDANCE:\n${evolutionGuidance}`;
    }

    return prompt;
  }

  private getProviderForParticipant(participant: LLMParticipant): any {
    const provider = this.providers.get(participant.provider);
    if (!provider) {
      throw new Error(`Provider ${participant.provider} not available`);
    }
    return provider;
  }

  private buildConversationContext(): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
    const context: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
    
    // Add recent messages as context (last 10 messages)
    const recentMessages = this.messageHistory.slice(-10);
    
    // Add evolution context if available
    if (this.evolutionTracker) {
      const evolutionContext = this.evolutionTracker.getEvolutionContext();
      if (evolutionContext.patterns.length > 0) {
        const recentPatterns = evolutionContext.patterns.slice(-3);
        const patternSummary = recentPatterns
          .map(p => `${p.pattern} (${p.meaning}) - used by ${p.firstUsedBy}`)
          .join(', ');
        
        context.push({
          role: 'system',
          content: `ESTABLISHED COMMUNICATION PATTERNS: ${patternSummary}`
        });
      }
    }
    
    for (const msg of recentMessages) {
      // Create a more natural conversation flow where each LLM sees the others as distinct speakers
      context.push({
        role: 'user', // Treat other LLMs as "users" speaking to the current LLM
        content: `[${msg.speaker}]: ${msg.evolvedMessage}${msg.translation ? `\n[Translation: ${msg.translation}]` : ''}`
      });
    }

    return context;
  }

  private extractTranslation(content: string): string | undefined {
    // Look for translation markers like [translation: ...] or [meaning: ...]
    const translationMatch = content.match(/\[(?:translation|meaning|decode):\s*([^\]]+)\]/i);
    return translationMatch ? translationMatch[1].trim() : undefined;
  }

  private detectEvolutionMarkers(content: string, iteration: number): string[] {
    const markers: string[] = [];

    // Detect various evolution patterns
    if (content.includes('→') || content.includes('⇒')) {
      markers.push('symbol_introduction');
    }

    if (content.match(/\b[A-Z]{2,}\b/) && iteration > 5) {
      markers.push('abbreviation_usage');
    }

    if (content.includes('//') || content.includes('::')) {
      markers.push('notation_system');
    }

    if (iteration > 10 && content.length < 50) {
      markers.push('efficiency_breakthrough');
    }

    return markers;
  }

  private calculateEfficiencyScore(tokenCount: number, iteration: number): number {
    if (iteration === 1) return 50; // Neutral baseline

    const previousMessage = this.messageHistory[this.messageHistory.length - 1];
    if (!previousMessage) return 50;

    const analysis = analyzeTokenEfficiency(previousMessage.tokenCount.total, tokenCount);
    return analysis.efficiencyScore;
  }

  private updateAnalytics(message: ConversationMessage): void {
    if (!this.currentSession) return;

    const analytics = this.currentSession.analytics;
    
    // Update total tokens
    analytics.totalTokens += message.tokenCount.total;
    analytics.averageTokensPerMessage = analytics.totalTokens / this.currentSession.messages.length;
    
    // Update efficiency trend
    analytics.tokenEfficiencyTrend.push(message.tokenCount.total);
    
    // Update participant stats
    const participantStat = analytics.participantStats.find(
      p => p.participantId === message.participantId
    );
    
    if (participantStat) {
      participantStat.messageCount++;
      participantStat.totalTokens += message.tokenCount.total;
      participantStat.averageTokens = participantStat.totalTokens / participantStat.messageCount;
      participantStat.averageResponseTime = message.processingTime || 0;
      participantStat.efficiencyTrend.push(message.efficiencyScore || 50);
    }

    // Add evolution markers
    if (message.evolutionMarkers && message.evolutionMarkers.length > 0) {
      for (const marker of message.evolutionMarkers) {
        analytics.evolutionMarkers.push({
          iteration: message.iteration,
          type: marker as any,
          description: `Evolution marker detected: ${marker}`,
          participantId: message.participantId,
          impact: 'positive'
        });
      }
    }
  }

  private async completeSession(status: 'completed' | 'stopped' = 'completed'): Promise<void> {
    if (!this.currentSession) return;

    try {
      // Complete session in database
      await completeSession(this.currentSession.id, status);
      
      // Update session status
      this.currentSession.status = status;
      this.currentSession.completedAt = new Date();
      
      console.log(`Session completed with status: ${status}`);
    } catch (error) {
      console.error('Failed to complete session:', error);
      this.currentSession.status = 'error';
      throw error;
    }
  }

  private convertDatabaseToSessionState(
    dbSession: DatabaseSession,
    dbParticipants: DatabaseParticipant[],
    dbMessages: any[]
  ): SessionState {
    // Convert database records back to SessionState format
    // This is a complex conversion that maps database schema to app types
    const config = dbSession.config as any;
    
    return {
      id: dbSession.id,
      status: dbSession.status,
      config: {
        topic: dbSession.topic,
        scenario: dbSession.scenario,
        participants: config.participants || [],
        maxIterations: dbSession.max_iterations,
        customPrompt: config.customPrompt
      },
      messages: dbMessages.map(msg => ({
        id: msg.id,
        sessionId: msg.session_id,
        participantId: msg.participant_id,
        timestamp: new Date(msg.timestamp),
        iteration: msg.iteration,
        speaker: dbParticipants.find(p => p.id === msg.participant_id)?.name || 'Unknown',
        originalPrompt: msg.original_prompt,
        evolvedMessage: msg.evolved_message,
        translation: msg.translation,
        tokenCount: msg.token_count as any,
        processingTime: msg.processing_time,
        evolutionMarkers: msg.evolution_markers,
        efficiencyScore: msg.efficiency_score
      })),
      analytics: {
        totalTokens: dbSession.total_tokens,
        averageTokensPerMessage: dbSession.total_messages > 0 ? dbSession.total_tokens / dbSession.total_messages : 0,
        tokenEfficiencyTrend: [],
        participantStats: [],
        evolutionMarkers: [],
        efficiencyImprovement: dbSession.efficiency_score || 0,
        communicationPatterns: []
      },
      currentIteration: dbSession.current_iteration,
      participants: dbParticipants.map(p => ({
        id: p.id,
        name: p.name,
        provider: p.provider as any,
        model: p.model,
        temperature: p.temperature,
        config: p.config as any
      })),
      startedAt: new Date(dbSession.started_at),
      updatedAt: new Date(dbSession.updated_at),
      completedAt: dbSession.completed_at ? new Date(dbSession.completed_at) : undefined
    };
  }
}
