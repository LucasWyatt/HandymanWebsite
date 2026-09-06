# Jobber API Integration Plan for Hometown Handyman

_Research conducted: January 2025_

## Executive Summary

Our current estimate form is **exceptionally well-positioned** for Jobber API integration. The form fields align perfectly with Jobber's GraphQL API requirements, requiring minimal restructuring for future integration.

## Jobber API Overview

### Platform Details

- **API Type**: GraphQL-based REST API
- **Authentication**: OAuth 2.0
- **Current Version**: 2023-11-15
- **Base URL**: `https://api.getjobber.com/api/graphql`
- **Content Type**: `application/json`

### Key Capabilities

- Client/customer management
- Job creation and tracking
- Quote/estimate workflows
- Real-time webhooks
- File attachments
- Lead source tracking (automatic for app-created clients)

## Form Field Compatibility Analysis

### ✅ Perfect Alignment

Our current `FormData` interface maps directly to Jobber's API:

```typescript
// Current Form Fields → Jobber API Fields
interface FormData {
  // Client Creation (clientCreate mutation)
  firstName: string; // → firstName
  lastName: string; // → lastName (required)
  email: string; // → emails[]{address, description: MAIN, primary: true}
  phone: string; // → phones[] (already formatted as (555) 456-7890)
  address: string; // → billingAddress.street
  city: string; // → billingAddress.city
  zipCode: string; // → billingAddress.postalCode

  // Job/Quote Creation
  serviceType: string; // → Job category/service classification
  projectDescription: string; // → Job description/notes
  urgency: string; // → Priority level/scheduling preference
  budgetRange: number; // → Estimated job value

  // Attachments
  photos: PhotoFile[]; // → File attachments via separate API

  // Compliance (internal use)
  consentToRates: boolean; // → Internal consent tracking
  consentToContact: boolean; // → Internal consent tracking
}
```

### Jobber Client Creation Example

```graphql
mutation CreateClient {
  clientCreate(
    input: {
      firstName: "John"
      lastName: "Smith"
      emails: [
        { address: "john.smith@example.com", description: MAIN, primary: true }
      ]
      phones: [{ number: "(555) 456-7890", description: MAIN }]
      billingAddress: {
        street: "123 Main St"
        city: "Cincinnati"
        province: "OH"
        postalCode: "45208"
      }
      companyName: "Smith Residence" # Optional
    }
  ) {
    client {
      id
      firstName
      lastName
      isLead
    }
    userErrors {
      message
      path
    }
  }
}
```

## Service Area Integration

### Current Implementation

Our form already validates ZIP codes against East Cincinnati service areas:

- 45208 (Hyde Park)
- 45174 (Terrace Park)
- 45243 (Indian Hill)
- 45226 (Oakley)
- 45227 (Mount Lookout)
- 45209 (Mount Adams)
- 45229 (Norwood)

### Jobber Integration Strategy

- **In-area leads**: Create as regular clients with immediate job/quote creation
- **Out-of-area leads**: Create as leads (`isLead: true`) for manual review
- **Lead source**: Automatically tagged as "Hometown Handyman Website Form"

## Implementation Roadmap

### Phase 1: Foundation Setup

**Estimated Duration**: 1-2 days

1. **Developer Account Setup**
   - Create Jobber developer testing account (90-day trial)
   - Register application and obtain OAuth credentials
   - Configure redirect URLs

2. **API Service Layer**

   ```typescript
   // /src/lib/jobber.ts
   class JobberAPI {
     private accessToken: string;

     async createClient(clientData: CreateClientInput): Promise<Client>;
     async createQuote(quoteData: CreateQuoteInput): Promise<Quote>;
     async uploadAttachment(file: File, jobId: string): Promise<Attachment>;
   }
   ```

3. **Environment Configuration**
   ```env
   JOBBER_CLIENT_ID=your_client_id
   JOBBER_CLIENT_SECRET=your_client_secret
   JOBBER_REDIRECT_URI=https://example.com/api/jobber/callback
   JOBBER_API_VERSION=2023-11-15
   ```

### Phase 2: Core Integration

**Estimated Duration**: 2-3 days

1. **Form Submission Endpoint**

   ```typescript
   // /src/app/api/jobber/submit-estimate/route.ts
   export async function POST(request: Request) {
     const formData = await request.json();

     // Transform form data
     const clientData = transformToJobberClient(formData);
     const quoteData = transformToJobberQuote(formData);

     // Create client
     const client = await jobber.createClient(clientData);

     // Create quote
     const quote = await jobber.createQuote({
       ...quoteData,
       clientId: client.id,
     });

     return Response.json({
       success: true,
       clientId: client.id,
       quoteId: quote.id,
     });
   }
   ```

2. **Data Transformation Layer**

   ```typescript
   function transformToJobberClient(formData: FormData): CreateClientInput {
     return {
       firstName: formData.firstName,
       lastName: formData.lastName,
       emails: [
         {
           address: formData.email,
           description: 'MAIN',
           primary: true,
         },
       ],
       phones: [
         {
           number: formData.phone,
           description: 'MAIN',
         },
       ],
       billingAddress: {
         street: formData.address,
         city: formData.city,
         province: 'OH',
         postalCode: formData.zipCode,
       },
     };
   }
   ```

3. **Webhook Configuration**
   - Register webhooks for `CLIENT_CREATE`, `QUOTE_CREATE` events
   - Implement webhook handlers for status updates

### Phase 3: Advanced Features

**Estimated Duration**: 3-4 days

1. **Photo Upload Integration**

   ```typescript
   async function uploadPhotosToJobber(photos: PhotoFile[], jobId: string) {
     const uploads = photos.map(photo =>
       jobber.uploadAttachment(photo.file, jobId)
     );
     return Promise.all(uploads);
   }
   ```

2. **Real-time Status Updates**
   - Webhook endpoint: `/api/jobber/webhooks`
   - Email notifications for quote approvals
   - Status dashboard integration

3. **Lead Scoring and Routing**
   - Service area prioritization
   - Budget-based lead classification
   - Automated follow-up sequences

## Webhook Implementation

### Event Types to Monitor

```typescript
interface JobberWebhook {
  CLIENT_CREATE: ClientCreatedEvent;
  QUOTE_CREATE: QuoteCreatedEvent;
  QUOTE_CONVERT: QuoteConvertedEvent;
  JOB_CREATE: JobCreatedEvent;
}
```

### Security Implementation

```typescript
// Webhook signature verification
function verifyJobberWebhook(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', process.env.JOBBER_WEBHOOK_SECRET);
  hmac.update(payload);
  const calculatedSignature = hmac.digest('base64');
  return signature === calculatedSignature;
}
```

## Testing Strategy

### Development Environment

1. Use Jobber's GraphQL Playground for API testing
2. Implement comprehensive unit tests for data transformations
3. Mock Jobber API for local development

### Staging Validation

1. End-to-end form submission testing
2. Webhook delivery verification
3. Data integrity validation between systems

## Business Benefits

### Immediate Value

- **Automated lead capture**: Zero manual data entry
- **Lead source tracking**: Clear attribution from website forms
- **Service area validation**: Automated routing based on ZIP codes
- **Professional workflow**: Seamless quote-to-job conversion

### Long-term Value

- **Customer relationship management**: Centralized client database
- **Revenue tracking**: Direct ROI measurement from website leads
- **Operational efficiency**: Reduced administrative overhead
- **Business intelligence**: Data-driven decision making

## API Rate Limits and Best Practices

### Rate Limiting

- Monitor API usage to stay within Jobber's rate limits
- Implement exponential backoff for failed requests
- Use bulk operations where available

### Error Handling

```typescript
class JobberError extends Error {
  constructor(
    public message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
  }
}

async function handleJobberRequest<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (error) {
    if (error.code === 'RATE_LIMITED') {
      // Implement backoff strategy
    }
    throw new JobberError(error.message, error.code, error.details);
  }
}
```

## Security Considerations

### Data Protection

- Encrypt OAuth tokens in database
- Use environment variables for sensitive configuration
- Implement request signing for webhook security
- Regular token rotation

### Compliance

- GDPR compliance for customer data
- SOC 2 adherence (Jobber is SOC 2 certified)
- Data retention policies alignment

## Migration Strategy

### Rollout Plan

1. **Parallel Operation**: Run form with both console.log and Jobber submission
2. **Gradual Migration**: Start with test submissions, gradually increase percentage
3. **Full Deployment**: Switch to Jobber-only after validation period

### Rollback Plan

- Maintain form's current console.log functionality as fallback
- Monitor error rates and success metrics
- Quick revert capability via feature flags

## Support and Resources

### Documentation

- **Jobber API Docs**: https://developer.getjobber.com/docs/
- **GraphQL Playground**: Available in Developer Center
- **API Support**: api-support@getjobber.com

### Integration Examples

- **Ruby on Rails Template**: https://github.com/GetJobber/Jobber-AppTemplate-RailsAPI
- **Community Resources**: Available on DEV.to and Jobber Community forums

## Cost Considerations

### Jobber Pricing

- Developer testing accounts: 90-day free trial
- Production usage: Based on Jobber subscription tiers
- API usage: Included in standard Jobber subscriptions

### Development Investment

- **Initial Setup**: ~1 week development time
- **Testing & Validation**: ~3-5 days
- **Deployment & Monitoring**: ~2 days
- **Total Estimated**: 2-3 weeks for full integration

## Conclusion

The Hometown Handyman estimate form is architecturally excellent for Jobber integration. The field alignment is nearly perfect, requiring minimal changes to the existing form structure. The primary work involves creating the API service layer and transformation functions.

**Recommendation**: When ready to proceed, start with Phase 1 (Foundation Setup) to establish the connection, then implement Phase 2 (Core Integration) for immediate business value. Phase 3 features can be added incrementally based on business needs.

---

_This document should be reviewed and updated when beginning active Jobber integration development._
