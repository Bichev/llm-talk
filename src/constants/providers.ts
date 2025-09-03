import type { 
  LLMProvider, 
  OpenAIModel, 
  ClaudeModel, 
  GeminiModel, 
  PerplexityModel,
  ModelInfo,
  ProviderCapabilities 
} from '@/types/llm';

// Provider configurations
export const PROVIDER_CONFIGS = {
  openai: {
    name: 'OpenAI',
    displayName: 'OpenAI GPT',
    description: 'Advanced language models from OpenAI',
    website: 'https://openai.com',
    apiEndpoint: 'https://api.openai.com/v1',
    defaultTemperature: 0.7,
    maxTemperature: 2.0,
    color: '#10a37f',
    icon: '🤖'
  },
  claude: {
    name: 'Claude',
    displayName: 'Anthropic Claude',
    description: 'Constitutional AI assistant by Anthropic',
    website: 'https://anthropic.com',
    apiEndpoint: 'https://api.anthropic.com/v1',
    defaultTemperature: 0.7,
    maxTemperature: 1.0,
    color: '#d97706',
    icon: '🧠'
  },
  gemini: {
    name: 'Gemini',
    displayName: 'Google Gemini',
    description: 'Google\'s multimodal AI model',
    website: 'https://ai.google.dev',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1',
    defaultTemperature: 0.7,
    maxTemperature: 2.0,
    color: '#4285f4',
    icon: '💎'
  },
  perplexity: {
    name: 'Perplexity',
    displayName: 'Perplexity AI',
    description: 'Real-time search-powered AI models',
    website: 'https://perplexity.ai',
    apiEndpoint: 'https://api.perplexity.ai',
    defaultTemperature: 0.7,
    maxTemperature: 2.0,
    color: '#7c3aed',
    icon: '🔍'
  }
} as const;

// Model definitions with capabilities
export const OPENAI_MODELS: Record<OpenAIModel, ModelInfo> = {
  'gpt-3.5-turbo': {
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    displayName: 'GPT-3.5 Turbo',
    description: 'Fast, cost-effective model for most tasks',
    capabilities: {
      maxTokens: 16385,
      supportsSystemPrompts: true,
      supportsStreaming: true,
      supportsFunctionCalling: true,
      costPerInputToken: 0.0005,
      costPerOutputToken: 0.0015
    }
  },
  'gpt-4': {
    provider: 'openai',
    model: 'gpt-4',
    displayName: 'GPT-4',
    description: 'More capable model for complex reasoning',
    capabilities: {
      maxTokens: 8192,
      supportsSystemPrompts: true,
      supportsStreaming: true,
      supportsFunctionCalling: true,
      costPerInputToken: 0.03,
      costPerOutputToken: 0.06
    }
  },
  'gpt-4-turbo': {
    provider: 'openai',
    model: 'gpt-4-turbo',
    displayName: 'GPT-4 Turbo',
    description: 'Latest GPT-4 with improved efficiency',
    capabilities: {
      maxTokens: 128000,
      supportsSystemPrompts: true,
      supportsStreaming: true,
      supportsFunctionCalling: true,
      costPerInputToken: 0.01,
      costPerOutputToken: 0.03
    }
  },
  'gpt-4o': {
    provider: 'openai',
    model: 'gpt-4o',
    displayName: 'GPT-4o',
    description: 'Multimodal flagship model',
    capabilities: {
      maxTokens: 128000,
      supportsSystemPrompts: true,
      supportsStreaming: true,
      supportsFunctionCalling: true,
      costPerInputToken: 0.005,
      costPerOutputToken: 0.015
    }
  },
  'gpt-4o-mini': {
    provider: 'openai',
    model: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    description: 'Affordable and intelligent small model',
    capabilities: {
      maxTokens: 128000,
      supportsSystemPrompts: true,
      supportsStreaming: true,
      supportsFunctionCalling: true,
      costPerInputToken: 0.00015,
      costPerOutputToken: 0.0006
    }
  }
};

export const CLAUDE_MODELS: Record<ClaudeModel, ModelInfo> = {
  'claude-3-haiku-20240307': {
    provider: 'claude',
    model: 'claude-3-haiku-20240307',
    displayName: 'Claude 3 Haiku',
    description: 'Fast and cost-effective model',
    capabilities: {
      maxTokens: 200000,
      supportsSystemPrompts: true,
      supportsStreaming: true,
      supportsFunctionCalling: false,
      costPerInputToken: 0.00025,
      costPerOutputToken: 0.00125
    }
  },
  'claude-3-sonnet-20240229': {
    provider: 'claude',
    model: 'claude-3-sonnet-20240229',
    displayName: 'Claude 3 Sonnet',
    description: 'Balanced performance and speed',
    capabilities: {
      maxTokens: 200000,
      supportsSystemPrompts: true,
      supportsStreaming: true,
      supportsFunctionCalling: false,
      costPerInputToken: 0.003,
      costPerOutputToken: 0.015
    }
  },
  'claude-3-opus-20240229': {
    provider: 'claude',
    model: 'claude-3-opus-20240229',
    displayName: 'Claude 3 Opus',
    description: 'Most capable model for complex tasks',
    capabilities: {
      maxTokens: 200000,
      supportsSystemPrompts: true,
      supportsStreaming: true,
      supportsFunctionCalling: false,
      costPerInputToken: 0.015,
      costPerOutputToken: 0.075
    }
  },
  'claude-3-5-sonnet-20241022': {
    provider: 'claude',
    model: 'claude-3-5-sonnet-20241022',
    displayName: 'Claude 3.5 Sonnet',
    description: 'Latest and most capable Sonnet model',
    capabilities: {
      maxTokens: 200000,
      supportsSystemPrompts: true,
      supportsStreaming: true,
      supportsFunctionCalling: true,
      costPerInputToken: 0.003,
      costPerOutputToken: 0.015
    }
  }
};

export const GEMINI_MODELS: Record<GeminiModel, ModelInfo> = {
  'gemini-1.5-flash': {
    provider: 'gemini',
    model: 'gemini-1.5-flash',
    displayName: 'Gemini 1.5 Flash',
    description: 'Fast and versatile performance',
    capabilities: {
      maxTokens: 1048576,
      supportsSystemPrompts: true,
      supportsStreaming: true,
      supportsFunctionCalling: true,
      costPerInputToken: 0.000075,
      costPerOutputToken: 0.0003
    }
  },
  'gemini-1.5-pro': {
    provider: 'gemini',
    model: 'gemini-1.5-pro',
    displayName: 'Gemini 1.5 Pro',
    description: 'Advanced reasoning and complex tasks',
    capabilities: {
      maxTokens: 2097152,
      supportsSystemPrompts: true,
      supportsStreaming: true,
      supportsFunctionCalling: true,
      costPerInputToken: 0.00125,
      costPerOutputToken: 0.005
    }
  },
  'gemini-1.0-pro': {
    provider: 'gemini',
    model: 'gemini-1.0-pro',
    displayName: 'Gemini 1.0 Pro',
    description: 'Previous generation model',
    capabilities: {
      maxTokens: 32768,
      supportsSystemPrompts: true,
      supportsStreaming: true,
      supportsFunctionCalling: true,
      costPerInputToken: 0.0005,
      costPerOutputToken: 0.0015
    },
    deprecated: true
  }
};

export const PERPLEXITY_MODELS: Record<PerplexityModel, ModelInfo> = {
  'llama-3.1-sonar-small-128k-online': {
    provider: 'perplexity',
    model: 'llama-3.1-sonar-small-128k-online',
    displayName: 'Sonar Small Online',
    description: 'Fast online search-powered responses',
    capabilities: {
      maxTokens: 127072,
      supportsSystemPrompts: true,
      supportsStreaming: true,
      supportsFunctionCalling: false,
      costPerInputToken: 0.0002,
      costPerOutputToken: 0.0002
    }
  },
  'llama-3.1-sonar-large-128k-online': {
    provider: 'perplexity',
    model: 'llama-3.1-sonar-large-128k-online',
    displayName: 'Sonar Large Online',
    description: 'Powerful online search-powered responses',
    capabilities: {
      maxTokens: 127072,
      supportsSystemPrompts: true,
      supportsStreaming: true,
      supportsFunctionCalling: false,
      costPerInputToken: 0.001,
      costPerOutputToken: 0.001
    }
  },
  'llama-3.1-sonar-huge-128k-online': {
    provider: 'perplexity',
    model: 'llama-3.1-sonar-huge-128k-online',
    displayName: 'Sonar Huge Online',
    description: 'Most capable online search-powered model',
    capabilities: {
      maxTokens: 127072,
      supportsSystemPrompts: true,
      supportsStreaming: true,
      supportsFunctionCalling: false,
      costPerInputToken: 0.005,
      costPerOutputToken: 0.005
    }
  }
};

// Combined model registry
export const ALL_MODELS: ModelInfo[] = [
  ...Object.values(OPENAI_MODELS),
  ...Object.values(CLAUDE_MODELS),
  ...Object.values(GEMINI_MODELS),
  ...Object.values(PERPLEXITY_MODELS)
];

// Default model selections for quick start
export const DEFAULT_PARTICIPANTS = [
  {
    name: 'gpt-4o-mini',
    provider: 'openai' as LLMProvider,
    model: 'gpt-4o-mini',
    temperature: 0.7
  },
  {
    name: 'gpt-4o',
    provider: 'openai' as LLMProvider,
    model: 'gpt-4o',
    temperature: 0.8
  },
  // {
  //   name: 'Claude-3.5',
  //   provider: 'claude' as LLMProvider,
  //   model: 'claude-3-5-sonnet-20241022',
  //   temperature: 0.7
  // }
];

// Recommended combinations for different use cases
export const RECOMMENDED_COMBINATIONS = {
  'cost-effective': [
    { provider: 'openai' as LLMProvider, model: 'gpt-4o-mini' },
    { provider: 'claude' as LLMProvider, model: 'claude-3-haiku-20240307' },
    { provider: 'gemini' as LLMProvider, model: 'gemini-1.5-flash' }
  ],
  'high-performance': [
    { provider: 'openai' as LLMProvider, model: 'gpt-4o' },
    { provider: 'claude' as LLMProvider, model: 'claude-3-opus-20240229' },
    { provider: 'gemini' as LLMProvider, model: 'gemini-1.5-pro' }
  ],
  'balanced': [
    { provider: 'openai' as LLMProvider, model: 'gpt-4-turbo' },
    { provider: 'claude' as LLMProvider, model: 'claude-3-5-sonnet-20241022' },
    { provider: 'gemini' as LLMProvider, model: 'gemini-1.5-flash' }
  ],
  'research-focused': [
    { provider: 'openai' as LLMProvider, model: 'gpt-4o' },
    { provider: 'claude' as LLMProvider, model: 'claude-3-5-sonnet-20241022' },
    { provider: 'perplexity' as LLMProvider, model: 'llama-3.1-sonar-large-128k-online' }
  ]
};

// Helper functions
export function getModelsByProvider(provider: LLMProvider): ModelInfo[] {
  return ALL_MODELS.filter(model => model.provider === provider);
}

export function getModelInfo(provider: LLMProvider, model: string): ModelInfo | undefined {
  return ALL_MODELS.find(m => m.provider === provider && m.model === model);
}

export function calculateCostEstimate(
  provider: LLMProvider,
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const modelInfo = getModelInfo(provider, model);
  if (!modelInfo) return 0;

  const inputCost = (inputTokens / 1000) * modelInfo.capabilities.costPerInputToken;
  const outputCost = (outputTokens / 1000) * modelInfo.capabilities.costPerOutputToken;
  
  return inputCost + outputCost;
}

export function getProviderColor(provider: LLMProvider): string {
  return PROVIDER_CONFIGS[provider]?.color || '#6b7280';
}

export function getProviderIcon(provider: LLMProvider): string {
  return PROVIDER_CONFIGS[provider]?.icon || '🤖';
}

export function validateModelSupportsFeature(
  provider: LLMProvider,
  model: string,
  feature: keyof ProviderCapabilities
): boolean {
  const modelInfo = getModelInfo(provider, model);
  if (!modelInfo) return false;
  
  return Boolean(modelInfo.capabilities[feature]);
}

// Rate limiting information (requests per minute)
export const RATE_LIMITS = {
  openai: {
    'gpt-3.5-turbo': 3500,
    'gpt-4': 500,
    'gpt-4-turbo': 500,
    'gpt-4o': 500,
    'gpt-4o-mini': 500
  },
  claude: {
    'claude-3-haiku-20240307': 4000,
    'claude-3-sonnet-20240229': 4000,
    'claude-3-opus-20240229': 4000,
    'claude-3-5-sonnet-20241022': 4000
  },
  gemini: {
    'gemini-1.5-flash': 2000,
    'gemini-1.5-pro': 2000,
    'gemini-1.0-pro': 2000
  },
  perplexity: {
    'llama-3.1-sonar-small-128k-online': 200,
    'llama-3.1-sonar-large-128k-online': 200,
    'llama-3.1-sonar-huge-128k-online': 200
  }
} as const;
