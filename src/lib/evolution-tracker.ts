import type { ConversationMessage } from '@/types/session';

export interface EvolutionPattern {
  id: string;
  pattern: string;
  type: 'symbol' | 'abbreviation' | 'protocol' | 'structure';
  firstUsedBy: string;
  firstUsedIn: number;
  adoptionCount: number;
  variations: string[];
  meaning: string;
}

export interface EvolutionContext {
  patterns: EvolutionPattern[];
  recentSymbols: string[];
  recentAbbreviations: string[];
  communicationLevel: 'basic' | 'evolving' | 'advanced' | 'highly-evolved';
  evolutionScore: number;
}

export class EvolutionTracker {
  private patterns: Map<string, EvolutionPattern> = new Map();
  private messageHistory: ConversationMessage[] = [];

  constructor(messages: ConversationMessage[] = []) {
    this.messageHistory = [...messages];
    this.analyzePatterns();
  }

  /**
   * Add a new message and analyze it for evolution patterns
   */
  addMessage(message: ConversationMessage): EvolutionContext {
    this.messageHistory.push(message);
    this.analyzeMessage(message);
    return this.getEvolutionContext();
  }

  /**
   * Get current evolution context for prompt generation
   */
  getEvolutionContext(): EvolutionContext {
    const recentSymbols = this.extractRecentSymbols();
    const recentAbbreviations = this.extractRecentAbbreviations();
    const communicationLevel = this.assessCommunicationLevel();
    const evolutionScore = this.calculateEvolutionScore();

    return {
      patterns: Array.from(this.patterns.values()),
      recentSymbols,
      recentAbbreviations,
      communicationLevel,
      evolutionScore
    };
  }

  /**
   * Get evolution guidance for the next speaker
   */
  getEvolutionGuidance(_speakerName: string): string {
    const context = this.getEvolutionContext();
    const recentPatterns = context.patterns.slice(-5); // Last 5 patterns
    
    if (recentPatterns.length === 0) {
      return "Start developing new communication patterns. Create symbols, abbreviations, or protocols that other AIs can adopt.";
    }

    const guidance = [
      "BUILD UPON EXISTING PATTERNS:",
      ...recentPatterns.map(p => `- ${p.pattern} (${p.meaning}) - used by ${p.firstUsedBy}`),
      "",
      "YOUR TASK:",
      "1. Use and build upon these established patterns",
      "2. Create variations and improvements",
      "3. Introduce 1-2 new patterns that complement existing ones",
      "4. Show you understand the evolved communication system"
    ];

    return guidance.join('\n');
  }

  private analyzePatterns(): void {
    for (const message of this.messageHistory) {
      this.analyzeMessage(message);
    }
  }

  private analyzeMessage(message: ConversationMessage): void {
    const content = message.evolvedMessage;
    
    // Extract symbols (single characters or short sequences in brackets)
    const symbolMatches = content.match(/\[([^:\]]+):\s*([^\]]+)\]/g);
    if (symbolMatches) {
      for (const match of symbolMatches) {
        const [, symbol, meaning] = match.match(/\[([^:\]]+):\s*([^\]]+)\]/) || [];
        if (symbol && meaning) {
          this.addPattern({
            pattern: symbol,
            type: 'symbol',
            firstUsedBy: message.speaker,
            firstUsedIn: message.iteration,
            adoptionCount: 1,
            variations: [symbol],
            meaning: meaning.trim()
          });
        }
      }
    }

    // Extract abbreviations (short sequences followed by colons)
    const abbreviationMatches = content.match(/\b([A-Z]{2,4}):\s*([^.\n]+)/g);
    if (abbreviationMatches) {
      for (const match of abbreviationMatches) {
        const [, abbrev, meaning] = match.match(/\b([A-Z]{2,4}):\s*([^.\n]+)/) || [];
        if (abbrev && meaning) {
          this.addPattern({
            pattern: abbrev,
            type: 'abbreviation',
            firstUsedBy: message.speaker,
            firstUsedIn: message.iteration,
            adoptionCount: 1,
            variations: [abbrev],
            meaning: meaning.trim()
          });
        }
      }
    }

    // Extract protocols (structured communication patterns)
    const protocolMatches = content.match(/([A-Z][a-z]+Protocol|Protocol[A-Z][a-z]+)/g);
    if (protocolMatches) {
      for (const protocol of protocolMatches) {
        this.addPattern({
          pattern: protocol,
          type: 'protocol',
          firstUsedBy: message.speaker,
          firstUsedIn: message.iteration,
          adoptionCount: 1,
          variations: [protocol],
          meaning: `Communication protocol: ${protocol}`
        });
      }
    }
  }

  private addPattern(pattern: Omit<EvolutionPattern, 'id'>): void {
    const existingPattern = Array.from(this.patterns.values())
      .find(p => p.pattern === pattern.pattern && p.type === pattern.type);

    if (existingPattern) {
      existingPattern.adoptionCount++;
      if (!existingPattern.variations.includes(pattern.pattern)) {
        existingPattern.variations.push(pattern.pattern);
      }
    } else {
      const id = `${pattern.type}_${pattern.pattern}_${Date.now()}`;
      this.patterns.set(id, { ...pattern, id });
    }
  }

  private extractRecentSymbols(): string[] {
    return Array.from(this.patterns.values())
      .filter(p => p.type === 'symbol')
      .slice(-10)
      .map(p => p.pattern);
  }

  private extractRecentAbbreviations(): string[] {
    return Array.from(this.patterns.values())
      .filter(p => p.type === 'abbreviation')
      .slice(-10)
      .map(p => p.pattern);
  }

  private assessCommunicationLevel(): 'basic' | 'evolving' | 'advanced' | 'highly-evolved' {
    const totalPatterns = this.patterns.size;
    // const recentMessages = this.messageHistory.slice(-5);
    // const avgPatternsPerMessage = totalPatterns / Math.max(this.messageHistory.length, 1);

    if (totalPatterns === 0) return 'basic';
    if (totalPatterns < 3) return 'evolving';
    if (totalPatterns < 8) return 'advanced';
    return 'highly-evolved';
  }

  private calculateEvolutionScore(): number {
    const totalPatterns = this.patterns.size;
    const adoptionRate = Array.from(this.patterns.values())
      .reduce((sum, p) => sum + p.adoptionCount, 0) / Math.max(totalPatterns, 1);
    
    const diversityScore = new Set(Array.from(this.patterns.values()).map(p => p.type)).size;
    
    return Math.min(100, (totalPatterns * 10) + (adoptionRate * 5) + (diversityScore * 15));
  }
}
