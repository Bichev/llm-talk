import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Check if Gemini API key is available
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 400 }
      );
    }

    // Check if the key is properly formatted (Google API keys are typically long alphanumeric strings)
    const apiKey = process.env.GOOGLE_API_KEY;
    if (apiKey && apiKey.length > 30) {
      return NextResponse.json({ 
        success: true, 
        message: 'Gemini provider is available (key configured)' 
      });
    } else {
      return NextResponse.json(
        { error: 'Gemini API key appears to be invalid' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Gemini provider test failed:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Gemini provider test failed',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
