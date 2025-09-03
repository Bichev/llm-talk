'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { analyzeTokenTrend, formatTokenCount, formatCost } from '@/lib/token-counter';
import type { 
  SessionAnalyticsData, 
  TokenMetrics, 
  EfficiencyDataPoint,
  ProviderComparisonData,
  CommunicationEvolution,
  ParticipantAnalysis
} from '@/types/analytics';


/**
 * Hook for managing session analytics and metrics
 */
export function useAnalytics() {
  const { session } = useSession();
  const [isCalculating, setIsCalculating] = useState(false);

  // Real-time token metrics
  const tokenMetrics = useMemo((): TokenMetrics => {
    if (!session || session.messages.length === 0) {
      return {
        totalTokens: 0,
        averagePerMessage: 0,
        efficiencyTrend: [],
        providerComparison: [],
        costAnalysis: {
          totalCostEstimate: 0,
          costByProvider: [],
          costTrend: []
        }
      };
    }

    const messages = session.messages;
    const totalTokens = messages.reduce((sum, msg) => sum + msg.tokenCount.total, 0);
    const averagePerMessage = totalTokens / messages.length;

    // Efficiency trend data
    const efficiencyTrend: EfficiencyDataPoint[] = messages.map(msg => ({
      iteration: msg.iteration,
      tokensUsed: msg.tokenCount.total,
      cumulativeEfficiency: msg.efficiencyScore || 50,
      participantId: msg.participantId,
      timestamp: msg.timestamp
    }));

    // Provider comparison
    const providerStats = new Map<string, {
      totalTokens: number;
      messageCount: number;
      totalResponseTime: number;
      participantName: string;
      provider: string;
    }>();

    messages.forEach(msg => {
      const participant = session.participants.find(p => p.id === msg.participantId);
      if (!participant) return;

      const key = `${participant.provider}-${participant.name}`;
      const existing = providerStats.get(key) || {
        totalTokens: 0,
        messageCount: 0,
        totalResponseTime: 0,
        participantName: participant.name,
        provider: participant.provider
      };

      existing.totalTokens += msg.tokenCount.total;
      existing.messageCount += 1;
      existing.totalResponseTime += msg.processingTime || 0;

      providerStats.set(key, existing);
    });

    const providerComparison: ProviderComparisonData[] = Array.from(providerStats.entries()).map(([, stats]) => {
      const efficiency = stats.messageCount > 1 
        ? analyzeTokenTrend(messages
            .filter(m => session.participants.find(p => p.id === m.participantId)?.name === stats.participantName)
            .map(m => m.tokenCount.total)
          ).averageImprovement
        : 0;

      return {
        provider: stats.provider,
        participantName: stats.participantName,
        totalTokens: stats.totalTokens,
        efficiency,
        averageResponseTime: stats.totalResponseTime / stats.messageCount,
        messageCount: stats.messageCount,
        costEstimate: (stats.totalTokens / 1000) * 0.02 // Rough estimate
      };
    });

    // Cost analysis
    const totalCostEstimate = providerComparison.reduce((sum, p) => sum + p.costEstimate, 0);
    const costByProvider = providerComparison.map(p => ({
      provider: p.participantName,
      cost: p.costEstimate,
      percentage: (p.costEstimate / totalCostEstimate) * 100
    }));

    const costTrend = messages.reduce((trend, msg, index) => {
      const cumulativeCost = messages.slice(0, index + 1)
        .reduce((sum, m) => sum + (m.tokenCount.total / 1000) * 0.02, 0);
      
      trend.push({
        iteration: msg.iteration,
        cumulativeCost
      });
      
      return trend;
    }, [] as Array<{ iteration: number; cumulativeCost: number }>);

    return {
      totalTokens,
      averagePerMessage,
      efficiencyTrend,
      providerComparison,
      costAnalysis: {
        totalCostEstimate,
        costByProvider,
        costTrend
      }
    };
  }, [session]);

  // Communication evolution analysis
  const communicationEvolution = useMemo((): CommunicationEvolution => {
    if (!session || session.messages.length === 0) {
      return {
        symbolsIntroduced: [],
        patternChanges: [],
        languageComplexity: [],
        innovationMoments: []
      };
    }

    const messages = session.messages;

    // Analyze symbols introduced
    const symbolsIntroduced = messages
      .filter(msg => msg.evolutionMarkers?.includes('symbol_introduction' as any))
      .map(msg => {
        return {
          symbol: msg.evolvedMessage.match(/[→⇒::\/\/]/g)?.[0] || 'Unknown',
          firstAppearance: msg.iteration,
          frequency: messages.filter(m => m.evolvedMessage.includes(msg.evolvedMessage.match(/[→⇒::\/\/]/g)?.[0] || '')).length,
          context: msg.evolvedMessage.substring(0, 50) + '...',
          participantId: msg.participantId,
          adoptionRate: 0 // Would need more complex analysis
        };
      });

    // Pattern changes
    const patternChanges = messages
      .filter(msg => msg.evolutionMarkers && msg.evolutionMarkers.length > 0)
      .map(msg => ({
        iteration: msg.iteration,
        description: `Evolution marker: ${msg.evolutionMarkers?.join(', ')}`,
        impact: ((msg.efficiencyScore || 50) > 60 ? 'positive' : 
                (msg.efficiencyScore || 50) < 40 ? 'negative' : 'neutral') as 'positive' | 'negative' | 'neutral',
        affectedParticipants: [msg.participantId],
        confidenceScore: 0.7 // Placeholder
      }));

    // Language complexity analysis
    const languageComplexity = messages.map(msg => ({
      iteration: msg.iteration,
      complexityScore: msg.evolvedMessage.length / 10, // Simple metric
      readabilityScore: 100 - (msg.evolvedMessage.match(/[^a-zA-Z0-9\s]/g)?.length || 0) * 2,
      vocabularyDiversity: new Set(msg.evolvedMessage.toLowerCase().split(/\s+/)).size,
      sentenceLength: msg.evolvedMessage.split(/[.!?]+/).length
    }));

    // Innovation moments
    const innovationMoments = messages
      .filter(msg => msg.evolutionMarkers?.includes('efficiency_breakthrough' as any))
      .map(msg => {
        return {
          iteration: msg.iteration,
          participantId: msg.participantId,
          type: 'efficiency_hack' as const,
          description: 'Significant efficiency improvement detected',
          impactScore: msg.efficiencyScore || 50,
          adoptedByOthers: false // Would need cross-message analysis
        };
      });

    return {
      symbolsIntroduced,
      patternChanges,
      languageComplexity,
      innovationMoments
    };
  }, [session]);

  // Participant analysis
  const participantAnalysis = useMemo((): ParticipantAnalysis[] => {
    if (!session || session.messages.length === 0) {
      return [];
    }

    return session.participants.map(participant => {
      const participantMessages = session.messages.filter(msg => msg.participantId === participant.id);
      
      if (participantMessages.length === 0) {
        return {
          participantId: participant.id!,
          name: participant.name,
          provider: participant.provider,
          adaptationRate: 0,
          innovationScore: 0,
          collaborationEffectiveness: 0,
          communicationStyle: [],
          performanceMetrics: {
            averageTokensPerMessage: 0,
            responseTimeConsistency: 0,
            efficiencyImprovement: 0,
            errorRate: 0,
            creativityScore: 0,
            clarityScore: 0
          }
        };
      }

      const tokenCounts = participantMessages.map(msg => msg.tokenCount.total);
      const efficiencyAnalysis = analyzeTokenTrend(tokenCounts);
      
      const averageTokens = tokenCounts.reduce((sum, count) => sum + count, 0) / tokenCounts.length;
      const responseTimes = participantMessages.map(msg => msg.processingTime || 0).filter(t => t > 0);
      const avgResponseTime = responseTimes.length > 0 
        ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
        : 0;

      // Communication style analysis
      const communicationStyle: string[] = [];
      const avgMessageLength = participantMessages.reduce((sum, msg) => sum + msg.evolvedMessage.length, 0) / participantMessages.length;
      
      if (avgMessageLength < 50) communicationStyle.push('Concise');
      else if (avgMessageLength > 150) communicationStyle.push('Detailed');
      
      if (participantMessages.some(msg => msg.evolutionMarkers?.includes('symbol_introduction' as any))) {
        communicationStyle.push('Innovative');
      }
      
      if (participantMessages.some(msg => msg.evolvedMessage.includes('?'))) {
        communicationStyle.push('Inquisitive');
      }

      return {
        participantId: participant.id!,
        name: participant.name,
        provider: participant.provider,
        adaptationRate: Math.min(100, Math.max(0, efficiencyAnalysis.averageImprovement + 50)),
        innovationScore: participantMessages.filter(msg => msg.evolutionMarkers && msg.evolutionMarkers.length > 0).length * 10,
        collaborationEffectiveness: 75, // Placeholder - would need interaction analysis
        communicationStyle,
        performanceMetrics: {
          averageTokensPerMessage: averageTokens,
          responseTimeConsistency: responseTimes.length > 1 ? 100 - (Math.sqrt(responseTimes.reduce((sum, time) => sum + Math.pow(time - avgResponseTime, 2), 0) / responseTimes.length) / avgResponseTime * 100) : 100,
          efficiencyImprovement: efficiencyAnalysis.averageImprovement,
          errorRate: 0, // Would need error detection
          creativityScore: participantMessages.filter(msg => msg.evolvedMessage.match(/[→⇒::\/\/]/g)).length * 5,
          clarityScore: participantMessages.filter(msg => msg.translation).length > 0 ? 90 : 70
        }
      };
    });
  }, [session]);

  // Combined analytics data
  const analyticsData = useMemo((): SessionAnalyticsData | null => {
    if (!session) return null;

    return {
      sessionId: session.id,
      tokenMetrics,
      communicationEvolution,
      participantAnalysis,
      realTimeMetrics: {
        currentIteration: session.currentIteration,
        messagesPerMinute: session.messages.length > 0 
          ? (session.messages.length / ((Date.now() - session.startedAt.getTime()) / 60000)) 
          : 0,
        activeParticipants: session.participants.length,
        systemLoad: 0, // Placeholder
        errorCount: 0, // Placeholder
        lastUpdated: new Date()
      }
    };
  }, [session, tokenMetrics, communicationEvolution, participantAnalysis]);

  // Formatted display values
  const formatters = useMemo(() => ({
    totalTokens: formatTokenCount(tokenMetrics.totalTokens),
    averageTokens: formatTokenCount(Math.round(tokenMetrics.averagePerMessage)),
    totalCost: formatCost(tokenMetrics.costAnalysis.totalCostEstimate),
    efficiency: session?.analytics.efficiencyImprovement 
      ? `${session.analytics.efficiencyImprovement > 0 ? '+' : ''}${session.analytics.efficiencyImprovement.toFixed(1)}%`
      : '0%'
  }), [tokenMetrics, session]);

  // Calculate efficiency trend
  const calculateEfficiencyTrend = useCallback(() => {
    if (!session || session.messages.length < 2) return [];
    
    setIsCalculating(true);
    
    try {
      const tokenCounts = session.messages.map(msg => msg.tokenCount.total);
      const analysis = analyzeTokenTrend(tokenCounts);
      return analysis.efficiencyScores;
    } finally {
      setIsCalculating(false);
    }
  }, [session]);

  // Get participant efficiency
  const getParticipantEfficiency = useCallback((participantId: string) => {
    if (!session) return 0;
    
    const participant = participantAnalysis.find(p => p.participantId === participantId);
    return participant?.performanceMetrics.efficiencyImprovement || 0;
  }, [session, participantAnalysis]);

  // Get evolution highlights
  const getEvolutionHighlights = useCallback(() => {
    if (!session) return [];
    
    const highlights: string[] = [];
    
    if (communicationEvolution.symbolsIntroduced.length > 0) {
      highlights.push(`${communicationEvolution.symbolsIntroduced.length} new symbols introduced`);
    }
    
    if (communicationEvolution.innovationMoments.length > 0) {
      highlights.push(`${communicationEvolution.innovationMoments.length} innovation breakthroughs`);
    }
    
    if (tokenMetrics.efficiencyTrend.length > 5) {
      const recentEfficiency = tokenMetrics.efficiencyTrend.slice(-5);
      const trend = recentEfficiency[recentEfficiency.length - 1].cumulativeEfficiency - recentEfficiency[0].cumulativeEfficiency;
      
      if (trend > 10) {
        highlights.push('Strong efficiency improvement trend');
      } else if (trend < -10) {
        highlights.push('Efficiency declining - may need intervention');
      }
    }
    
    return highlights;
  }, [session, communicationEvolution, tokenMetrics]);

  return {
    // Data
    analyticsData,
    tokenMetrics,
    communicationEvolution,
    participantAnalysis,
    
    // Formatters
    formatters,
    
    // State
    isCalculating,
    
    // Actions
    calculateEfficiencyTrend,
    getParticipantEfficiency,
    getEvolutionHighlights,
    
    // Computed values
    hasData: !!session && session.messages.length > 0,
    messageCount: session?.messages.length || 0,
    participantCount: session?.participants.length || 0,
    sessionDuration: session 
      ? Date.now() - session.startedAt.getTime()
      : 0
  };
}
