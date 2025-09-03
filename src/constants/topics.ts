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
    id: 'ai-evolution',
    title: 'Evolution of AI and impact on humanity in the 21st century',
    description: 'Discuss the trajectory of AI development and its societal implications',
    scenario: 'debate',
    complexity: 'complex',
    estimatedTokens: 15000,
    tags: ['technology', 'society', 'future', 'ethics']
  },
  {
    id: 'consciousness-philosophy',
    title: 'Philosophy of consciousness: Are we just biological machines?',
    description: 'Explore the nature of consciousness and the mind-body problem',
    scenario: 'debate',
    complexity: 'complex',
    estimatedTokens: 18000,
    tags: ['philosophy', 'consciousness', 'cognition', 'materialism']
  },
  {
    id: 'climate-solutions',
    title: 'Climate change solutions: Technology vs. behavioral change',
    description: 'Compare technological innovations with lifestyle changes for climate action',
    scenario: 'problem-solving',
    complexity: 'medium',
    estimatedTokens: 12000,
    tags: ['environment', 'technology', 'behavior', 'sustainability']
  },
  {
    id: 'future-of-work',
    title: 'The future of work: Will AI replace human creativity?',
    description: 'Analyze the impact of AI on creative industries and human employment',
    scenario: 'debate',
    complexity: 'medium',
    estimatedTokens: 14000,
    tags: ['work', 'creativity', 'automation', 'economy']
  },
  {
    id: 'privacy-vs-security',
    title: 'Digital privacy vs. security: Where should the line be drawn?',
    description: 'Balance individual privacy rights with collective security needs',
    scenario: 'debate',
    complexity: 'medium',
    estimatedTokens: 13000,
    tags: ['privacy', 'security', 'rights', 'surveillance']
  },
  {
    id: 'space-colonization',
    title: 'Space colonization: Humanity\'s next chapter or expensive distraction?',
    description: 'Evaluate the merits and drawbacks of space exploration and colonization',
    scenario: 'debate',
    complexity: 'medium',
    estimatedTokens: 11000,
    tags: ['space', 'exploration', 'resources', 'priorities']
  },
  {
    id: 'genetic-engineering',
    title: 'Genetic engineering: Playing God or solving humanity\'s problems?',
    description: 'Discuss the ethics and potential of genetic modification technologies',
    scenario: 'debate',
    complexity: 'complex',
    estimatedTokens: 16000,
    tags: ['genetics', 'ethics', 'medicine', 'enhancement']
  },
  {
    id: 'universal-basic-income',
    title: 'Universal Basic Income: Economic necessity or utopian dream?',
    description: 'Analyze the feasibility and implications of UBI policies',
    scenario: 'problem-solving',
    complexity: 'medium',
    estimatedTokens: 13500,
    tags: ['economics', 'policy', 'welfare', 'automation']
  },
  {
    id: 'education-revolution',
    title: 'Revolutionizing education: AI tutors vs. human teachers',
    description: 'Compare AI-powered learning with traditional educational approaches',
    scenario: 'cooperative',
    complexity: 'medium',
    estimatedTokens: 12500,
    tags: ['education', 'learning', 'technology', 'pedagogy']
  },
  {
    id: 'social-media-impact',
    title: 'Social media\'s impact on democracy and public discourse',
    description: 'Examine how social platforms affect political processes and social cohesion',
    scenario: 'debate',
    complexity: 'medium',
    estimatedTokens: 14500,
    tags: ['social-media', 'democracy', 'discourse', 'polarization']
  },
  {
    id: 'renewable-energy-transition',
    title: 'The renewable energy transition: Challenges and opportunities',
    description: 'Develop strategies for transitioning to sustainable energy systems',
    scenario: 'problem-solving',
    complexity: 'medium',
    estimatedTokens: 11500,
    tags: ['energy', 'sustainability', 'technology', 'infrastructure']
  },
  {
    id: 'artificial-general-intelligence',
    title: 'The path to Artificial General Intelligence: Timeline and implications',
    description: 'Predict when AGI might arrive and what it means for humanity',
    scenario: 'cooperative',
    complexity: 'complex',
    estimatedTokens: 17000,
    tags: ['AGI', 'timeline', 'safety', 'alignment']
  },
  {
    id: 'creative-collaboration',
    title: 'Design a sustainable city of the future',
    description: 'Collaborate to create innovative solutions for urban sustainability',
    scenario: 'creative',
    complexity: 'complex',
    estimatedTokens: 20000,
    tags: ['design', 'sustainability', 'urban-planning', 'innovation']
  },
  {
    id: 'quantum-computing-impact',
    title: 'Quantum computing: Revolutionary breakthrough or overhyped technology?',
    description: 'Assess the real-world potential and limitations of quantum computers',
    scenario: 'debate',
    complexity: 'complex',
    estimatedTokens: 15500,
    tags: ['quantum', 'computing', 'cryptography', 'science']
  },
  {
    id: 'mental-health-digital-age',
    title: 'Mental health in the digital age: Technology as cure or cause?',
    description: 'Explore how digital technology affects mental wellbeing',
    scenario: 'problem-solving',
    complexity: 'medium',
    estimatedTokens: 13000,
    tags: ['mental-health', 'technology', 'wellbeing', 'society']
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
  cooperative: 'Participants work together toward a common goal, sharing ideas and building on each other\'s contributions.',
  debate: 'Participants take opposing viewpoints and engage in structured argumentation to defend their positions.',
  creative: 'Participants collaborate on creative tasks, brainstorming and iterating on innovative solutions.',
  'problem-solving': 'Participants analyze complex problems and develop practical, evidence-based solutions together.'
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
