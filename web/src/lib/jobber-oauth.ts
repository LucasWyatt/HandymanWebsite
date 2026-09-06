// Jobber OAuth Token Refresh System

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export class JobberOAuth {
  private clientId: string;
  private clientSecret: string;
  private refreshToken: string;

  constructor() {
    this.clientId = process.env.JOBBER_CLIENT_ID!;
    this.clientSecret = process.env.JOBBER_CLIENT_SECRET!;
    this.refreshToken = process.env.JOBBER_REFRESH_TOKEN!;
  }

  async refreshAccessToken(): Promise<TokenResponse> {
    const response = await fetch('https://api.getjobber.com/api/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token refresh failed: ${response.status} - ${error}`);
    }

    const tokenData: TokenResponse = await response.json();
    
    console.log('✅ Jobber tokens refreshed successfully');
    console.log('⚠️ IMPORTANT: New refresh token must be saved immediately!');
    console.log('⚠️ Update these environment variables:');
    console.log(`JOBBER_ACCESS_TOKEN=${tokenData.access_token}`);
    console.log(`JOBBER_REFRESH_TOKEN=${tokenData.refresh_token}`);
    console.log('⚠️ The old refresh token is now invalid and cannot be used again.');
    
    return tokenData;
  }

  // Check if current token is expired or expiring soon
  isTokenExpiring(bufferMinutes = 60): boolean {
    try {
      const token = process.env.JOBBER_ACCESS_TOKEN;
      if (!token) return true;

      // Decode JWT payload
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const bufferTime = bufferMinutes * 60 * 1000; // Convert to milliseconds

      return (expirationTime - currentTime) < bufferTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // Assume expired if we can't parse
    }
  }

  // Get token info
  getTokenInfo() {
    try {
      const token = process.env.JOBBER_ACCESS_TOKEN;
      if (!token) return null;

      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      
      return {
        expiresAt: new Date(payload.exp * 1000),
        isExpired: payload.exp * 1000 < Date.now(),
        accountId: payload.account_id,
        userId: payload.user_id,
        scopes: payload.scope?.split(' ') || [],
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }
}

// Utility function to refresh tokens when needed
export async function ensureValidToken(): Promise<string> {
  const oauth = new JobberOAuth();
  
  if (oauth.isTokenExpiring()) {
    console.log('🔄 Jobber token is expiring, refreshing...');
    const newTokens = await oauth.refreshAccessToken();
    
    // In production, you'd want to update environment variables programmatically
    // For now, we'll log them for manual update
    return newTokens.access_token;
  }
  
  return process.env.JOBBER_ACCESS_TOKEN!;
}