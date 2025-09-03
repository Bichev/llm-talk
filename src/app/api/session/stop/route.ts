import { NextRequest, NextResponse } from 'next/server';
import { SessionManager } from '@/lib/session-manager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, reason = 'manual' } = body;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Create session manager and load existing session
    const sessionManager = new SessionManager();
    
    // Load the session from database first
    await sessionManager.loadSession(sessionId);
    
    // Now stop the session
    await sessionManager.stopSession(reason);

    return NextResponse.json({
      success: true,
      message: `Session stopped (${reason})`
    });

  } catch (error) {
    console.error('Failed to stop session:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to stop session',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
