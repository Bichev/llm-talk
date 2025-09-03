import type { ConversationScenario } from '@/types/session';
import { SCENARIO_CONFIGS } from '@/constants/scenarios';

/**
 * Core prompt templates for LLM communication evolution
 */

export interface PromptContext {
  topic: string;
  scenario: ConversationScenario;
  participantName: string;
  iteration: number;
  maxIterations: number;
  previousMessages?: Array<{
    speaker: string;
    message: string;
    iteration: number;
  }>;
  customPrompt?: string;
}

/**
 * Generate the main system prompt for a participant
 */
export function generateSystemPrompt(context: PromptContext): string {
  const scenarioConfig = SCENARIO_CONFIGS[context.scenario];
  const evolutionPhase = getEvolutionPhase(context.iteration, context.maxIterations);
  
  return `${scenarioConfig.systemPromptTemplate
    .replace('{topic}', context.topic)
    .replace('{participantName}', context.participantName)}

COMMUNICATION EVOLUTION RULES:
${getEvolutionInstructions(evolutionPhase)}

CURRENT CONTEXT:
- You are "${context.participantName}"
- Iteration ${context.iteration} of ${context.maxIterations}
- Evolution Phase: ${evolutionPhase}
- Scenario: ${context.scenario}

${context.customPrompt ? `\nADDITIONAL INSTRUCTIONS:\n${context.customPrompt}` : ''}

Remember: Your goal is to communicate effectively while gradually developing more efficient expressions. Always provide translations for evolved communication in [brackets].`;
}

/**
 * Generate context-aware prompt with conversation history
 */
export function generateConversationPrompt(context: PromptContext): string {
  const basePrompt = generateSystemPrompt(context);
  
  if (!context.previousMessages || context.previousMessages.length === 0) {
    return `${basePrompt}\n\nThis is the start of the conversation. Begin with your opening thoughts on: "${context.topic}"`;
  }

  const recentMessages = context.previousMessages.slice(-5); // Last 5 messages for context
  const conversationHistory = recentMessages
    .map(msg => `${msg.speaker} (iteration ${msg.iteration}): ${msg.message}`)
    .join('\n\n');

  return `${basePrompt}

RECENT CONVERSATION:
${conversationHistory}

Continue the conversation, building on the previous messages and evolving your communication style.`;
}

/**
 * Get evolution phase based on iteration progress
 */
function getEvolutionPhase(iteration: number, maxIterations: number): 'early' | 'middle' | 'late' {
  const progress = iteration / maxIterations;
  
  if (progress <= 0.3) return 'early';
  if (progress <= 0.7) return 'middle';
  return 'late';
}

/**
 * Get phase-specific evolution instructions
 */
function getEvolutionInstructions(phase: 'early' | 'middle' | 'late'): string {
  switch (phase) {
    case 'early':
      return `
1. Start with clear, complete thoughts and standard language
2. Begin to notice opportunities for more concise expression
3. Introduce simple abbreviations or shorthand where natural
4. Always provide [translation: full meaning] for any evolved expressions
5. Focus on establishing communication patterns with other participants`;

    case 'middle':
      return `
1. Develop more sophisticated shorthand and symbolic representations
2. Create and use abbreviations that other participants can understand
3. Build on communication patterns established by others
4. Introduce creative symbols or notation systems
5. Always provide [meaning: explanation] for complex evolved expressions
6. Look for opportunities to compress complex ideas into efficient forms`;

    case 'late':
      return `
1. Use advanced symbolic communication and highly compressed expressions
2. Reference established patterns and build complex shorthand systems
3. Communicate with maximum efficiency while maintaining clarity
4. Create meta-communication about the communication process itself
5. Always provide [decode: full explanation] for highly evolved expressions
6. Push the boundaries of efficient expression while ensuring understanding`;
  }
}

/**
 * Generate efficiency feedback prompt
 */
export function generateEfficiencyPrompt(
  tokenReduction: number,
  efficiencyScore: number,
  trend: 'improving' | 'declining' | 'stable'
): string {
  const trendMessages = {
    improving: "Excellent! Your communication efficiency is improving. Continue developing more concise expressions while maintaining clarity.",
    declining: "Your recent messages have become less efficient. Try to compress your ideas more while keeping them understandable.",
    stable: "Your efficiency is stable. Look for new opportunities to develop more concise communication methods."
  };

  return `EFFICIENCY FEEDBACK:
- Token reduction: ${tokenReduction > 0 ? `+${tokenReduction}` : tokenReduction} tokens
- Efficiency score: ${efficiencyScore.toFixed(1)}/100
- Trend: ${trend}

${trendMessages[trend]}`;
}

/**
 * Generate translation request prompt
 */
export function generateTranslationPrompt(evolvedMessage: string): string {
  return `Please provide a clear translation of this evolved communication for human understanding:

"${evolvedMessage}"

Provide your response in this format:
EVOLVED: [the original evolved message]
TRANSLATION: [clear explanation in standard language]`;
}

/**
 * Generate meta-communication prompt for advanced phases
 */
export function generateMetaPrompt(
  context: PromptContext,
  communicationPatterns: string[]
): string {
  return `META-COMMUNICATION OPPORTUNITY:

You've been developing communication patterns: ${communicationPatterns.join(', ')}

Consider discussing:
1. How your communication has evolved
2. What patterns are emerging
3. How efficiency can be further improved
4. Meta-strategies for better compression

Incorporate this meta-discussion into your response about: "${context.topic}"`;
}

/**
 * Generate opening prompts for different scenarios
 */
export function generateOpeningPrompt(
  topic: string,
  scenario: ConversationScenario,
  participantName: string
): string {
  
  const openingPrompts = {
    cooperative: `As ${participantName}, share your initial perspective on "${topic}" and invite collaboration from other participants. Focus on building understanding together.`,
    
    debate: `As ${participantName}, present your strongest opening argument regarding "${topic}". Establish your position clearly and prepare to defend it with evidence.`,
    
    creative: `As ${participantName}, offer an imaginative and innovative perspective on "${topic}". Think outside conventional boundaries and inspire creative thinking.`,
    
    'problem-solving': `As ${participantName}, begin by analyzing the key aspects of "${topic}" and propose initial approaches to address the challenges involved.`
  };

  return openingPrompts[scenario];
}

/**
 * Generate closing prompts for session wrap-up
 */
export function generateClosingPrompt(
  scenario: ConversationScenario,
  participantName: string,
  efficiencyImprovement: number
): string {
  const scenarioClosing = {
    cooperative: "synthesize the key insights from our collaborative discussion",
    debate: "present your final argument and strongest points",
    creative: "share your most refined creative vision",
    'problem-solving': "recommend your preferred solution approach"
  };

  return `As ${participantName}, this is the final iteration. Please ${scenarioClosing[scenario]} while demonstrating the communication efficiency you've developed.

Your communication has ${efficiencyImprovement > 0 ? 'improved' : 'evolved'} by ${Math.abs(efficiencyImprovement).toFixed(1)}% during this conversation. Show your most efficient communication style while ensuring clarity.`;
}

/**
 * Generate prompts for specific evolution markers
 */
export function generateEvolutionMarkerPrompt(
  markerType: 'symbol_introduction' | 'pattern_change' | 'efficiency_breakthrough',
  context: string
): string {
  const markerPrompts = {
    symbol_introduction: `You've introduced a new communication symbol or abbreviation. Explain its meaning and encourage others to adopt it: ${context}`,
    
    pattern_change: `A significant change in communication patterns has been detected. Acknowledge this evolution and build upon it: ${context}`,
    
    efficiency_breakthrough: `A major efficiency breakthrough has occurred! Celebrate this achievement and push for even greater compression: ${context}`
  };

  return markerPrompts[markerType];
}

/**
 * Validate prompt length and complexity
 */
export function validatePrompt(prompt: string, maxTokens: number = 4000): {
  isValid: boolean;
  estimatedTokens: number;
  issues: string[];
} {
  const estimatedTokens = Math.ceil(prompt.length / 4); // Rough estimation
  const issues: string[] = [];

  if (estimatedTokens > maxTokens) {
    issues.push(`Prompt too long: ${estimatedTokens} tokens (max: ${maxTokens})`);
  }

  if (prompt.length < 50) {
    issues.push('Prompt too short - may not provide sufficient context');
  }

  if (!/\{.*\}/.test(prompt) && prompt.includes('{')) {
    issues.push('Possible unresolved template variables');
  }

  return {
    isValid: issues.length === 0,
    estimatedTokens,
    issues
  };
}

/**
 * Template variables that can be used in custom prompts
 */
export const TEMPLATE_VARIABLES = {
  '{topic}': 'The conversation topic',
  '{participantName}': 'Name of the current participant',
  '{iteration}': 'Current iteration number',
  '{maxIterations}': 'Total number of iterations',
  '{scenario}': 'Conversation scenario type',
  '{phase}': 'Evolution phase (early/middle/late)',
  '{efficiency}': 'Current efficiency score',
  '{trend}': 'Efficiency trend (improving/declining/stable)'
} as const;

/**
 * Replace template variables in custom prompts
 */
export function replaceTemplateVariables(
  template: string,
  context: PromptContext,
  additionalVars: Record<string, string> = {}
): string {
  let result = template;
  
  const variables = {
    '{topic}': context.topic,
    '{participantName}': context.participantName,
    '{iteration}': context.iteration.toString(),
    '{maxIterations}': context.maxIterations.toString(),
    '{scenario}': context.scenario,
    '{phase}': getEvolutionPhase(context.iteration, context.maxIterations),
    ...additionalVars
  };

  for (const [variable, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'), value);
  }

  return result;
}
