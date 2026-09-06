import {
  ClientCreateInput,
  RequestCreateInput,
  ClientCreateResponse,
  RequestCreateResponse,
  ClientQueryResponse,
  JobberClient,
} from './jobber-types';
import { JobberOAuth } from './jobber-oauth';

export class JobberGraphQLClient {
  private apiUrl: string;
  private accessToken: string;

  constructor(accessToken: string) {
    this.apiUrl = process.env.JOBBER_API_URL || 'https://api.getjobber.com/api/graphql';
    this.accessToken = accessToken;
  }

  private async makeRequest<T>(query: string, variables?: any): Promise<T> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
        'X-API-Version': process.env.JOBBER_API_VERSION || '2023-11-15',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Jobber API HTTP error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      console.error('Jobber GraphQL errors:', result.errors);
      throw new Error(`GraphQL error: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  }

  async findClientByEmail(email: string): Promise<JobberClient | null> {
    const query = `
      query FindClientByEmail($email: String!) {
        clients(filter: { email: $email }, first: 1) {
          nodes {
            id
            firstName
            lastName
            companyName
            emails {
              address
            }
            phones {
              number
            }
          }
        }
      }
    `;

    try {
      const response = await this.makeRequest<ClientQueryResponse>(query, { email });
      const clients = response.clients.nodes;
      
      if (clients.length > 0) {
        const client = clients[0];
        return {
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          companyName: client.companyName,
          email: client.emails?.[0]?.address,
          phone: client.phones?.[0]?.number,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error finding client by email:', error);
      return null;
    }
  }

  async createClient(input: ClientCreateInput): Promise<JobberClient> {
    const mutation = `
      mutation CreateClient($input: ClientCreateInput!) {
        clientCreate(input: $input) {
          client {
            id
            firstName
            lastName
            companyName
            emails {
              address
            }
            phones {
              number
            }
          }
          userErrors {
            message
            path
          }
        }
      }
    `;

    const response = await this.makeRequest<ClientCreateResponse>(mutation, { input });
    
    if (response.clientCreate.userErrors.length > 0) {
      throw new Error(`Client creation failed: ${response.clientCreate.userErrors.map(e => e.message).join(', ')}`);
    }

    if (!response.clientCreate.client) {
      throw new Error('Client creation failed: No client returned');
    }

    const client = response.clientCreate.client;
    return {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      companyName: client.companyName,
      email: client.emails?.[0]?.address,
      phone: client.phones?.[0]?.number,
    };
  }

  async createRequest(input: RequestCreateInput): Promise<{ id: string; number: string }> {
    const mutation = `
      mutation CreateRequest($input: RequestCreateInput!) {
        requestCreate(input: $input) {
          request {
            id
            number
          }
          userErrors {
            message
            path
          }
        }
      }
    `;

    const response = await this.makeRequest<RequestCreateResponse>(mutation, { input });
    
    if (response.requestCreate.userErrors.length > 0) {
      throw new Error(`Request creation failed: ${response.requestCreate.userErrors.map(e => e.message).join(', ')}`);
    }

    if (!response.requestCreate.request) {
      throw new Error('Request creation failed: No request returned');
    }

    return {
      id: response.requestCreate.request.id,
      number: response.requestCreate.request.number,
    };
  }
}

export async function getJobberClient(): Promise<JobberGraphQLClient> {
  let accessToken = process.env.JOBBER_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error('Jobber access token not configured');
  }

  // Automatic token refresh if needed
  try {
    const oauth = new JobberOAuth();
    
    // Check if token is expiring in the next hour
    if (oauth.isTokenExpiring(60)) {
      console.log('🔄 Jobber token expiring soon, refreshing automatically...');
      const newTokens = await oauth.refreshAccessToken();
      
      // Use the fresh token for this request
      accessToken = newTokens.access_token;
      
      // Log warning about environment variables (they'll need manual update for persistence)
      console.warn('⚠️ Token refreshed temporarily. Update environment variables:');
      console.warn(`JOBBER_ACCESS_TOKEN=${newTokens.access_token.substring(0, 50)}...`);
      console.warn(`JOBBER_REFRESH_TOKEN=${newTokens.refresh_token.substring(0, 50)}...`);
    }
  } catch (error) {
    console.error('❌ Token refresh failed, using existing token:', error);
    // Continue with existing token - might still work
  }
  
  return new JobberGraphQLClient(accessToken);
}