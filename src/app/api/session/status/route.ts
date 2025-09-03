import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get session data directly from database
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select(`
        *,
        participants (*),
        messages (*)
      `)
      .eq('id', sessionId)
      .single();

    if (sessionError) {
      throw new Error(`Failed to fetch session: ${sessionError.message}`);
    }

    if (!sessionData) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Transform database data to API response format
    const session = {
      id: sessionData.id,
      status: sessionData.status,
      config: {
        topic: sessionData.topic,
        scenario: sessionData.scenario,
        maxIterations: sessionData.max_iterations,
        participants: sessionData.participants || [],
        customPrompt: sessionData.config?.customPrompt
      },
      participants: sessionData.participants || [],
      currentIteration: sessionData.current_iteration || 0,
      messages: sessionData.messages || [],
      startedAt: sessionData.created_at,
      updatedAt: sessionData.updated_at,
      analytics: {
        totalTokens: 0,
        averageTokensPerMessage: 0,
        tokenEfficiencyTrend: [],
        participantStats: [],
        evolutionMarkers: [],
        efficiencyImprovement: 0,
        communicationPatterns: []
      }
    };

    return NextResponse.json({
      success: true,
      session
    });

  } catch (error) {
    console.error('Failed to get session status:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to get session status',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
