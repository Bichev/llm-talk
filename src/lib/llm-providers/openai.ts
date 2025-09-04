import OpenAI from 'openai';
import { AbstractLLMProvider } from './base';
import type { 
  LLMRequest, 
  LLMResponse, 
  OpenAIConfig,
  OpenAIModel
} from '@/types/llm';
import { OPENAI_MODELS } from '@/constants/providers';

/**
 * OpenAI provider implementation
 */
export class OpenAIProvider extends AbstractLLMProvider {
  private client: OpenAI;
  private config: OpenAIConfig;

  constructor(config: OpenAIConfig) {
    super(
      `OpenAI-${config.model}`,
      'openai',
      config.model,
      config.temperature
    );

    this.config = config;
    
    // Initialize the OpenAI client - explicitly handle organization to avoid env var conflicts
    const clientConfig: any = {
      apiKey: config.apiKey,
    };

    // IMPORTANT: Only set organization if explicitly provided AND not empty
    // This prevents automatic reading of OPENAI_ORG_ID from environment
    if (config.organization && config.organization.trim() !== '') {
      clientConfig.organization = config.organization;
    }
    // If organization is explicitly set to null/undefined, don't include it at all

    console.log('🔧 OpenAI Client Config:', {
      hasApiKey: !!clientConfig.apiKey,
      hasOrganization: !!clientConfig.organization,
      organizationValue: clientConfig.organization || 'none'
    });

    this.client = new OpenAI(clientConfig);
  }

  async sendMessage(request: LLMRequest): Promise<LLMResponse> {
    this.validateRequest(request);
    this.logRequest(request);

    const startTime = Date.now();

    const response = await this.safeApiCall(async () => {
      const messages = this.buildContextMessages(request);
      
      const completion = await this.client.chat.completions.create({
        model: request.model || this.model,
        messages: messages as any,
        temperature: request.temperature || this.temperature,
        max_tokens: request.maxTokens || this.config.maxTokens,
        stream: false,
      });

      return completion;
    }, 'sendMessage');

    const processingTime = Date.now() - startTime;
    const formattedResponse = this.formatOpenAIResponse(response, processingTime);
    
    this.logResponse(formattedResponse);
    return formattedResponse;
  }

  countTokens(text: string): number {
    // OpenAI doesn't provide a direct token counting API in the SDK
    // This is a rough estimation - in production you might want to use
    // a more accurate tokenizer like gpt-3-encoder or tiktoken
    return this.estimateTokenCount(text);
  }

  validateConfig(): boolean {
    try {
      if (!this.config.apiKey) {
        throw new Error('OpenAI API key is required');
      }

      if (!this.config.model) {
        throw new Error('OpenAI model is required');
      }

      if (!this.getModels().includes(this.config.model)) {
        throw new Error(`Unsupported OpenAI model: ${this.config.model}`);
      }

      if (this.config.temperature < 0 || this.config.temperature > 2) {
        throw new Error('OpenAI temperature must be between 0 and 2');
      }

      if (this.config.maxTokens && this.config.maxTokens <= 0) {
        throw new Error('OpenAI maxTokens must be positive');
      }

      return true;
    } catch (error) {
      console.error('OpenAI config validation failed:', error);
      return false;
    }
  }

  getModels(): string[] {
    return Object.keys(OPENAI_MODELS);
  }

  getCostPerToken(): { input: number; output: number } {
    const modelInfo = OPENAI_MODELS[this.model as OpenAIModel];
    if (!modelInfo) {
      // Fallback to GPT-4 pricing if model not found
      return { input: 0.03, output: 0.06 };
    }

    return {
      input: modelInfo.capabilities.costPerInputToken,
      output: modelInfo.capabilities.costPerOutputToken
    };
  }

  /**
   * Format OpenAI-specific response to standard format
   */
  private formatOpenAIResponse(
    response: OpenAI.Chat.Completions.ChatCompletion,
    processingTime: number
  ): LLMResponse {
    const choice = response.choices[0];
    const content = choice?.message?.content || '';
    
    const tokenCount = {
      prompt: response.usage?.prompt_tokens || 0,
      completion: response.usage?.completion_tokens || 0,
      total: response.usage?.total_tokens || 0
    };

    return this.formatResponse(
      content,
      tokenCount,
      choice?.finish_reason || 'unknown',
      processingTime,
      {
        requestId: response.id,
        model: response.model,
        usage: response.usage,
        created: response.created
      }
    );
  }

  /**
   * Override error handling for OpenAI-specific errors
   */
  protected isRateLimitError(error: any): boolean {
    return (
      super.isRateLimitError(error) ||
      error?.code === 'rate_limit_exceeded' ||
      error?.type === 'insufficient_quota'
    );
  }

  protected isTokenLimitError(error: any): boolean {
    return (
      super.isTokenLimitError(error) ||
      error?.code === 'context_length_exceeded' ||
      error?.type === 'invalid_request_error'
    );
  }

  protected isAPIKeyError(error: any): boolean {
    return (
      super.isAPIKeyError(error) ||
      error?.code === 'invalid_api_key' ||
      error?.code === 'mismatched_organization' || // Add this!
      error?.type === 'authentication_error'
    );
  }

  /**
   * Test the connection with a simple request
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.sendMessage({
        prompt: 'Hello',
        model: this.model,
        temperature: 0,
        maxTokens: 1
      });
      return true;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available models from OpenAI API
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await this.client.models.list();
      return response.data
        .filter(model => model.id.includes('gpt'))
        .map(model => model.id)
        .sort();
    } catch (error) {
      console.error('Failed to fetch OpenAI models:', error);
      return this.getModels(); // Return static list as fallback
    }
  }

  /**
   * Create a new instance with different configuration
   */
  static create(config: Partial<OpenAIConfig>): OpenAIProvider {
    const fullConfig: OpenAIConfig = {
      apiKey: config.apiKey || process.env.OPENAI_API_KEY || '',
      model: config.model || 'gpt-4o-mini',
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens || 4000,
      // CRITICAL: Do not automatically include organization from env
      // Only include if explicitly provided and not empty
      ...(config.organization && config.organization.trim() !== '' ? { 
        organization: config.organization 
      } : {})
    };

    console.log('🔧 OpenAI Provider Config:', {
      model: fullConfig.model,
      temperature: fullConfig.temperature,
      maxTokens: fullConfig.maxTokens,
      hasOrganization: !!fullConfig.organization,
      organizationValue: fullConfig.organization || 'none'
    });

    return new OpenAIProvider(fullConfig);
  }
}

// Factory function for easy instantiation
export function createOpenAIProvider(
  model: OpenAIModel = 'gpt-4o-mini',
  temperature: number = 0.7,
  options: Partial<OpenAIConfig> = {}
): OpenAIProvider {
  return OpenAIProvider.create({
    model,
    temperature,
    maxTokens: 4000,
    // IMPORTANT: Don't pass organization unless explicitly provided
    ...options
  });
}