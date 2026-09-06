import { NextRequest, NextResponse } from 'next/server';

interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.json(
      { error: 'OAuth authorization failed', details: error },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: 'Authorization code not provided' },
      { status: 400 }
    );
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.getjobber.com/api/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.JOBBER_CLIENT_ID!,
        client_secret: process.env.JOBBER_CLIENT_SECRET!,
        code: code,
        redirect_uri: process.env.JOBBER_REDIRECT_URI!,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to exchange code for token' },
        { status: 500 }
      );
    }

    const tokenData: TokenResponse = await tokenResponse.json();

    // In a production environment, you would store these tokens securely
    // For now, we'll return them to be manually added to environment variables
    const responseData = {
      success: true,
      message: 'OAuth flow completed successfully',
      tokens: {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        scope: tokenData.scope,
      },
      instructions: [
        'Add the following to your .env.local file:',
        `JOBBER_ACCESS_TOKEN=${tokenData.access_token}`,
        tokenData.refresh_token ? `JOBBER_REFRESH_TOKEN=${tokenData.refresh_token}` : '',
        '',
        'Then redeploy your application.',
      ].filter(Boolean),
    };

    // Log tokens securely (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('OAuth tokens received:', {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
      });
    }

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error during OAuth callback' },
      { status: 500 }
    );
  }
}

