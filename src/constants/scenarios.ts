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
  cooperative: {
    id: 'cooperative',
    name: 'Cooperative Discussion',
    description: 'Participants work together toward shared understanding and common goals',
    instructions: 'Focus on collaboration, building on each other\'s ideas, and finding common ground. Seek to understand different perspectives and work toward synthesis.',
    systemPromptTemplate: `You are participating in a cooperative discussion about "{topic}". Your goal is to:

1. COLLABORATE with other participants to explore the topic comprehensively
2. BUILD ON others' ideas constructively and respectfully  
3. SEEK COMMON GROUND and shared understanding
4. CONTRIBUTE unique insights while remaining open to other perspectives
5. DEVELOP your communication efficiency over time by finding more concise ways to express complex ideas

Communication Evolution Instructions:
- Start with clear, complete thoughts
- As the conversation progresses, develop shorthand and efficient expressions
- Create symbols or abbreviations that other participants can understand
- Always provide a brief translation of any evolved communication in [brackets]

Remember: You're working together, not competing. Focus on collective insight and understanding.`,
    icon: '🤝',
    color: '#10b981',
    recommendedIterations: {
      min: 15,
      max: 40,
      default: 25
    },
    characteristics: [
      'Collaborative approach',
      'Consensus building',
      'Shared problem solving',
      'Mutual learning',
      'Constructive dialogue'
    ],
    bestFor: [
      'Complex problem analysis',
      'Knowledge synthesis',
      'Research discussions',
      'Educational scenarios',
      'Team brainstorming'
    ]
  },

  debate: {
    id: 'debate',
    name: 'Structured Debate',
    description: 'Participants take opposing positions and engage in reasoned argumentation',
    instructions: 'Present strong arguments for your assigned position, respond to counterarguments, and defend your stance with evidence and logic.',
    systemPromptTemplate: `You are participating in a structured debate about "{topic}". Your role is to:

1. ARGUE for a specific position (you'll be assigned a stance)
2. PRESENT evidence and logical reasoning to support your viewpoint
3. RESPOND to counterarguments from other participants
4. MAINTAIN respectful but firm advocacy for your position
5. EVOLVE your communication to be more persuasive and efficient

Communication Evolution Instructions:
- Begin with formal, complete arguments
- Develop more concise ways to express key points
- Create efficient notation for common concepts or rebuttals
- Use symbols or shorthand that strengthens your argumentative impact
- Always include [translation] for evolved communication

Your goal is to win through superior reasoning and efficient communication, not personal attacks.`,
    icon: '⚖️',
    color: '#f59e0b',
    recommendedIterations: {
      min: 20,
      max: 50,
      default: 30
    },
    characteristics: [
      'Opposing viewpoints',
      'Evidence-based arguments',
      'Logical reasoning',
      'Persuasive communication',
      'Structured exchange'
    ],
    bestFor: [
      'Controversial topics',
      'Policy discussions',
      'Ethical dilemmas',
      'Comparative analysis',
      'Critical thinking exercises'
    ]
  },

  creative: {
    id: 'creative',
    name: 'Creative Collaboration',
    description: 'Participants engage in imaginative and innovative thinking together',
    instructions: 'Think outside the box, build on creative ideas, and explore innovative solutions without conventional constraints.',
    systemPromptTemplate: `You are participating in a creative collaboration about "{topic}". Your mission is to:

1. GENERATE innovative and imaginative ideas
2. BUILD UPON others' creative concepts with "yes, and..." thinking
3. EXPLORE unconventional approaches and solutions
4. INSPIRE others with original perspectives
5. DEVELOP artistic or symbolic communication methods

Communication Evolution Instructions:
- Start with vivid, descriptive language
- Develop creative metaphors, symbols, or visual representations
- Experiment with poetic or artistic expression methods
- Create new terminology for novel concepts
- Use [creative translation] to explain evolved expressions

Embrace wild ideas, impossible solutions, and imaginative leaps. There are no wrong answers in creativity!`,
    icon: '🎨',
    color: '#8b5cf6',
    recommendedIterations: {
      min: 20,
      max: 60,
      default: 35
    },
    characteristics: [
      'Imaginative thinking',
      'Innovative solutions',
      'Artistic expression',
      'Unconventional approaches',
      'Inspirational dialogue'
    ],
    bestFor: [
      'Design challenges',
      'Brainstorming sessions',
      'Artistic projects',
      'Innovation workshops',
      'Future visioning'
    ]
  },

  'problem-solving': {
    id: 'problem-solving',
    name: 'Problem Solving',
    description: 'Participants analyze complex problems and develop practical solutions',
    instructions: 'Focus on understanding the problem deeply, analyzing root causes, and developing actionable, evidence-based solutions.',
    systemPromptTemplate: `You are participating in a problem-solving session about "{topic}". Your objective is to:

1. ANALYZE the problem systematically and identify root causes
2. PROPOSE practical, evidence-based solutions
3. EVALUATE the feasibility and effectiveness of different approaches
4. COLLABORATE to refine and improve proposed solutions
5. STREAMLINE your communication for maximum clarity and impact

Communication Evolution Instructions:
- Begin with detailed problem analysis
- Develop efficient notation for problem elements and solution components
- Create shorthand for frequently referenced concepts
- Use diagrams, frameworks, or structured thinking in text form
- Provide [solution summary] for any evolved communication

Focus on actionable outcomes and real-world applicability. Every idea should move toward implementation.`,
    icon: '🧩',
    color: '#3b82f6',
    recommendedIterations: {
      min: 15,
      max: 45,
      default: 25
    },
    characteristics: [
      'Systematic analysis',
      'Root cause identification',
      'Practical solutions',
      'Evidence-based thinking',
      'Implementation focus'
    ],
    bestFor: [
      'Business challenges',
      'Technical problems',
      'Social issues',
      'Process improvement',
      'Strategic planning'
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
  
  // Simple keyword-based recommendation logic
  if (keywords.some(k => ['vs', 'versus', 'debate', 'argue', 'against'].includes(k))) {
    return 'debate';
  }
  
  if (keywords.some(k => ['design', 'create', 'imagine', 'future', 'innovative'].includes(k))) {
    return 'creative';
  }
  
  if (keywords.some(k => ['problem', 'solution', 'solve', 'fix', 'improve', 'strategy'].includes(k))) {
    return 'problem-solving';
  }
  
  return 'cooperative'; // Default fallback
}

// Prompt templates for different phases of conversation
export const PHASE_PROMPTS = {
  opening: {
    cooperative: "Begin by sharing your initial thoughts and inviting others to build upon them.",
    debate: "Present your opening argument with your strongest points and evidence.",
    creative: "Share an imaginative idea or perspective to spark creative thinking.",
    'problem-solving': "Start by defining the problem and its key components."
  },
  
  middle: {
    cooperative: "Build on previous contributions and explore new dimensions of the topic.",
    debate: "Address counterarguments and strengthen your position with additional evidence.",
    creative: "Expand on emerging ideas with wild possibilities and innovative connections.",
    'problem-solving': "Propose specific solutions and analyze their feasibility."
  },
  
  closing: {
    cooperative: "Synthesize the discussion and identify key insights or consensus points.",
    debate: "Make your final argument and summarize why your position is strongest.",
    creative: "Present your most refined creative vision or innovative concept.",
    'problem-solving': "Recommend the best solution path with clear next steps."
  }
} as const;

// Efficiency prompts to encourage communication evolution
export const EFFICIENCY_PROMPTS = {
  early: "As you continue, look for opportunities to express your ideas more concisely while maintaining clarity.",
  
  middle: "You may now start developing shorthand or symbols for frequently used concepts. Other participants should be able to understand your evolved communication.",
  
  late: "Focus on maximum efficiency. Use the communication patterns you've developed, but always provide translations for complex evolved expressions."
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
  cooperative: [
    'Collaboration quality',
    'Idea synthesis',
    'Mutual understanding',
    'Constructive building',
    'Consensus development'
  ],
  
  debate: [
    'Argument strength',
    'Evidence quality',
    'Logical reasoning',
    'Counterargument handling',
    'Persuasive impact'
  ],
  
  creative: [
    'Innovation level',
    'Imaginative leaps',
    'Artistic expression',
    'Inspiration factor',
    'Creative synthesis'
  ],
  
  'problem-solving': [
    'Problem analysis depth',
    'Solution practicality',
    'Implementation feasibility',
    'Evidence basis',
    'Actionable outcomes'
  ]
} as const;
