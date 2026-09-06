import { NextRequest } from 'next/server';

// Input sanitization utilities
export const sanitizers = {
  // Remove HTML tags and encode special characters
  sanitizeText: (input: string): string => {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>&"']/g, (match) => { // Encode dangerous characters
        const map: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          "'": '&#x27;'
        };
        return map[match] || match;
      })
      .substring(0, 1000); // Limit length
  },

  // Sanitize email addresses
  sanitizeEmail: (email: string): string => {
    if (!email || typeof email !== 'string') return '';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = email.trim().toLowerCase().substring(0, 254);
    
    return emailRegex.test(sanitized) ? sanitized : '';
  },

  // Sanitize phone numbers
  sanitizePhone: (phone: string): string => {
    if (!phone || typeof phone !== 'string') return '';
    
    // Remove all non-digits and format
    const digits = phone.replace(/\D/g, '');
    
    // US phone numbers only (10 digits)
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      // Handle +1 country code
      const usDigits = digits.slice(1);
      return `(${usDigits.slice(0, 3)}) ${usDigits.slice(3, 6)}-${usDigits.slice(6)}`;
    }
    
    return '';
  },

  // Sanitize ZIP codes
  sanitizeZipCode: (zip: string): string => {
    if (!zip || typeof zip !== 'string') return '';
    
    const digits = zip.replace(/\D/g, '');
    return digits.length === 5 ? digits : '';
  },

  // Sanitize service type arrays
  sanitizeServiceTypes: (types: unknown): string[] => {
    if (!Array.isArray(types)) return [];
    
    const validTypes = [
      'general-repairs',
      'property-management', 
      'kitchen-remodel',
      'bathroom-remodel',
      'basement-finishing',
      'whole-home-renovation',
      'additions-extensions',
      'other'
    ];
    
    return types
      .filter((type): type is string => typeof type === 'string')
      .filter(type => validTypes.includes(type))
      .slice(0, 8); // Max 8 selections
  },

  // Sanitize service selection arrays (new structured format)
  sanitizeServices: (services: unknown): Array<{category: string, service: string}> => {
    if (!Array.isArray(services)) return [];
    
    const validCategories = [
      'Most Requested',
      'Carpentry & Doors',
      'Walls & Paint', 
      'Fixtures & Electrical',
      'Media & Smart Home',
      'Outdoor Repairs',
      'General Tasks & Organization',
      'Other'
    ];
    
    return services
      .filter((item): item is {category: string, service: string} => 
        typeof item === 'object' && 
        item !== null &&
        typeof item.category === 'string' &&
        typeof item.service === 'string'
      )
      .filter(item => validCategories.includes(item.category))
      .map(item => ({
        category: sanitizers.sanitizeText(item.category),
        service: sanitizers.sanitizeText(item.service)
      }))
      .slice(0, 15); // Max 15 service selections
  }
};

// Rate limiting (in-memory for simplicity, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export const rateLimit = {
  // Form submissions: 5 per hour
  formSubmission: { windowMs: 60 * 60 * 1000, maxRequests: 5 },
  // SMS notifications: 10 per hour (more lenient for backup)
  smsNotification: { windowMs: 60 * 60 * 1000, maxRequests: 10 }
};

export function checkRateLimit(
  identifier: string, 
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = `${identifier}:${Math.floor(now / config.windowMs)}`;
  
  const current = rateLimitStore.get(key);
  const resetTime = Math.ceil(now / config.windowMs) * config.windowMs;
  
  if (!current) {
    rateLimitStore.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime };
  }
  
  if (current.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime };
  }
  
  current.count++;
  return { 
    allowed: true, 
    remaining: config.maxRequests - current.count, 
    resetTime 
  };
}

// Get client IP address
export function getClientIP(request: NextRequest): string {
  // Check for forwarded IP from proxy/CDN
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  // Check other common headers
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;
  
  const clientIP = request.headers.get('x-client-ip');
  if (clientIP) return clientIP;
  
  // Fallback (may not work in all environments)
  return 'unknown';
}

// Content validation
export const validators = {
  // Check for suspicious patterns that might indicate spam/abuse
  containsSuspiciousContent: (text: string): boolean => {
    if (!text || typeof text !== 'string') return false;
    
    const suspiciousPatterns = [
      /https?:\/\/[^\s]+/gi, // URLs (basic check)
      /\b(?:viagra|cialis|pharmacy|casino|poker|lottery|winner|congratulations)\b/gi,
      /\b(?:bitcoin|crypto|investment|make money|earn \$)/gi,
      /\b(?:click here|visit now|act now|limited time)/gi,
      /(.)\1{10,}/gi, // Repeated characters (more than 10)
      /^.{0,1}$/gi // Suspiciously short content (only flag single character or empty)
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(text));
  },

  // Validate required fields are present and reasonable
  validateFormData: (data: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Required field validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
      if (!data[field] || typeof data[field] !== 'string' || data[field].trim().length === 0) {
        errors.push(`${field} is required`);
      }
    }
    
    // Email validation
    if (data.email && !sanitizers.sanitizeEmail(data.email)) {
      errors.push('Invalid email format');
    }
    
    // Phone validation
    if (data.phone && !sanitizers.sanitizePhone(data.phone)) {
      errors.push('Invalid phone number format');
    }
    
    // ZIP validation
    if (data.zipCode && !sanitizers.sanitizeZipCode(data.zipCode)) {
      errors.push('Invalid ZIP code format');
    }
    
    // Content safety check
    const textFields = ['firstName', 'lastName', 'companyName', 'address', 'city'];
    for (const field of textFields) {
      if (data[field] && validators.containsSuspiciousContent(data[field])) {
        errors.push(`Suspicious content detected in ${field}`);
      }
    }
    
    return { isValid: errors.length === 0, errors };
  }
};

// CSRF protection helpers
export function generateCSRFToken(): string {
  // Generate a secure random token
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// File upload security
export const fileValidation = {
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxSize: 15 * 1024 * 1024, // 15MB
  maxFiles: 6,
  
  validateFile: (file: File): { isValid: boolean; error?: string } => {
    if (!fileValidation.allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' };
    }
    
    if (file.size > fileValidation.maxSize) {
      return { isValid: false, error: 'File size too large. Maximum 15MB per file.' };
    }
    
    // Basic filename validation
    if (!/^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
      return { isValid: false, error: 'Invalid filename format.' };
    }
    
    return { isValid: true };
  }
};

// Clean up old rate limit entries (call periodically)
export function cleanupRateLimit(): void {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  for (const [key, value] of entries) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}