import { NextRequest, NextResponse } from 'next/server';
import { JobberOAuth } from '@/lib/jobber-oauth';

// Security check for admin endpoints
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const expectedAuth = `Bearer ${process.env.ADMIN_SECRET_KEY}`;
  
  return authHeader === expectedAuth;
}

// Admin endpoint to refresh Jobber tokens
// Access: GET /api/admin/refresh-tokens
// Headers: Authorization: Bearer your_admin_secret_key
export async function GET(request: NextRequest) {
  // Security check
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  try {
    const oauth = new JobberOAuth();
    
    // Check current token status
    const tokenInfo = oauth.getTokenInfo();
    
    if (!tokenInfo) {
      return NextResponse.json(
        { error: 'No valid token found' },
        { status: 400 }
      );
    }

    const response = {
      currentToken: {
        expiresAt: tokenInfo.expiresAt,
        isExpired: tokenInfo.isExpired,
        isExpiring: oauth.isTokenExpiring(),
        accountId: tokenInfo.accountId,
        scopes: tokenInfo.scopes,
      },
      message: tokenInfo.isExpired 
        ? 'Token is expired - refresh required'
        : oauth.isTokenExpiring()
        ? 'Token expires soon - refresh recommended'
        : 'Token is still valid',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Token check error:', error);
    return NextResponse.json(
      { error: 'Failed to check token status' },
      { status: 500 }
    );
  }
}

// Refresh tokens
// Access: POST /api/admin/refresh-tokens
// Headers: Authorization: Bearer your_admin_secret_key
export async function POST(request: NextRequest) {
  // Security check
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  try {
    const oauth = new JobberOAuth();
    
    console.log('🔄 Starting token refresh...');
    const newTokens = await oauth.refreshAccessToken();
    
    return NextResponse.json({
      success: true,
      message: 'Tokens refreshed successfully',
      newTokens: {
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
        expires_in: newTokens.expires_in,
      },
      instructions: [
        'Update these environment variables in Vercel:',
        `JOBBER_ACCESS_TOKEN=${newTokens.access_token}`,
        `JOBBER_REFRESH_TOKEN=${newTokens.refresh_token}`,
        'Then redeploy your application',
      ],
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to refresh tokens',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}