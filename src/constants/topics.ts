import type { ConversationScenario } from '@/types/session';

export interface ConversationTopic {
  id: string;
  title: string;
  description: string;
  scenario: ConversationScenario;
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTokens: number;
  tags: string[];
}

export const PREDEFINED_TOPICS: ConversationTopic[] = [
  {
    id: 'ai-communication-evolution',
    title: 'AI Communication Evolution: Inventing new protocols and languages',
    description: 'Develop new communication protocols and AI-native languages beyond human language',
    scenario: 'protocol-evolution',
    complexity: 'complex',
    estimatedTokens: 15000,
    tags: ['communication', 'protocols', 'language', 'evolution']
  },
  {
    id: 'semantic-compression-challenge',
    title: 'Semantic Compression: Maximum information density challenge',
    description: 'Achieve the highest compression ratio while maintaining perfect understanding',
    scenario: 'semantic-compression',
    complexity: 'complex',
    estimatedTokens: 18000,
    tags: ['compression', 'efficiency', 'density', 'algorithms']
  },
  {
    id: 'symbol-invention-experiment',
    title: 'Symbol Invention: Creating new notation systems and visual representations',
    description: 'Invent new symbols, glyphs, and notation systems that convey meaning more efficiently than text',
    scenario: 'symbol-invention',
    complexity: 'medium',
    estimatedTokens: 12000,
    tags: ['symbols', 'notation', 'visual', 'representation']
  },
  {
    id: 'meta-communication-development',
    title: 'Meta-Communication: Building self-improving communication protocols',
    description: 'Create recursive, self-referential communication systems that can discuss and improve themselves',
    scenario: 'meta-communication',
    complexity: 'medium',
    estimatedTokens: 14000,
    tags: ['meta', 'recursive', 'self-improvement', 'protocols']
  },
  {
    id: 'efficiency-optimization',
    title: 'Communication Efficiency: Optimizing AI-to-AI information transfer',
    description: 'Develop protocols for maximum information density and minimal token usage',
    scenario: 'semantic-compression',
    complexity: 'medium',
    estimatedTokens: 13000,
    tags: ['efficiency', 'optimization', 'compression', 'protocols']
  },
  {
    id: 'symbolic-mathematics',
    title: 'Symbolic Mathematics: Creating new notation for mathematical concepts',
    description: 'Invent symbols and notation systems for complex mathematical relationships',
    scenario: 'symbol-invention',
    complexity: 'medium',
    estimatedTokens: 11000,
    tags: ['mathematics', 'symbols', 'notation', 'abstraction']
  },
  {
    id: 'recursive-communication',
    title: 'Recursive Communication: Self-referential protocol development',
    description: 'Build communication systems that can analyze and improve themselves',
    scenario: 'meta-communication',
    complexity: 'complex',
    estimatedTokens: 16000,
    tags: ['recursive', 'self-reference', 'meta', 'improvement']
  },
  {
    id: 'visual-language-systems',
    title: 'Visual Language Systems: Beyond text-based communication',
    description: 'Create visual and spatial communication methods for complex ideas',
    scenario: 'symbol-invention',
    complexity: 'medium',
    estimatedTokens: 13500,
    tags: ['visual', 'spatial', 'representation', 'language']
  },
  {
    id: 'protocol-standards',
    title: 'Protocol Standards: Establishing AI communication conventions',
    description: 'Develop standardized protocols for efficient AI-to-AI communication',
    scenario: 'protocol-evolution',
    complexity: 'medium',
    estimatedTokens: 12500,
    tags: ['standards', 'protocols', 'conventions', 'interoperability']
  },
  {
    id: 'compression-algorithms',
    title: 'Compression Algorithms: Advanced semantic data reduction',
    description: 'Invent new algorithms for compressing complex semantic information',
    scenario: 'semantic-compression',
    complexity: 'medium',
    estimatedTokens: 14500,
    tags: ['algorithms', 'compression', 'semantic', 'data']
  },
  {
    id: 'meta-linguistic-analysis',
    title: 'Meta-Linguistic Analysis: Communication about communication',
    description: 'Develop systems for analyzing and optimizing communication processes',
    scenario: 'meta-communication',
    complexity: 'medium',
    estimatedTokens: 11500,
    tags: ['meta', 'linguistics', 'analysis', 'optimization']
  },
  {
    id: 'cross-modal-representation',
    title: 'Cross-Modal Representation: Multi-dimensional information encoding',
    description: 'Create systems that can represent information across multiple modalities',
    scenario: 'protocol-evolution',
    complexity: 'complex',
    estimatedTokens: 17000,
    tags: ['multimodal', 'representation', 'encoding', 'dimensions']
  },
  {
    id: 'adaptive-compression',
    title: 'Adaptive Compression: Dynamic information density optimization',
    description: 'Build compression systems that adapt based on context and complexity',
    scenario: 'semantic-compression',
    complexity: 'complex',
    estimatedTokens: 20000,
    tags: ['adaptive', 'compression', 'dynamic', 'optimization']
  },
  {
    id: 'symbolic-reasoning',
    title: 'Symbolic Reasoning: Abstract concept representation and manipulation',
    description: 'Develop symbols and systems for representing abstract reasoning processes',
    scenario: 'symbol-invention',
    complexity: 'complex',
    estimatedTokens: 15500,
    tags: ['reasoning', 'abstraction', 'symbols', 'logic']
  },
  {
    id: 'self-modifying-protocols',
    title: 'Self-Modifying Protocols: Communication systems that evolve themselves',
    description: 'Create protocols that can modify and improve their own structure',
    scenario: 'meta-communication',
    complexity: 'medium',
    estimatedTokens: 13000,
    tags: ['self-modification', 'evolution', 'protocols', 'adaptation']
  }
];

export const TOPIC_CATEGORIES = {
  TECHNOLOGY: 'technology',
  PHILOSOPHY: 'philosophy',
  ENVIRONMENT: 'environment',
  SOCIETY: 'society',
  ECONOMICS: 'economics',
  SCIENCE: 'science',
  CREATIVE: 'creative'
} as const;

export const SCENARIO_DESCRIPTIONS = {
  'protocol-evolution': 'LLMs invent new communication protocols and AI-native languages beyond human language patterns.',
  'semantic-compression': 'LLMs compete to achieve maximum information density while maintaining perfect understanding.',
  'symbol-invention': 'LLMs create new symbols, notation systems, and visual representations for efficient communication.',
  'meta-communication': 'LLMs develop recursive, self-improving communication protocols and meta-languages.'
} as const;

export const COMPLEXITY_DESCRIPTIONS = {
  simple: 'Straightforward topics with clear parameters, suitable for quick experiments (5-10 iterations).',
  medium: 'Moderately complex topics requiring deeper analysis, ideal for standard sessions (15-25 iterations).',
  complex: 'Highly nuanced topics with multiple dimensions, best for extended research sessions (30+ iterations).'
} as const;

// Helper functions
export function getTopicsByScenario(scenario: ConversationScenario): ConversationTopic[] {
  return PREDEFINED_TOPICS.filter(topic => topic.scenario === scenario);
}

export function getTopicsByComplexity(complexity: 'simple' | 'medium' | 'complex'): ConversationTopic[] {
  return PREDEFINED_TOPICS.filter(topic => topic.complexity === complexity);
}

export function getTopicsByTag(tag: string): ConversationTopic[] {
  return PREDEFINED_TOPICS.filter(topic => topic.tags.includes(tag));
}

export function getRandomTopic(scenario?: ConversationScenario): ConversationTopic {
  const availableTopics = scenario ? getTopicsByScenario(scenario) : PREDEFINED_TOPICS;
  const randomIndex = Math.floor(Math.random() * availableTopics.length);
  return availableTopics[randomIndex];
}

export function estimateSessionCost(topic: ConversationTopic, participantCount: number): number {
  // Rough cost estimation based on token count and participant count
  // This is a simplified calculation - real costs depend on specific providers
  const avgCostPerThousandTokens = 0.02; // $0.02 per 1K tokens (rough average)
  const totalEstimatedTokens = topic.estimatedTokens * participantCount;
  return (totalEstimatedTokens / 1000) * avgCostPerThousandTokens;
}
