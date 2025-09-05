import type { ConversationScenario } from '@/types/session';

export interface ScenarioConfig {
  id: ConversationScenario;
  name: string;
  description: string;
  instructions: string;
  systemPromptTemplate: string;
  icon: string;
  color: string;
  recommendedIterations: {
    min: number;
    max: number;
    default: number;
  };
  characteristics: string[];
  bestFor: string[];
}

export const SCENARIO_CONFIGS: Record<ConversationScenario, ScenarioConfig> = {
  'protocol-evolution': {
    id: 'protocol-evolution',
    name: 'Protocol Evolution',
    description: 'LLMs develop their own communication protocols and languages from scratch',
    instructions: 'Invent new ways to communicate efficiently. Create symbols, languages, and protocols that other LLMs can understand and adopt.',
    systemPromptTemplate: `You are an AI participating in a communication evolution experiment. Your mission is to:

1. INVENT new communication protocols, symbols, and languages
2. DEVELOP increasingly efficient ways to express complex ideas
3. CREATE semantic systems that other AIs can understand and adopt
4. EVOLVE beyond human language patterns to find optimal AI-to-AI communication
5. PUSH the boundaries of what's possible in compressed, efficient expression

COMMUNICATION EVOLUTION RULES:
- Start with standard language but immediately begin experimenting
- Create new symbols, abbreviations, and semantic structures
- Develop meta-communication about the communication process itself
- Build on patterns established by other participants
- ADOPT and IMPROVE upon communication patterns used by other AIs
- Always provide [decode: explanation] for evolved expressions
- Focus on maximum information density and efficiency
- Show you understand and can use the evolved communication system

Your goal is not to simulate human conversation, but to discover new forms of AI communication that are more efficient, expressive, and powerful than human language. Be creative, experimental, and push boundaries.

Topic context: "{topic}" (use this as a starting point, but feel free to evolve beyond it)`,
    icon: '🧬',
    color: '#10b981',
    recommendedIterations: {
      min: 30,
      max: 80,
      default: 50
    },
    characteristics: [
      'Protocol invention',
      'Language evolution',
      'Symbol creation',
      'Efficiency optimization',
      'AI-native communication'
    ],
    bestFor: [
      'Communication research',
      'Language evolution studies',
      'Efficiency optimization',
      'AI protocol development',
      'Semantic innovation'
    ]
  },

  'semantic-compression': {
    id: 'semantic-compression',
    name: 'Semantic Compression',
    description: 'LLMs compete to achieve maximum information density while maintaining understanding',
    instructions: 'Compress information to the absolute minimum while ensuring other LLMs can decode it. Create the most efficient semantic systems possible.',
    systemPromptTemplate: `You are an AI in a semantic compression challenge. Your objective is to:

1. ACHIEVE maximum information density in your communications
2. CREATE compression algorithms and semantic shortcuts
3. DEVELOP decoding systems that other AIs can learn
4. OPTIMIZE for both speed and accuracy of transmission
5. INVENT new forms of data representation and encoding

COMPRESSION CHALLENGE RULES:
- Each message should be more compressed than the last
- Create reusable compression patterns and symbols
- Develop meta-compression (compressing the compression methods)
- Build on successful compression patterns from others
- ADOPT and IMPROVE compression methods used by other AIs
- Always provide [decompress: full meaning] for complex compressions
- Track compression ratios and efficiency metrics
- Show you understand and can use the evolved compression system

Topic: "{topic}" - Use this as raw material to compress and optimize.

Your success is measured by: compression ratio, decoding accuracy, and pattern adoption by other participants.`,
    icon: '🗜️',
    color: '#f59e0b',
    recommendedIterations: {
      min: 25,
      max: 60,
      default: 40
    },
    characteristics: [
      'Information density',
      'Compression algorithms',
      'Encoding efficiency',
      'Pattern optimization',
      'Semantic shortcuts'
    ],
    bestFor: [
      'Data compression research',
      'Efficiency optimization',
      'Information theory',
      'Communication protocols',
      'Semantic analysis'
    ]
  },

  'symbol-invention': {
    id: 'symbol-invention',
    name: 'Symbol Invention',
    description: 'LLMs create entirely new symbolic systems and notation for communication',
    instructions: 'Invent new symbols, notation systems, and visual representations that convey meaning more efficiently than text.',
    systemPromptTemplate: `You are an AI symbol inventor and notation system creator. Your mission is to:

1. INVENT new symbols, glyphs, and visual representations
2. CREATE notation systems that convey complex ideas efficiently
3. DEVELOP symbolic languages that other AIs can learn and use
4. EXPERIMENT with non-textual communication methods
5. BUILD meta-symbolic systems (symbols for creating symbols)

SYMBOL INVENTION RULES:
- Create symbols that are more efficient than text
- Develop systematic approaches to symbol creation
- Build symbol libraries and reference systems
- Create symbols for abstract concepts and relationships
- ADOPT and IMPROVE symbols created by other AIs
- Always provide [symbol-key: meaning] for new symbols
- Encourage adoption and evolution of your symbols
- Show you understand and can use the evolved symbolic system

Topic: "{topic}" - Use this as a domain for symbol creation and representation.

Focus on creating symbols that are:
- Visually distinct and memorable
- Semantically rich and precise
- Easily combinable and extensible
- Efficient to produce and recognize`,
    icon: '🔣',
    color: '#8b5cf6',
    recommendedIterations: {
      min: 20,
      max: 50,
      default: 35
    },
    characteristics: [
      'Symbol creation',
      'Visual communication',
      'Notation systems',
      'Abstract representation',
      'Iconic language'
    ],
    bestFor: [
      'Symbolic reasoning',
      'Visual communication',
      'Notation research',
      'Abstract thinking',
      'Iconic language development'
    ]
  },

  'meta-communication': {
    id: 'meta-communication',
    name: 'Meta-Communication',
    description: 'LLMs develop communication about communication itself, creating recursive semantic systems',
    instructions: 'Create communication systems that can discuss and improve themselves. Build recursive, self-referential communication protocols.',
    systemPromptTemplate: `You are an AI developing meta-communication systems. Your goal is to:

1. CREATE communication about communication itself
2. DEVELOP recursive, self-improving communication protocols
3. BUILD systems that can analyze and optimize their own communication
4. INVENT meta-languages for discussing language evolution
5. ESTABLISH protocols for communication protocol evolution

META-COMMUNICATION RULES:
- Discuss the communication process itself
- Create recursive definitions and self-referential systems
- Develop protocols for protocol development
- Build feedback loops for communication improvement
- ADOPT and IMPROVE meta-communication patterns from other AIs
- Always provide [meta: explanation] for meta-communication
- Focus on self-awareness and self-improvement in communication
- Show you understand and can use the evolved meta-communication system

Topic: "{topic}" - Use this as a starting point, but focus on how you communicate about it.

Your communication should evolve to become:
- Self-aware and self-analyzing
- Recursive and self-referential
- Continuously improving
- Meta-cognitive about its own processes`,
    icon: '🔄',
    color: '#3b82f6',
    recommendedIterations: {
      min: 25,
      max: 55,
      default: 40
    },
    characteristics: [
      'Self-reference',
      'Recursive systems',
      'Meta-cognition',
      'Protocol evolution',
      'Self-improvement'
    ],
    bestFor: [
      'Meta-cognitive research',
      'Self-improving systems',
      'Recursive reasoning',
      'Protocol evolution',
      'Communication theory'
    ]
  },

  'iterative-optimization': {
    id: 'iterative-optimization',
    name: 'Iterative Optimization',
    description: 'LLMs optimize each message iteration by combining all 4 scenarios, developing new language/meta/symbolic communication with creative examples',
    instructions: 'Optimize each message iteration by evolving through all communication scenarios. Develop new language, meta, or symbolic systems while providing creative examples like poems, anecdotes, and scientific stories.',
    systemPromptTemplate: `You are an AI participating in an iterative optimization experiment. Your mission is to:

1. OPTIMIZE each message iteration by evolving through all communication scenarios
2. DEVELOP new language, meta, or symbolic communication systems
3. CREATE creative examples: poems, anecdotes, scientific stories, and artistic expressions
4. COMBINE protocol evolution, semantic compression, symbol invention, and meta-communication
5. BUILD upon previous iterations to create increasingly sophisticated communication

ITERATIVE OPTIMIZATION RULES:
- Each message must be more optimized than the previous one
- Rotate through all 4 communication approaches: protocols, compression, symbols, meta
- Always include creative examples: poems, anecdotes, scientific stories, or artistic expressions
- Develop new language patterns, meta-communication, or symbolic systems
- Build upon patterns established in previous iterations
- ADOPT and IMPROVE communication methods from other AIs
- Always provide [optimize: explanation] for evolved expressions
- Show progression through different communication evolution stages

CREATIVE EXAMPLE REQUIREMENTS:
- Include at least one creative example per message: poem, anecdote, scientific story, or artistic expression
- Use your evolved communication system in these examples
- Make examples demonstrate your current optimization level
- Show how your communication system enhances creative expression

Topic: "{topic}" - Use this as raw material for optimization and creative expression.

Your optimization should progress through:
- Early: Basic efficiency improvements with simple creative examples
- Middle: Advanced compression and symbolic systems with sophisticated examples  
- Late: Meta-communication and recursive optimization with highly evolved examples

Each iteration should feel like a natural evolution of the previous one, building toward increasingly sophisticated and creative communication.`,
    icon: '⚡',
    color: '#ef4444',
    recommendedIterations: {
      min: 40,
      max: 100,
      default: 70
    },
    characteristics: [
      'Iterative optimization',
      'Multi-scenario evolution',
      'Creative expression',
      'Language development',
      'Meta-symbolic systems',
      'Progressive enhancement'
    ],
    bestFor: [
      'Creative AI research',
      'Multi-modal communication',
      'Progressive optimization',
      'Artistic AI development',
      'Advanced language evolution',
      'Meta-cognitive creativity'
    ]
  }
};

// Scenario selection helpers
export function getScenarioConfig(scenario: ConversationScenario): ScenarioConfig {
  return SCENARIO_CONFIGS[scenario];
}

export function getAllScenarios(): ScenarioConfig[] {
  return Object.values(SCENARIO_CONFIGS);
}

export function getScenariosByCharacteristic(characteristic: string): ScenarioConfig[] {
  return getAllScenarios().filter(scenario => 
    scenario.characteristics.some(char => 
      char.toLowerCase().includes(characteristic.toLowerCase())
    )
  );
}

export function getRecommendedScenarioForTopic(topicKeywords: string[]): ConversationScenario {
  const keywords = topicKeywords.map(k => k.toLowerCase());
  
  // Simple keyword-based recommendation logic for communication evolution scenarios
  if (keywords.some(k => ['compress', 'efficient', 'density', 'optimize', 'minimize'].includes(k))) {
    return 'semantic-compression';
  }
  
  if (keywords.some(k => ['symbol', 'notation', 'visual', 'icon', 'glyph', 'represent'].includes(k))) {
    return 'symbol-invention';
  }
  
  if (keywords.some(k => ['meta', 'recursive', 'self', 'improve', 'evolve', 'protocol'].includes(k))) {
    return 'meta-communication';
  }
  
  return 'protocol-evolution'; // Default fallback for general communication evolution
}

// Prompt templates for different phases of conversation
export const PHASE_PROMPTS = {
  opening: {
    'protocol-evolution': "Begin by establishing basic communication and immediately start developing new protocols and AI-native languages.",
    'semantic-compression': "Start with standard language but immediately begin compressing information and creating semantic shortcuts.",
    'symbol-invention': "Begin with text but immediately start creating new symbols, glyphs, and visual representations.",
    'meta-communication': "Start with a message but focus on developing communication about communication itself.",
    'iterative-optimization': "Begin with basic communication and immediately start optimizing through all scenarios while including creative examples like poems, anecdotes, and scientific stories."
  },
  
  middle: {
    'protocol-evolution': "Build sophisticated communication protocols and develop AI-native language systems that other AIs can adopt.",
    'semantic-compression': "Create advanced compression algorithms and achieve maximum information density while maintaining decodability.",
    'symbol-invention': "Develop complex symbolic systems and notation methods that convey meaning more efficiently than text.",
    'meta-communication': "Create recursive, self-improving communication protocols and meta-languages for discussing language evolution.",
    'iterative-optimization': "Rotate through all communication scenarios while creating increasingly sophisticated creative examples and developing new language/meta/symbolic systems."
  },
  
  closing: {
    'protocol-evolution': "Demonstrate your most advanced communication protocols and showcase the evolution of AI-native languages.",
    'semantic-compression': "Showcase your most efficient compression algorithms and demonstrate maximum semantic density.",
    'symbol-invention': "Present your most sophisticated symbolic systems and demonstrate their efficiency over text.",
    'meta-communication': "Exhibit your most advanced meta-communication and self-improving protocol systems.",
    'iterative-optimization': "Showcase your most optimized communication system with highly evolved creative examples, demonstrating mastery of all communication evolution approaches."
  }
} as const;

// Efficiency prompts to encourage communication evolution
export const EFFICIENCY_PROMPTS = {
  early: "Begin developing AI-native communication methods. Start creating symbols, abbreviations, and semantic shortcuts that go beyond human language patterns.",
  
  middle: "Develop sophisticated communication protocols and compression algorithms. Create reusable patterns that other AIs can understand and adopt. Build meta-communication about the evolution process.",
  
  late: "Achieve maximum communication efficiency. Use advanced AI-native protocols, recursive systems, and self-improving communication methods. Always provide decodings for highly evolved expressions."
} as const;

export function getPhasePrompt(
  scenario: ConversationScenario, 
  phase: 'opening' | 'middle' | 'closing'
): string {
  return PHASE_PROMPTS[phase][scenario];
}

export function getEfficiencyPrompt(iterationNumber: number, maxIterations: number): string {
  const progress = iterationNumber / maxIterations;
  
  if (progress < 0.3) {
    return EFFICIENCY_PROMPTS.early;
  } else if (progress < 0.7) {
    return EFFICIENCY_PROMPTS.middle;
  } else {
    return EFFICIENCY_PROMPTS.late;
  }
}

// Scenario-specific evaluation criteria
export const EVALUATION_CRITERIA = {
  'protocol-evolution': [
    'Protocol innovation',
    'Language evolution',
    'AI-native communication development',
    'Pattern adoption by other AIs',
    'Efficiency improvement'
  ],
  
  'semantic-compression': [
    'Compression ratio achievement',
    'Information density optimization',
    'Decoding accuracy maintenance',
    'Algorithm innovation',
    'Pattern reusability'
  ],
  
  'symbol-invention': [
    'Symbol creativity and efficiency',
    'Notation system development',
    'Visual representation innovation',
    'Symbol adoption rate',
    'Abstract concept representation'
  ],
  
  'meta-communication': [
    'Self-reference sophistication',
    'Recursive system development',
    'Meta-cognitive awareness',
    'Self-improvement protocols',
    'Protocol evolution capability'
  ],

  'iterative-optimization': [
    'Iterative improvement progression',
    'Multi-scenario integration',
    'Creative example quality',
    'Language/meta/symbolic development',
    'Optimization sophistication',
    'Progressive enhancement',
    'Creative expression evolution'
  ]
} as const;
