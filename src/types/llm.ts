export interface LLMParticipant {
  id?: string;
  name: string;
  provider: LLMProvider;
  model: string;
  temperature: number;
  config?: Record<string, any>;
}

export interface LLMResponse {
  content: string;
  tokenCount: {
    prompt: number;
    completion: number;
    total: number;
  };
  model: string;
  finishReason: string;
  processingTime: number;
  metadata: {
    provider: LLMProvider;
    requestId?: string;
    model: string;
    usage?: any;
  };
}

export interface LLMRequest {
  prompt: string;
  model: string;
  temperature: number;
  maxTokens?: number;
  context?: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  systemPrompt?: string;
}

export interface BaseLLMProvider {
  name: string;
  provider: LLMProvider;
  model: string;
  temperature: number;
  
  sendMessage(request: LLMRequest): Promise<LLMResponse>;
  countTokens(text: string): number;
  validateConfig(): boolean;
  getModels(): string[];
  getCostPerToken(): { input: number; output: number };
}

export interface OpenAIConfig {
  apiKey: string;
  model: OpenAIModel;
  temperature: number;
  organization?: string;
  maxTokens?: number;
}

export interface ClaudeConfig {
  apiKey: string;
  model: ClaudeModel;
  temperature: number;
  maxTokens?: number;
}

export interface GeminiConfig {
  apiKey: string;
  model: GeminiModel;
  temperature: number;
  projectId?: string;
  maxTokens?: number;
}

export interface PerplexityConfig {
  apiKey: string;
  model: PerplexityModel;
  temperature: number;
  maxTokens?: number;
}

export type LLMProvider = 'openai' | 'claude' | 'gemini' | 'perplexity';

export type OpenAIModel = 
  | 'gpt-3.5-turbo'
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'gpt-4o'
  | 'gpt-4o-mini';

export type ClaudeModel = 
  | 'claude-3-haiku-20240307'
  | 'claude-3-sonnet-20240229'
  | 'claude-3-opus-20240229'
  | 'claude-3-5-sonnet-20241022';

export type GeminiModel = 
  | 'gemini-1.5-flash'
  | 'gemini-1.5-pro'
  | 'gemini-1.0-pro';

export type PerplexityModel = 
  | 'llama-3.1-sonar-small-128k-online'
  | 'llama-3.1-sonar-large-128k-online'
  | 'llama-3.1-sonar-huge-128k-online';

// Provider-specific response types
export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ClaudeResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  stop_sequence?: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
      role: string;
    };
    finishReason: string;
    index: number;
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  object: string;
  choices: Array<{
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
    delta: {
      role?: string;
      content?: string;
    };
  }>;
}

// Error types
export class LLMProviderError extends Error {
  constructor(
    message: string,
    public provider: LLMProvider,
    public originalError?: any,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'LLMProviderError';
  }
}

export class RateLimitError extends LLMProviderError {
  constructor(
    provider: LLMProvider,
    public retryAfter?: number,
    originalError?: any
  ) {
    super(`Rate limit exceeded for ${provider}`, provider, originalError, true);
    this.name = 'RateLimitError';
  }
}

export class TokenLimitError extends LLMProviderError {
  constructor(
    provider: LLMProvider,
    public tokensRequested: number,
    public maxTokens: number,
    originalError?: any
  ) {
    super(
      `Token limit exceeded for ${provider}: ${tokensRequested} > ${maxTokens}`,
      provider,
      originalError,
      false
    );
    this.name = 'TokenLimitError';
  }
}

export class APIKeyError extends LLMProviderError {
  constructor(provider: LLMProvider, originalError?: any) {
    super(`Invalid API key for ${provider}`, provider, originalError, false);
    this.name = 'APIKeyError';
  }
}

// Utility types
export interface ProviderCapabilities {
  maxTokens: number;
  supportsSystemPrompts: boolean;
  supportsStreaming: boolean;
  supportsFunctionCalling: boolean;
  costPerInputToken: number;
  costPerOutputToken: number;
}

export interface ModelInfo {
  provider: LLMProvider;
  model: string;
  displayName: string;
  description: string;
  capabilities: ProviderCapabilities;
  deprecated?: boolean;
}
