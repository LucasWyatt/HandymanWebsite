'use client';

// Client-side security utilities (no sensitive data here)

// Input sanitization for frontend
export const clientSanitizers = {
  // Basic text sanitization for display
  sanitizeForDisplay: (input: string): string => {
    if (!input || typeof input !== 'string') return '';

    return input
      .trim()
      .replace(/[<>&"']/g, match => {
        const map: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          "'": '&#x27;',
        };
        return map[match] || match;
      })
      .substring(0, 1000);
  },

  // Phone number formatting
  formatPhoneInput: (value: string): string => {
    if (!value) return '';

    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length >= 10) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    } else if (phoneNumber.length >= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    } else if (phoneNumber.length >= 3) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return phoneNumber;
    }
  },

  // ZIP code formatting
  formatZipInput: (value: string): string => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    return digits.slice(0, 5); // Limit to 5 digits
  },
};

// Client-side validation
export const clientValidators = {
  email: (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  phone: (phone: string): boolean => {
    if (!phone) return false;
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10;
  },

  zipCode: (zip: string): boolean => {
    if (!zip) return false;
    const digits = zip.replace(/\D/g, '');
    return digits.length === 5;
  },

  required: (value: string): boolean => {
    return Boolean(value && value.trim().length > 0);
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },
};

// Form submission protection
export const formSecurity = {
  // Basic honeypot field (hidden from users, bots might fill it)
  createHoneypot: (): HTMLInputElement => {
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website'; // Common field bots try to fill
    honeypot.style.position = 'absolute';
    honeypot.style.left = '-9999px';
    honeypot.style.opacity = '0';
    honeypot.style.pointerEvents = 'none';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    return honeypot;
  },

  // Check if honeypot was filled (potential bot)
  isHoneypotFilled: (formData: FormData): boolean => {
    const honeypotValue = formData.get('website');
    return Boolean(honeypotValue && honeypotValue !== '');
  },

  // Add timestamp to detect too-fast submissions
  getSubmissionTiming: (): { startTime: number; getElapsed: () => number } => {
    const startTime = Date.now();
    return {
      startTime,
      getElapsed: () => Date.now() - startTime,
    };
  },

  // Check for suspiciously fast submission (potential bot)
  isTooFast: (elapsedMs: number): boolean => {
    // Require at least 3 seconds to fill out form
    return elapsedMs < 3000;
  },
};

// Rate limiting on client side (localStorage based)
export const clientRateLimit = {
  key: 'hometown-handyman_form_submissions',
  maxSubmissions: 3,
  windowMs: 60 * 60 * 1000, // 1 hour

  check: (): { allowed: boolean; remaining: number; resetTime: number } => {
    try {
      const stored = localStorage.getItem(clientRateLimit.key);
      const now = Date.now();

      if (!stored) {
        const data = { count: 0, windowStart: now };
        localStorage.setItem(clientRateLimit.key, JSON.stringify(data));
        return {
          allowed: true,
          remaining: clientRateLimit.maxSubmissions - 1,
          resetTime: now + clientRateLimit.windowMs,
        };
      }

      const data = JSON.parse(stored);

      // Reset window if expired
      if (now - data.windowStart > clientRateLimit.windowMs) {
        const newData = { count: 0, windowStart: now };
        localStorage.setItem(clientRateLimit.key, JSON.stringify(newData));
        return {
          allowed: true,
          remaining: clientRateLimit.maxSubmissions - 1,
          resetTime: now + clientRateLimit.windowMs,
        };
      }

      // Check if limit exceeded
      if (data.count >= clientRateLimit.maxSubmissions) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: data.windowStart + clientRateLimit.windowMs,
        };
      }

      return {
        allowed: true,
        remaining: clientRateLimit.maxSubmissions - data.count - 1,
        resetTime: data.windowStart + clientRateLimit.windowMs,
      };
    } catch (error) {
      console.warn('Client rate limit check failed:', error);
      return {
        allowed: true,
        remaining: clientRateLimit.maxSubmissions,
        resetTime: Date.now() + clientRateLimit.windowMs,
      };
    }
  },

  increment: (): void => {
    try {
      const stored = localStorage.getItem(clientRateLimit.key);
      if (stored) {
        const data = JSON.parse(stored);
        data.count += 1;
        localStorage.setItem(clientRateLimit.key, JSON.stringify(data));
      }
    } catch (error) {
      console.warn('Client rate limit increment failed:', error);
    }
  },
};

// Content Security Policy helpers
export const csp = {
  // Create nonce for inline scripts (if needed)
  generateNonce: (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)));
  },

  // Validate external resources
  isAllowedDomain: (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const allowedDomains = [
        'example.com',
        'example.com',
        'vercel.app',
        'api.jobber.com',
      ];
      return allowedDomains.some(
        domain =>
          urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
      );
    } catch {
      return false;
    }
  },
};
