import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 400 }
      );
    }

    // For now, just check if the key exists and is properly formatted
    // TODO: Add actual connection test when needed
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey.startsWith('sk-') && apiKey.length > 20) {
      return NextResponse.json({ 
        success: true, 
        message: 'OpenAI provider is available (key configured)' 
      });
    } else {
      return NextResponse.json(
        { error: 'OpenAI API key appears to be invalid' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('OpenAI provider test failed:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'OpenAI provider test failed',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
