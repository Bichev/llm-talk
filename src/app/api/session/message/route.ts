import { NextRequest, NextResponse } from 'next/server';
import { SessionManager } from '@/lib/session-manager';
import type { SendMessageRequest } from '@/types/session';

export async function POST(request: NextRequest) {
  try {
    const body: SendMessageRequest = await request.json();
    
    // Validate request
    if (!body.sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Create session manager and send message
    const sessionManager = new SessionManager();
    const message = await sessionManager.sendMessage(body);

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
