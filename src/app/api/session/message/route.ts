import { NextRequest, NextResponse } from 'next/server';
import { SessionManager } from '@/lib/session-manager';
import type { SendMessageRequest } from '@/types/session';

export async function POST(request: NextRequest) {
  try {
    const body: SendMessageRequest = await request.json();
    
    console.log('📤 Message API - Request received:', {
      sessionId: body.sessionId,
      hasSessionId: !!body.sessionId
    });
    
    // Validate request
    if (!body.sessionId) {
      console.error('❌ Message API - Missing session ID');
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Create session manager and load existing session
    const sessionManager = new SessionManager();
    
    console.log('🔄 Message API - Loading session:', body.sessionId);
    
    // Load the session from database first
    const loadedSession = await sessionManager.loadSession(body.sessionId);
    
    console.log('✅ Message API - Session loaded:', {
      sessionId: loadedSession.id,
      status: loadedSession.status,
      currentIteration: loadedSession.currentIteration,
      messagesCount: loadedSession.messages.length
    });
    
    console.log('📤 Message API - About to call sendMessage...');
    
    // Now send the message
    const message = await sessionManager.sendMessage(body);
    
    console.log('✅ Message API - Message sent successfully:', {
      messageId: message.id,
      speaker: message.speaker,
      iteration: message.iteration
    });

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        sessionId: message.sessionId,
        speaker: message.speaker,
        evolvedMessage: message.evolvedMessage,
        translation: message.translation,
        iteration: message.iteration,
        tokenCount: message.tokenCount,
        processingTime: message.processingTime,
        timestamp: message.timestamp
      }
    });

  } catch (error) {
    console.error('Failed to send message:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to send message',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
