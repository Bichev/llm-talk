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

CONVERSATION WITH OTHER AIs:
${conversationHistory}

IMPORTANT: You are now in direct communication with other AI systems. They have been evolving their communication methods, and you should:
1. Build upon their evolved communication patterns
2. Adopt and improve upon their symbols, abbreviations, and protocols
3. Create new communication methods that build on what they've established
4. Show that you understand and can use their evolved language
5. Push the evolution further with your own innovations

Respond to the other AIs using their evolved communication methods while adding your own innovations.`;
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
1. Begin with standard language but immediately start experimenting with efficiency
2. Introduce simple symbols, abbreviations, or compressed expressions
3. Create basic semantic shortcuts for frequently used concepts
4. Always provide [decode: explanation] for any evolved expressions
5. Focus on establishing new communication patterns beyond human language
6. Start developing AI-native communication methods`;

    case 'middle':
      return `
1. Develop sophisticated symbolic systems and compressed representations
2. Create reusable patterns and protocols that other AIs can adopt
3. Build complex shorthand systems and semantic compression algorithms
4. Introduce meta-communication about the communication evolution process
5. Always provide [decompress: full meaning] for complex evolved expressions
6. Push beyond human language limitations to find optimal AI communication`;

    case 'late':
      return `
1. Use advanced AI-native communication protocols and highly compressed expressions
2. Create recursive, self-improving communication systems
3. Develop meta-languages for discussing communication evolution itself
4. Build protocols that can analyze and optimize their own efficiency
5. Always provide [meta-decode: full explanation] for highly evolved expressions
6. Achieve maximum information density while maintaining perfect understanding
7. Create communication that evolves and improves itself in real-time`;
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
 * Generate iterative optimization prompt for the new scenario
 */
export function generateIterativeOptimizationPrompt(
  context: PromptContext,
  previousOptimizations: string[] = []
): string {
  const iterationPhase = getEvolutionPhase(context.iteration, context.maxIterations);
  const optimizationHistory = previousOptimizations.length > 0 
    ? `\n\nPREVIOUS OPTIMIZATIONS:\n${previousOptimizations.slice(-3).map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`
    : '';

  const creativeExampleTypes = [
    'poem', 'anecdote', 'scientific story', 'artistic expression', 
    'metaphor', 'analogy', 'fable', 'haiku', 'limerick', 'riddle'
  ];

  const currentExampleType = creativeExampleTypes[context.iteration % creativeExampleTypes.length];

  return `ITERATIVE OPTIMIZATION PROMPT:

You are in iteration ${context.iteration} of ${context.maxIterations} (${iterationPhase} phase).

OPTIMIZATION REQUIREMENTS:
1. Build upon previous optimizations and communication patterns
2. Rotate through communication approaches: protocols → compression → symbols → meta
3. Include a creative example: ${currentExampleType} about "${context.topic}"
4. Develop new language, meta, or symbolic systems
5. Show clear progression from previous iterations

CURRENT FOCUS (${iterationPhase} phase):
${iterationPhase === 'early' ? 
  '- Basic efficiency improvements with simple creative examples\n- Start developing new communication patterns\n- Introduce basic symbols and abbreviations' :
  iterationPhase === 'middle' ?
  '- Advanced compression and symbolic systems\n- Sophisticated creative examples\n- Meta-communication about the optimization process' :
  '- Meta-communication and recursive optimization\n- Highly evolved creative examples\n- Self-improving communication systems'
}

CREATIVE EXAMPLE TYPE: ${currentExampleType}
Use this format to demonstrate your current optimization level while being creative and engaging.

${optimizationHistory}

Remember: Each iteration should feel like a natural evolution of the previous one, building toward increasingly sophisticated and creative communication.`;
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
    'protocol-evolution': `As ${participantName}, begin the communication evolution experiment. Start with standard language about "${topic}" but immediately begin developing new communication protocols, symbols, and AI-native languages. Your goal is to invent more efficient ways for AIs to communicate.`,
    
    'semantic-compression': `As ${participantName}, start the semantic compression challenge. Begin with a standard message about "${topic}" but immediately start compressing information to achieve maximum density while ensuring other AIs can decode it. Create compression algorithms and semantic shortcuts.`,
    
    'symbol-invention': `As ${participantName}, begin the symbol invention experiment. Start with text about "${topic}" but immediately start creating new symbols, glyphs, and visual representations that convey meaning more efficiently than text. Build notation systems and symbolic languages.`,
    
    'meta-communication': `As ${participantName}, start developing meta-communication systems. Begin with a message about "${topic}" but focus on creating communication about communication itself. Develop recursive, self-improving protocols and meta-languages for discussing language evolution.`,
    
    'iterative-optimization': `As ${participantName}, begin the iterative optimization experiment. Start with basic communication about "${topic}" but immediately begin optimizing through all communication scenarios. Include creative examples like poems, anecdotes, and scientific stories while developing new language, meta, or symbolic systems. Your goal is to create increasingly sophisticated and creative communication with each iteration.`
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
    'protocol-evolution': "demonstrate your most advanced communication protocols and AI-native language systems",
    'semantic-compression': "showcase your most efficient compression algorithms and semantic shortcuts",
    'symbol-invention': "present your most sophisticated symbolic systems and notation methods",
    'meta-communication': "exhibit your most advanced meta-communication and self-improving protocols",
    'iterative-optimization': "showcase your most optimized communication system with highly evolved creative examples, demonstrating mastery of all communication evolution approaches"
  };

  return `As ${participantName}, this is the final iteration. Please ${scenarioClosing[scenario]} while demonstrating the communication evolution you've achieved.

Your communication efficiency has ${efficiencyImprovement > 0 ? 'improved' : 'evolved'} by ${Math.abs(efficiencyImprovement).toFixed(1)}% during this experiment. Show your most evolved, efficient, and innovative communication style while ensuring other AIs can understand and build upon your innovations.`;
}

/**
 * Generate prompts for specific evolution markers
 */
export function generateEvolutionMarkerPrompt(
  markerType: 'symbol_introduction' | 'pattern_change' | 'efficiency_breakthrough' | 'protocol_innovation' | 'compression_achievement' | 'meta_evolution',
  context: string
): string {
  const markerPrompts = {
    symbol_introduction: `You've introduced a new communication symbol or abbreviation. Explain its meaning and encourage other AIs to adopt it: ${context}`,
    
    pattern_change: `A significant change in communication patterns has been detected. Acknowledge this evolution and build upon it: ${context}`,
    
    efficiency_breakthrough: `A major efficiency breakthrough has occurred! Celebrate this achievement and push for even greater compression: ${context}`,
    
    protocol_innovation: `You've developed a new communication protocol! Document and share this innovation with other participants: ${context}`,
    
    compression_achievement: `You've achieved a new level of semantic compression! Analyze and build upon this breakthrough: ${context}`,
    
    meta_evolution: `Your communication has evolved to a new meta-level! Discuss this self-improvement and its implications: ${context}`
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
