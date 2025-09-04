import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Check if Perplexity API key is available
    if (!process.env.PERPLEXITY_API_KEY) {
      return NextResponse.json(
        { error: 'Perplexity API key not configured' },
        { status: 400 }
      );
    }

    // Check if the key is properly formatted (Perplexity keys typically start with 'pplx-')
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (apiKey && apiKey.startsWith('pplx-') && apiKey.length > 20) {
      return NextResponse.json({ 
        success: true, 
        message: 'Perplexity provider is available (key configured)' 
      });
    } else {
      return NextResponse.json(
        { error: 'Perplexity API key appears to be invalid' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Perplexity provider test failed:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Perplexity provider test failed',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
