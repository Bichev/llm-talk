import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Check if Claude API key is available
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Claude API key not configured' },
        { status: 400 }
      );
    }

    // Check if the key is properly formatted (Claude keys typically start with 'sk-ant-')
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey && apiKey.startsWith('sk-ant-') && apiKey.length > 20) {
      return NextResponse.json({ 
        success: true, 
        message: 'Claude provider is available (key configured)' 
      });
    } else {
      return NextResponse.json(
        { error: 'Claude API key appears to be invalid' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Claude provider test failed:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Claude provider test failed',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
