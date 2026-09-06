import { NextRequest, NextResponse } from 'next/server';
import { getJobberClient } from '@/lib/jobber-client';
import { FormSubmissionData, ClientCreateInput, RequestCreateInput, ServiceSelection } from '@/lib/jobber-types';
import { 
  sanitizers, 
  validators, 
  checkRateLimit, 
  getClientIP, 
  rateLimit,
  fileValidation 
} from '@/lib/security';

function formatServicesForJobber(services: ServiceSelection[], otherRequest?: string): string {
  if (services.length === 0 && !otherRequest) {
    return 'General Inquiry';
  }
  
  const lines: string[] = [];
  
  // Group services by category
  const grouped = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service.service);
    return acc;
  }, {} as Record<string, string[]>);
  
  // Format each category
  Object.entries(grouped).forEach(([category, serviceList]) => {
    lines.push(`• ${category}: ${serviceList.join(', ')}`);
  });
  
  // Add other request if provided
  if (otherRequest) {
    lines.push(`• Other: ${otherRequest}`);
  }
  
  return lines.join('\n');
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP, rateLimit.formSubmission);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many submission attempts. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': rateLimit.formSubmission.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }

    // Parse form data from FormData
    const incomingFormData = await request.formData();
    
    // Extract and sanitize form fields
    const rawData = {
      firstName: incomingFormData.get('firstName') as string,
      lastName: incomingFormData.get('lastName') as string,
      companyName: incomingFormData.get('companyName') as string,
      email: incomingFormData.get('email') as string,
      phone: incomingFormData.get('phone') as string,
      address: incomingFormData.get('address') as string,
      address2: incomingFormData.get('address2') as string,
      city: incomingFormData.get('city') as string,
      state: incomingFormData.get('state') as string,
      zipCode: incomingFormData.get('zipCode') as string,
      services: JSON.parse(incomingFormData.get('services') as string || '[]'),
      otherRequest: incomingFormData.get('otherRequest') as string,
      consentToContact: incomingFormData.get('consentToContact') === 'true'
    };

    // Validate form data before sanitization
    const validation = validators.validateFormData(rawData);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid form data', details: validation.errors },
        { status: 400 }
      );
    }

    // Sanitize all inputs
    const submissionData: FormSubmissionData = {
      firstName: sanitizers.sanitizeText(rawData.firstName),
      lastName: sanitizers.sanitizeText(rawData.lastName),
      companyName: rawData.companyName ? sanitizers.sanitizeText(rawData.companyName) : undefined,
      email: sanitizers.sanitizeEmail(rawData.email),
      phone: sanitizers.sanitizePhone(rawData.phone),
      address: sanitizers.sanitizeText(rawData.address),
      address2: rawData.address2 ? sanitizers.sanitizeText(rawData.address2) : undefined,
      city: sanitizers.sanitizeText(rawData.city),
      state: sanitizers.sanitizeText(rawData.state),
      zipCode: sanitizers.sanitizeZipCode(rawData.zipCode),
      services: sanitizers.sanitizeServices(rawData.services),
      otherRequest: rawData.otherRequest ? sanitizers.sanitizeText(rawData.otherRequest) : undefined,
      consentToContact: rawData.consentToContact,
      photos: [],
    };

    // Extract and validate photo files
    const photos: File[] = [];
    const formDataEntries = Array.from(incomingFormData.entries());
    
    for (const [key, value] of formDataEntries) {
      if (key.startsWith('photo_') && value instanceof File) {
        // Validate each file
        const fileValidationResult = fileValidation.validateFile(value);
        if (!fileValidationResult.isValid) {
          return NextResponse.json(
            { error: `File validation failed: ${fileValidationResult.error}` },
            { status: 400 }
          );
        }
        photos.push(value);
      }
    }
    
    // Check file count limit
    if (photos.length > fileValidation.maxFiles) {
      return NextResponse.json(
        { error: `Too many files. Maximum ${fileValidation.maxFiles} files allowed.` },
        { status: 400 }
      );
    }
    
    submissionData.photos = photos;

    // Initialize Jobber client
    const jobberClient = await getJobberClient();

    // Check if client already exists
    let client = await jobberClient.findClientByEmail(submissionData.email);
    
    if (!client) {
      // Create new client
      const clientInput: ClientCreateInput = {
        firstName: submissionData.firstName,
        lastName: submissionData.lastName,
        companyName: submissionData.companyName,
        emails: [{
          address: submissionData.email,
          description: 'MAIN',
          primary: true,
        }],
        phones: [{
          number: submissionData.phone,
          description: 'MAIN',
        }],
        billingAddress: {
          street1: submissionData.address,
          street2: submissionData.address2,
          city: submissionData.city,
          province: submissionData.state,
          postalCode: submissionData.zipCode,
        },
      };

      client = await jobberClient.createClient(clientInput);
      console.log('Created new client:', client.id);
    } else {
      console.log('Using existing client:', client.id);
    }

    // Prepare request data
    const servicesText = formatServicesForJobber(submissionData.services, submissionData.otherRequest);
    
    const title = `Website Lead — ${servicesText}`;
    
    const description = [
      `**Services Requested:**\n${servicesText}`,
      `**Address:** ${submissionData.address}${submissionData.address2 ? `, ${submissionData.address2}` : ''}, ${submissionData.city}, ${submissionData.state} ${submissionData.zipCode}`,
      submissionData.companyName ? `**Company:** ${submissionData.companyName}` : '',
      `**Phone:** ${submissionData.phone}`,
      `**Email:** ${submissionData.email}`,
      submissionData.otherRequest ? `**Additional Details:** ${submissionData.otherRequest}` : '',
      '',
      '**Source:** Website Form Submission',
      submissionData.photos && submissionData.photos.length > 0 
        ? `**Photos Uploaded:** ${submissionData.photos.length} files` 
        : '',
    ].filter(Boolean).join('\n');

    // Create request (simplified - just clientId and title based on our schema testing)
    const requestInput: RequestCreateInput = {
      clientId: client.id,
      title,
    };

    const jobberRequest = await jobberClient.createRequest(requestInput);
    
    console.log('Created request:', jobberRequest.id, jobberRequest.number);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Request submitted successfully',
      data: {
        clientId: client.id,
        requestId: jobberRequest.id,
        requestNumber: jobberRequest.number,
      },
    });

  } catch (error) {
    console.error('Form submission error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('access token')) {
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again later or call us directly.' },
          { status: 503 }
        );
      }
      
      if (error.message.includes('GraphQL error')) {
        return NextResponse.json(
          { error: 'Invalid form data. Please check your entries and try again.' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to submit request. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}