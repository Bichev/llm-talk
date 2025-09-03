import { NextRequest, NextResponse } from 'next/server';
import { SessionManager } from '@/lib/session-manager';
import type { StartSessionRequest } from '@/types/session';

export async function POST(request: NextRequest) {
  try {
    const body: StartSessionRequest = await request.json();
    
    // Validate request
    if (!body.topic || !body.participants || body.participants.length < 2) {
      return NextResponse.json(
        { error: 'Invalid session configuration' },
        { status: 400 }
      );
    }

    // Create session manager and start session
    const sessionManager = new SessionManager();
    const session = await sessionManager.startSession(body);

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        config: {
          topic: session.config.topic,
          scenario: session.config.scenario,
          maxIterations: session.config.maxIterations,
          participants: session.participants,
          customPrompt: session.config.customPrompt
        },
        participants: session.participants,
        currentIteration: session.currentIteration || 0,
        messages: session.messages || [],
        startedAt: session.startedAt,
        updatedAt: session.updatedAt,
        analytics: {
          totalTokens: 0,
          averageTokensPerMessage: 0,
          tokenEfficiencyTrend: [],
          participantStats: [],
          evolutionMarkers: [],
          efficiencyImprovement: 0,
          communicationPatterns: []
        }
      }
    });

  } catch (error) {
    console.error('Failed to start session:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to start session',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
