import type { 
  BaseLLMProvider, 
  LLMRequest, 
  LLMResponse, 
  LLMProvider
} from '@/types/llm';
import { 
  LLMProviderError,
  RateLimitError,
  TokenLimitError,
  APIKeyError
} from '@/types/llm';

/**
 * Abstract base class for all LLM providers
 * Implements common functionality and defines the interface
 */
export abstract class AbstractLLMProvider implements BaseLLMProvider {
  public readonly name: string;
  public readonly provider: LLMProvider;
  public readonly model: string;
  public readonly temperature: number;

  constructor(
    name: string,
    provider: LLMProvider,
    model: string,
    temperature: number
  ) {
    this.name = name;
    this.provider = provider;
    this.model = model;
    this.temperature = temperature;
  }

  // Abstract methods that must be implemented by each provider
  abstract sendMessage(request: LLMRequest): Promise<LLMResponse>;
  abstract countTokens(text: string): number;
  abstract validateConfig(): boolean;
  abstract getModels(): string[];
  abstract getCostPerToken(): { input: number; output: number };

  /**
   * Safe wrapper for provider API calls with error handling
   */
  protected async safeApiCall<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      throw this.handleProviderError(error, context);
    }
  }

  /**
   * Standardized error handling for provider-specific errors
   */
  protected handleProviderError(error: any, context: string): LLMProviderError {
    console.error(`${this.provider} error in ${context}:`, error);

    // Rate limit errors
    if (this.isRateLimitError(error)) {
      const retryAfter = this.extractRetryAfter(error);
      return new RateLimitError(this.provider, retryAfter, error);
    }

    // Token limit errors
    if (this.isTokenLimitError(error)) {
      return new TokenLimitError(
        this.provider,
        0, // Will be filled by specific provider
        0, // Will be filled by specific provider
        error
      );
    }

    // API key errors
    if (this.isAPIKeyError(error)) {
      return new APIKeyError(this.provider, error);
    }

    // Generic provider error
    return new LLMProviderError(
      `${this.provider} API error in ${context}: ${error.message || 'Unknown error'}`,
      this.provider,
      error,
      this.isRetryableError(error)
    );
  }

  /**
   * Check if an error is rate limit related
   */
  protected isRateLimitError(error: any): boolean {
    const message = error?.message?.toLowerCase() || '';
    const status = error?.status || error?.statusCode || 0;
    
    return (
      status === 429 ||
      message.includes('rate limit') ||
      message.includes('too many requests') ||
      message.includes('quota exceeded')
    );
  }

  /**
   * Check if an error is token limit related
   */
  protected isTokenLimitError(error: any): boolean {
    const message = error?.message?.toLowerCase() || '';
    
    return (
      message.includes('token limit') ||
      message.includes('context length') ||
      message.includes('maximum tokens') ||
      message.includes('token count')
    );
  }

  /**
   * Check if an error is API key related
   */
  protected isAPIKeyError(error: any): boolean {
    const message = error?.message?.toLowerCase() || '';
    const status = error?.status || error?.statusCode || 0;
    
    return (
      status === 401 ||
      status === 403 ||
      message.includes('api key') ||
      message.includes('unauthorized') ||
      message.includes('authentication') ||
      message.includes('invalid key')
    );
  }

  /**
   * Check if an error is retryable
   */
  protected isRetryableError(error: any): boolean {
    const status = error?.status || error?.statusCode || 0;
    
    return (
      status >= 500 || // Server errors
      status === 429 || // Rate limits
      status === 408 || // Timeout
      status === 0      // Network errors
    );
  }

  /**
   * Extract retry-after time from rate limit errors
   */
  protected extractRetryAfter(error: any): number | undefined {
    // Try to extract from headers
    const retryAfter = error?.headers?.['retry-after'] || 
                      error?.response?.headers?.['retry-after'];
    
    if (retryAfter) {
      const seconds = parseInt(retryAfter, 10);
      return isNaN(seconds) ? undefined : seconds;
    }

    // Try to extract from error message
    const message = error?.message || '';
    const match = message.match(/retry after (\d+) seconds?/i);
    if (match) {
      return parseInt(match[1], 10);
    }

    return undefined;
  }

  /**
   * Validate common request parameters
   */
  protected validateRequest(request: LLMRequest): void {
    if (!request.prompt || request.prompt.trim().length === 0) {
      throw new LLMProviderError(
        'Prompt cannot be empty',
        this.provider,
        null,
        false
      );
    }

    if (request.temperature < 0 || request.temperature > 2) {
      throw new LLMProviderError(
        'Temperature must be between 0 and 2',
        this.provider,
        null,
        false
      );
    }

    if (request.maxTokens && request.maxTokens <= 0) {
      throw new LLMProviderError(
        'Max tokens must be positive',
        this.provider,
        null,
        false
      );
    }
  }

  /**
   * Format a standardized response
   */
  protected formatResponse(
    content: string,
    tokenCount: { prompt: number; completion: number; total: number },
    finishReason: string,
    processingTime: number,
    metadata: any = {}
  ): LLMResponse {
    return {
      content,
      tokenCount,
      model: this.model,
      finishReason,
      processingTime,
      metadata: {
        provider: this.provider,
        model: this.model,
        ...metadata
      }
    };
  }

  /**
   * Simple token counting fallback (rough estimation)
   * Override with provider-specific implementations
   */
  protected estimateTokenCount(text: string): number {
    // Very rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Build context messages for conversation history
   */
  protected buildContextMessages(
    request: LLMRequest
  ): Array<{ role: string; content: string }> {
    const messages: Array<{ role: string; content: string }> = [];

    // Add system prompt if provided
    if (request.systemPrompt) {
      messages.push({
        role: 'system',
        content: request.systemPrompt
      });
    }

    // Add conversation context
    if (request.context && request.context.length > 0) {
      messages.push(...request.context);
    }

    // Add current prompt as user message
    messages.push({
      role: 'user',
      content: request.prompt
    });

    return messages;
  }

  /**
   * Get provider-specific headers
   */
  protected getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'User-Agent': 'LLM-Talk/1.0'
    };
  }

  /**
   * Log request for debugging (without sensitive data)
   */
  protected logRequest(request: LLMRequest): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${this.provider}] Request:`, {
        model: request.model,
        temperature: request.temperature,
        maxTokens: request.maxTokens,
        promptLength: request.prompt.length,
        contextLength: request.context?.length || 0,
        hasSystemPrompt: Boolean(request.systemPrompt)
      });
    }
  }

  /**
   * Log response for debugging
   */
  protected logResponse(response: LLMResponse): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${this.provider}] Response:`, {
        model: response.model,
        contentLength: response.content.length,
        tokenCount: response.tokenCount,
        finishReason: response.finishReason,
        processingTime: response.processingTime
      });
    }
  }
}
