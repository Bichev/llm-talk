import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '0.1.0',
    };

    // Check if required environment variables are present
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
    ];

    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        {
          ...health,
          status: 'degraded',
          warnings: [`Missing environment variables: ${missingEnvVars.join(', ')}`],
        },
        { status: 200 }
      );
    }

    // Check if at least one LLM provider is configured
    const llmProviders = [
      'OPENAI_API_KEY',
      'ANTHROPIC_API_KEY',
      'GOOGLE_API_KEY',
      'PERPLEXITY_API_KEY',
    ];

    const configuredProviders = llmProviders.filter(
      (provider) => process.env[provider]
    );

    if (configuredProviders.length === 0) {
      return NextResponse.json(
        {
          ...health,
          status: 'degraded',
          warnings: ['No LLM providers configured. Basic functionality may be limited.'],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function HEAD() {
  // Simple HEAD request for basic health check
  return new NextResponse(null, { status: 200 });
}
