import { NextRequest, NextResponse } from 'next/server';
import {
  sanitizers,
  validators,
  checkRateLimit,
  getClientIP,
  rateLimit,
  fileValidation,
} from '@/lib/security';
import {
  filesToEmailAttachments,
  validateAttachmentSize,
  formatFileSize,
  EmailAttachment,
} from '@/lib/email-utils';
import { ServiceSelection } from '@/lib/jobber-types';

// Service formatting helper (same as Jobber endpoint)
function formatServicesForEmail(
  services: ServiceSelection[],
  otherRequest?: string
): string {
  if (services.length === 0 && !otherRequest) {
    return 'General Inquiry';
  }

  const lines: string[] = [];

  // Group services by category
  const grouped = services.reduce(
    (acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push(service.service);
      return acc;
    },
    {} as Record<string, string[]>
  );

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

interface EmailFallbackData {
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  services: ServiceSelection[];
  otherRequest?: string;
  photos: File[];
  attachments?: EmailAttachment[];
  errorMessage?: string;
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  'general-repairs': 'General Repairs / Handyman',
  'property-management': 'Property Management (Short- or Long-Term)',
  'kitchen-remodel': 'Kitchen Remodel',
  'bathroom-remodel': 'Bathroom Remodel',
  'basement-finishing': 'Basement Finishing',
  'whole-home-renovation': 'Whole-Home Renovation',
  'additions-extensions': 'Additions / Extensions',
  other: 'Other',
};

// Configure your email settings here
const EMAIL_CONFIG = {
  recipientEmail: process.env.ESTIMATES_EMAIL || 'estimates@example.com',
  fromEmail: process.env.FROM_EMAIL || 'noreply@example.com',
  replyToEmail: process.env.REPLY_TO_EMAIL || 'estimates@example.com',

  // Email service configuration (Resend, SendGrid, etc.)
  apiKey: process.env.EMAIL_API_KEY,
  service: process.env.EMAIL_SERVICE || 'resend', // 'resend', 'sendgrid', 'mailgun'
};

function generateEmailHTML(data: EmailFallbackData): string {
  const servicesText = formatServicesForEmail(data.services, data.otherRequest);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Form Submission Fallback - ${data.firstName} ${data.lastName}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #C34B44; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .section { margin-bottom: 20px; }
    .label { font-weight: bold; color: #555; }
    .value { margin-left: 10px; }
    .alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
    .footer { background: #f1f1f1; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚨 Form Submission Fallback</h1>
    <p>Jobber API failed - Manual follow-up required</p>
  </div>
  
  <div class="content">
    <div class="alert">
      <strong>Action Required:</strong> This form submission failed to reach Jobber automatically. 
      Please manually enter this lead into Jobber and contact the customer.
    </div>
    
    <div class="section">
      <h3>Customer Information</h3>
      <p><span class="label">Name:</span><span class="value">${data.firstName} ${data.lastName}</span></p>
      ${data.companyName ? `<p><span class="label">Company:</span><span class="value">${data.companyName}</span></p>` : ''}
      <p><span class="label">Email:</span><span class="value"><a href="mailto:${data.email}">${data.email}</a></span></p>
      <p><span class="label">Phone:</span><span class="value"><a href="tel:${data.phone}">${data.phone}</a></span></p>
    </div>
    
    <div class="section">
      <h3>Service Location</h3>
      <p><span class="label">Address:</span><span class="value">${data.address}${data.address2 ? `, ${data.address2}` : ''}</span></p>
      <p><span class="label">City, State ZIP:</span><span class="value">${data.city}, ${data.state} ${data.zipCode}</span></p>
    </div>
    
    <div class="section">
      <h3>Services Requested</h3>
      <p><span class="value">${servicesText}</span></p>
    </div>
    
    ${
      data.attachments && data.attachments.length > 0
        ? `
    <div class="section">
      <h3>Photos Uploaded</h3>
      <p><span class="value">${data.attachments.length} photo(s) attached to this email:</span></p>
      ${data.attachments
        .map(
          attachment => `
        <div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa;">
          <div style="display: flex; align-items: center;">
            <span style="font-size: 20px; margin-right: 8px;">📎</span>
            <div>
              <strong>${attachment.filename}</strong><br>
              <small style="color: #666;">${attachment.contentType}</small>
            </div>
          </div>
        </div>
      `
        )
        .join('')}
      <p><em>📎 Photos are attached to this email for download.</em></p>
    </div>
    `
        : ''
    }
    
    <div class="section">
      <h3>Error Details</h3>
      <p><span class="label">Error:</span><span class="value">${data.errorMessage || 'Unknown error occurred'}</span></p>
      <p><span class="label">Timestamp:</span><span class="value">${new Date().toLocaleString()}</span></p>
    </div>
    
    <div class="section">
      <h3>Next Steps</h3>
      <ol>
        <li>Call customer at <strong>${data.phone}</strong> to acknowledge their request</li>
        <li>Manually create client and request in Jobber</li>
        <li>Schedule estimate appointment</li>
        <li>Follow up via email at <strong>${data.email}</strong></li>
      </ol>
    </div>
  </div>
  
  <div class="footer">
    <p>Hometown Handyman LLC | (555) 555-0100 | estimates@example.com</p>
    <p>This email was automatically generated by the website form fallback system.</p>
  </div>
</body>
</html>
  `.trim();
}

function generateCustomerConfirmationHTML(data: EmailFallbackData): string {
  const servicesText = formatServicesForEmail(data.services, data.otherRequest);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Estimate Request Received - Hometown Handyman</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #C34B44; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .section { margin-bottom: 20px; }
    .footer { background: #f1f1f1; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #666; }
    .cta { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Estimate Request Received</h1>
    <p>Thank you for choosing Hometown Handyman!</p>
  </div>
  
  <div class="content">
    <p>Hello ${data.firstName},</p>
    
    <p>Thank you for submitting your estimate request! We've received your information and will be in touch within 24 hours to schedule your consultation.</p>
    
    <div class="section">
      <h3>Your Request Summary</h3>
      <p><strong>Services:</strong> ${servicesText}</p>
      <p><strong>Location:</strong> ${data.address}, ${data.city}, ${data.state} ${data.zipCode}</p>
      ${data.attachments && data.attachments.length > 0 ? `<p><strong>Photos:</strong> ${data.attachments.length} image(s) received and attached</p>` : ''}
    </div>
    
    <div class="section">
      <h3>What Happens Next?</h3>
      <ol>
        <li><strong>We'll call you</strong> within 24 hours to discuss your project</li>
        <li><strong>Schedule a consultation</strong> at your convenience</li>
        <li><strong>Provide a detailed estimate</strong> with transparent pricing</li>
        <li><strong>Schedule your project</strong> once approved</li>
      </ol>
    </div>
    
    <div class="section">
      <h3>Questions or Need Immediate Service?</h3>
      <p>Call us directly: <strong><a href="tel:5555550100">(555) 555-0100</a></strong></p>
      <p>Email us: <strong><a href="mailto:estimates@example.com">estimates@example.com</a></strong></p>
    </div>
  </div>
  
  <div class="footer">
    <p>Hometown Handyman LLC</p>
    <p>Serving East Cincinnati neighborhoods with quality craftsmanship</p>
    <p>(555) 555-0100 | estimates@example.com</p>
  </div>
</body>
</html>
  `.trim();
}

async function sendEmailViaResend(
  to: string,
  subject: string,
  html: string,
  replyTo?: string,
  attachments?: EmailAttachment[]
) {
  if (!EMAIL_CONFIG.apiKey) {
    throw new Error('Resend API key not configured');
  }

  const emailPayload: any = {
    from: EMAIL_CONFIG.fromEmail,
    to: [to],
    subject,
    html,
    reply_to: replyTo || EMAIL_CONFIG.replyToEmail,
  };

  // Add attachments if provided
  if (attachments && attachments.length > 0) {
    emailPayload.attachments = attachments.map(attachment => ({
      filename: attachment.filename,
      content: attachment.content,
      content_type: attachment.contentType,
    }));
  }

  console.log('Sending email to Resend:', {
    to,
    subject,
    htmlLength: html.length,
  });

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${EMAIL_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailPayload),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Resend API error:', {
      status: response.status,
      statusText: response.statusText,
      error,
      payload: JSON.stringify(emailPayload, null, 2),
    });
    throw new Error(`Resend API error: ${response.statusText} - ${error}`);
  }

  const result = await response.json();
  console.log('Resend email sent successfully:', result);
  return result;
}

async function sendFallbackEmail(data: EmailFallbackData) {
  const servicesText = formatServicesForEmail(data.services, data.otherRequest);

  // Send notification email to estimates@example.com (with inline images)
  const notificationSubject = `🚨 Form Submission Fallback - ${data.firstName} ${data.lastName} (${servicesText.replace(/\n/g, ' ')})`;
  const notificationHTML = generateEmailHTML(data);

  await sendEmailViaResend(
    EMAIL_CONFIG.recipientEmail,
    notificationSubject,
    notificationHTML,
    data.email, // Reply-to customer
    data.attachments // attachments
  );

  // Send confirmation email to customer (no images needed for confirmation)
  try {
    const confirmationSubject = `Estimate Request Received - Hometown Handyman`;
    const confirmationHTML = generateCustomerConfirmationHTML(data);

    await sendEmailViaResend(
      data.email,
      confirmationSubject,
      confirmationHTML,
      EMAIL_CONFIG.replyToEmail
    );
  } catch (confirmationError) {
    // In sandbox mode, customer confirmation might fail - that's ok
    // The business notification is more important
    console.warn(
      'Customer confirmation email failed (sandbox mode):',
      confirmationError
    );
  }

  return { success: true };
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check (more lenient for backup notifications)
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP, rateLimit.smsNotification); // Reuse SMS rate limit for email fallback

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error:
            'Too many email notification attempts. Please try again later.',
          retryAfter: Math.ceil(
            (rateLimitResult.resetTime - Date.now()) / 1000
          ),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(
              (rateLimitResult.resetTime - Date.now()) / 1000
            ).toString(),
            'X-RateLimit-Limit':
              rateLimit.smsNotification.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    // Parse form data from FormData (same as Jobber endpoint)
    const incomingFormData = await request.formData();

    console.log('=== EMAIL FALLBACK DEBUG ===');
    console.log(
      'FormData entries:',
      Array.from(incomingFormData.entries()).map(([key, value]) => ({
        key,
        type: value instanceof File ? 'File' : 'string',
        value:
          value instanceof File
            ? `${value.name} (${value.size} bytes, ${value.type})`
            : value,
      }))
    );

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
      services: JSON.parse(
        (incomingFormData.get('services') as string) || '[]'
      ),
      otherRequest: (incomingFormData.get('otherRequest') as string) || '',
      errorMessage: incomingFormData.get('errorMessage') as string,
    };

    // Validate form data before sanitization
    const validation = validators.validateFormData(rawData);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid form data', details: validation.errors },
        { status: 400 }
      );
    }

    // Extract and validate photo files (same logic as Jobber endpoint)
    const photos: File[] = [];
    const formDataEntries = Array.from(incomingFormData.entries());

    console.log('Looking for photo files in FormData...');

    for (const [key, value] of formDataEntries) {
      console.log(
        `Processing entry: ${key} = ${value instanceof File ? 'File' : 'string'}`
      );

      if (key.startsWith('photo_') && value instanceof File) {
        console.log(
          `Found photo: ${key} -> ${value.name} (${value.size} bytes, ${value.type})`
        );

        // Validate each file
        const fileValidationResult = fileValidation.validateFile(value);
        if (!fileValidationResult.isValid) {
          console.error(
            `File validation failed for ${value.name}:`,
            fileValidationResult.error
          );
          return NextResponse.json(
            { error: `File validation failed: ${fileValidationResult.error}` },
            { status: 400 }
          );
        }
        photos.push(value);
        console.log(`Successfully added photo: ${value.name}`);
      }
    }

    console.log(`Total photos extracted: ${photos.length}`);

    // Check file count limit
    if (photos.length > fileValidation.maxFiles) {
      return NextResponse.json(
        {
          error: `Too many files. Maximum ${fileValidation.maxFiles} files allowed.`,
        },
        { status: 400 }
      );
    }

    // Validate total attachment size
    const sizeValidation = validateAttachmentSize(photos);
    if (!sizeValidation.isValid) {
      return NextResponse.json(
        { error: sizeValidation.error },
        { status: 400 }
      );
    }

    // Convert photos to email attachments
    let attachments: EmailAttachment[] = [];
    if (photos.length > 0) {
      console.log(`Converting ${photos.length} photos to email attachments...`);
      attachments = await filesToEmailAttachments(photos);
      console.log(
        `Successfully created ${attachments.length} email attachments (total size: ${formatFileSize(sizeValidation.totalSize)})`
      );
    }

    // Sanitize all inputs
    const data: EmailFallbackData = {
      firstName: sanitizers.sanitizeText(rawData.firstName),
      lastName: sanitizers.sanitizeText(rawData.lastName),
      companyName: rawData.companyName
        ? sanitizers.sanitizeText(rawData.companyName)
        : undefined,
      email: sanitizers.sanitizeEmail(rawData.email),
      phone: sanitizers.sanitizePhone(rawData.phone),
      address: sanitizers.sanitizeText(rawData.address),
      address2: rawData.address2
        ? sanitizers.sanitizeText(rawData.address2)
        : undefined,
      city: sanitizers.sanitizeText(rawData.city),
      state: sanitizers.sanitizeText(rawData.state),
      zipCode: sanitizers.sanitizeZipCode(rawData.zipCode),
      services: sanitizers.sanitizeServices(rawData.services),
      otherRequest: rawData.otherRequest
        ? sanitizers.sanitizeText(rawData.otherRequest)
        : undefined,
      photos: photos,
      attachments: attachments,
      errorMessage: rawData.errorMessage
        ? sanitizers.sanitizeText(rawData.errorMessage)
        : undefined,
    };

    // Send fallback emails
    await sendFallbackEmail(data);

    const servicesText = formatServicesForEmail(
      data.services,
      data.otherRequest
    );

    console.log(
      'Email fallback sent successfully for failed form submission:',
      {
        customer: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        email: data.email,
        services: servicesText,
        attachments: data.attachments?.length || 0,
        error: data.errorMessage,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Email fallback sent successfully',
      attachments: data.attachments?.length || 0,
    });
  } catch (error) {
    console.error('Email fallback error:', error);

    return NextResponse.json(
      { error: 'Failed to send email fallback' },
      { status: 500 }
    );
  }
}
