import type { LLMProvider } from '@/types/llm';

/**
 * Token counting utilities for different LLM providers
 * These are approximations - for production use, consider using official tokenizers
 */

/**
 * Rough token estimation based on character count
 * This is a fallback method when provider-specific counting isn't available
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  
  // General rule: ~4 characters per token for English text
  // This varies by language and content type
  return Math.ceil(text.length / 4);
}

/**
 * More accurate token estimation for OpenAI models
 * Based on observed patterns in GPT tokenization
 */
export function estimateOpenAITokens(text: string): number {
  if (!text) return 0;

  // OpenAI tokenization patterns:
  // - Words are often split into subword tokens
  // - Punctuation usually gets its own token
  // - Whitespace is often merged with adjacent tokens
  
  const words = text.split(/\s+/).filter(word => word.length > 0);
  let tokenCount = 0;

  for (const word of words) {
    if (word.length <= 4) {
      tokenCount += 1; // Short words usually one token
    } else if (word.length <= 8) {
      tokenCount += 2; // Medium words often 2 tokens
    } else {
      tokenCount += Math.ceil(word.length / 4); // Longer words split more
    }
    
    // Add tokens for punctuation
    const punctuationCount = (word.match(/[.,!?;:'"()[\]{}]/g) || []).length;
    tokenCount += punctuationCount;
  }

  return tokenCount;
}

/**
 * Token estimation for Claude models
 * Anthropic uses a different tokenization approach
 */
export function estimateClaudeTokens(text: string): number {
  if (!text) return 0;

  // Claude tends to have slightly different tokenization
  // Generally similar to OpenAI but with some variations
  return Math.ceil(text.length / 3.8); // Slightly more tokens per character
}

/**
 * Token estimation for Gemini models
 * Google's tokenization approach
 */
export function estimateGeminiTokens(text: string): number {
  if (!text) return 0;

  // Gemini tokenization is generally efficient
  return Math.ceil(text.length / 4.2); // Slightly fewer tokens per character
}

/**
 * Token estimation for Perplexity models
 * Based on Llama tokenization
 */
export function estimatePerplexityTokens(text: string): number {
  if (!text) return 0;

  // Perplexity uses Llama-based models
  // Similar to other models but with slight variations
  return Math.ceil(text.length / 4.1);
}

/**
 * Get provider-specific token estimation
 */
export function getTokenCount(text: string, provider: LLMProvider): number {
  switch (provider) {
    case 'openai':
      return estimateOpenAITokens(text);
    case 'claude':
      return estimateClaudeTokens(text);
    case 'gemini':
      return estimateGeminiTokens(text);
    case 'perplexity':
      return estimatePerplexityTokens(text);
    default:
      return estimateTokens(text);
  }
}

/**
 * Calculate cost based on token count and provider
 */
export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  provider: LLMProvider,
  _model: string
): number {
  // This is a simplified cost calculation
  // In production, you'd want to import actual pricing from provider configs
  
  const costPerThousandTokens = {
    openai: {
      input: 0.03, // GPT-4 pricing as default
      output: 0.06
    },
    claude: {
      input: 0.015, // Claude-3 Opus pricing as default
      output: 0.075
    },
    gemini: {
      input: 0.00125, // Gemini Pro pricing as default
      output: 0.005
    },
    perplexity: {
      input: 0.001, // Perplexity pricing as default
      output: 0.001
    }
  };

  const pricing = costPerThousandTokens[provider];
  if (!pricing) return 0;

  const inputCost = (inputTokens / 1000) * pricing.input;
  const outputCost = (outputTokens / 1000) * pricing.output;

  return inputCost + outputCost;
}

/**
 * Analyze token efficiency between messages
 */
export interface TokenEfficiencyAnalysis {
  tokenReduction: number;
  percentageImprovement: number;
  efficiencyScore: number; // 0-100
  trend: 'improving' | 'declining' | 'stable';
}

export function analyzeTokenEfficiency(
  previousTokens: number,
  currentTokens: number
): TokenEfficiencyAnalysis {
  if (previousTokens === 0) {
    return {
      tokenReduction: 0,
      percentageImprovement: 0,
      efficiencyScore: 50, // Neutral score for first message
      trend: 'stable'
    };
  }

  const tokenReduction = previousTokens - currentTokens;
  const percentageImprovement = (tokenReduction / previousTokens) * 100;
  
  // Efficiency score: 0-100 where 100 is maximum efficiency
  let efficiencyScore = 50; // Start neutral
  if (percentageImprovement > 0) {
    efficiencyScore = Math.min(100, 50 + (percentageImprovement * 2));
  } else {
    efficiencyScore = Math.max(0, 50 + (percentageImprovement * 2));
  }

  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (percentageImprovement > 5) {
    trend = 'improving';
  } else if (percentageImprovement < -5) {
    trend = 'declining';
  }

  return {
    tokenReduction,
    percentageImprovement,
    efficiencyScore,
    trend
  };
}

/**
 * Batch analyze token efficiency for a series of messages
 */
export function analyzeTokenTrend(tokenCounts: number[]): {
  overallTrend: 'improving' | 'declining' | 'stable';
  averageImprovement: number;
  bestImprovement: number;
  worstImprovement: number;
  efficiencyScores: number[];
} {
  if (tokenCounts.length < 2) {
    return {
      overallTrend: 'stable',
      averageImprovement: 0,
      bestImprovement: 0,
      worstImprovement: 0,
      efficiencyScores: [50]
    };
  }

  const improvements: number[] = [];
  const efficiencyScores: number[] = [50]; // First message is neutral

  for (let i = 1; i < tokenCounts.length; i++) {
    const analysis = analyzeTokenEfficiency(tokenCounts[i - 1], tokenCounts[i]);
    improvements.push(analysis.percentageImprovement);
    efficiencyScores.push(analysis.efficiencyScore);
  }

  const averageImprovement = improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length;
  const bestImprovement = Math.max(...improvements);
  const worstImprovement = Math.min(...improvements);

  let overallTrend: 'improving' | 'declining' | 'stable' = 'stable';
  if (averageImprovement > 2) {
    overallTrend = 'improving';
  } else if (averageImprovement < -2) {
    overallTrend = 'declining';
  }

  return {
    overallTrend,
    averageImprovement,
    bestImprovement,
    worstImprovement,
    efficiencyScores
  };
}

/**
 * Format token count for display
 */
export function formatTokenCount(tokens: number): string {
  if (tokens < 1000) {
    return tokens.toString();
  } else if (tokens < 1000000) {
    return `${(tokens / 1000).toFixed(1)}K`;
  } else {
    return `${(tokens / 1000000).toFixed(1)}M`;
  }
}

/**
 * Format cost for display
 */
export function formatCost(cost: number): string {
  if (cost < 0.01) {
    return `$${(cost * 1000).toFixed(2)}m`; // Show in thousandths
  } else if (cost < 1) {
    return `$${cost.toFixed(3)}`;
  } else {
    return `$${cost.toFixed(2)}`;
  }
}
