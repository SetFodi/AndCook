import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Get all environment variables
    const envVars = { ...process.env };
    
    // Mask sensitive information
    const maskedEnv: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(envVars)) {
      if (!value) continue;
      
      // Mask sensitive values
      if (key.includes('URI') || key.includes('SECRET') || key.includes('KEY') || key.includes('PASSWORD')) {
        if (typeof value === 'string') {
          if (value.includes('@')) {
            // For URIs with username/password
            const parts = value.split('@');
            const protocol = parts[0].split('://')[0];
            maskedEnv[key] = `${protocol}://*****@${parts[1]}`;
          } else {
            // For other sensitive values
            maskedEnv[key] = value.substring(0, 3) + '*'.repeat(5);
          }
        } else {
          maskedEnv[key] = '*****';
        }
      } else {
        // Non-sensitive values
        maskedEnv[key] = typeof value === 'string' ? value : String(value);
      }
    }
    
    // Return the environment variables
    return NextResponse.json({
      status: 'success',
      environment: process.env.NODE_ENV,
      variables: maskedEnv,
    });
  } catch (error) {
    console.error('Environment API error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Error in environment API',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
