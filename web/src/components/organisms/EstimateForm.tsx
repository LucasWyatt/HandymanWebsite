'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select } from '@/components/atoms/Select';
import {
  ServiceCategoryAccordion,
  ServiceSelection,
} from '@/components/molecules/ServiceCategoryAccordion';
import { PhotoUpload } from '@/components/molecules/PhotoUpload';
import { SuccessDialog } from '@/components/molecules/SuccessDialog';
import { ErrorDialog } from '@/components/molecules/ErrorDialog';
import { HammerAnimation } from '@/components/molecules/HammerAnimation';
import { US_STATES } from '@/lib/location-utils';
import {
  clientSanitizers,
  clientValidators,
  formSecurity,
  clientRateLimit,
} from '@/lib/client-security';

interface PhotoFile {
  id: string;
  file: File;
  preview: string;
  compressed?: boolean;
}

interface FormData {
  // Contact Details
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;

  // Service Details
  services: ServiceSelection[];
  otherRequest: string;

  // Photos
  photos: PhotoFile[];
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  companyName: '',
  email: '',
  phone: '',
  address: '',
  address2: '',
  city: '',
  state: '',
  zipCode: '',
  services: [],
  otherRequest: '',
  photos: [],
};

interface EstimateFormProps {
  className?: string;
}

export const EstimateForm: React.FC<EstimateFormProps> = ({ className }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData | 'services', string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submissionTiming] = useState(() => formSecurity.getSubmissionTiming());

  // Form persistence
  const STORAGE_KEY = 'handyman-estimate-form';

  useEffect(() => {
    // Load saved form data on mount
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedData = JSON.parse(saved);
        const savedFormData = savedData.formData || savedData; // Handle both old and new format
        setFormData(savedFormData);
      }
    } catch (error) {
      console.warn('Failed to load saved form data:', error);
    }
  }, []);

  useEffect(() => {
    // Save form data on changes
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.warn('Failed to save form data:', error);
    }
  }, [formData]);

  const updateFormData = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData(prev => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      setErrors(prev => {
        if (prev[field]) {
          const { [field]: _, ...rest } = prev;
          return rest;
        }
        return prev;
      });
    },
    []
  );

  const handleServicesChange = useCallback(
    (services: ServiceSelection[]) => {
      setFormData(prev => ({ ...prev, services }));

      // Clear error when user makes selection
      if (errors.services) {
        setErrors(prev => ({ ...prev, services: undefined }));
      }
    },
    [errors.services]
  );

  const handleOtherRequestChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, otherRequest: value }));
  }, []);

  const clearFormData = () => {
    setFormData(initialFormData);
    setErrors({});
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const formatPhoneNumber = (value: string) => {
    return clientSanitizers.formatPhoneInput(value);
  };

  const validateForm = (): { isValid: boolean; firstErrorField?: string } => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    let firstErrorField: string | undefined;

    // Contact Details validation - in order of appearance in form
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      if (!firstErrorField) firstErrorField = 'firstName';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      if (!firstErrorField) firstErrorField = 'lastName';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      if (!firstErrorField) firstErrorField = 'email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      if (!firstErrorField) firstErrorField = 'email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      if (!firstErrorField) firstErrorField = 'phone';
    } else if (
      !/^\(\d{3}\)\s\d{3}-\d{4}$/.test(formData.phone) &&
      !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))
    ) {
      newErrors.phone = 'Please enter a valid phone number';
      if (!firstErrorField) firstErrorField = 'phone';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      if (!firstErrorField) firstErrorField = 'address';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
      if (!firstErrorField) firstErrorField = 'city';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
      if (!firstErrorField) firstErrorField = 'zipCode';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    return { isValid, firstErrorField };
  };

  const handleSubmit = async () => {
    // Client-side security checks
    const rateLimitCheck = clientRateLimit.check();
    if (!rateLimitCheck.allowed) {
      setErrorMessage(
        'Too many submission attempts. Please wait before trying again.'
      );
      setShowErrorDialog(true);
      return;
    }

    // Check submission timing (bot detection)
    const elapsed = submissionTiming.getElapsed();
    if (formSecurity.isTooFast(elapsed)) {
      setErrorMessage(
        'Please take a moment to review your information before submitting.'
      );
      setShowErrorDialog(true);
      return;
    }

    const { isValid, firstErrorField } = validateForm();
    if (!isValid) {
      // Focus the first invalid field
      if (firstErrorField) {
        const element = document.querySelector(
          `[name="${firstErrorField}"]`
        ) as HTMLElement;
        if (element) {
          element.focus();
          // Smooth scroll to the element
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setIsSubmitting(true);

    // Increment rate limit counter
    clientRateLimit.increment();

    try {
      // Prepare submission data for Jobber API using FormData for file uploads
      const submitFormData = new FormData();

      // Check honeypot (bot detection)
      if (formSecurity.isHoneypotFilled(submitFormData)) {
        console.warn('Honeypot filled - potential bot detected');
        setErrorMessage('Please try submitting again.');
        setShowErrorDialog(true);
        return;
      }

      // Add all form fields
      submitFormData.append('firstName', formData.firstName);
      submitFormData.append('lastName', formData.lastName);
      submitFormData.append('email', formData.email);
      submitFormData.append('phone', formData.phone);
      submitFormData.append('address', formData.address);
      submitFormData.append('address2', formData.address2);
      submitFormData.append('city', formData.city);
      submitFormData.append('state', formData.state);
      submitFormData.append('zipCode', formData.zipCode);
      submitFormData.append('services', JSON.stringify(formData.services));
      submitFormData.append('otherRequest', formData.otherRequest);
      submitFormData.append('consentToContact', 'true');

      // Add photos
      formData.photos.forEach((photo, index) => {
        submitFormData.append(`photo_${index}`, photo.file);
      });

      // Submit to Jobber API
      const response = await fetch('/api/jobber/submit', {
        method: 'POST',
        body: submitFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit request');
      }

      const result = await response.json();
      console.log('Form submitted successfully:', result);

      // Clear form data
      clearFormData();

      // Show success dialog
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Form submission error:', error);

      // Try to send email fallback to estimates@example.com as backup
      try {
        // Create a new FormData with the same structure as the original submission
        // but send it to the email fallback endpoint instead
        const fallbackFormData = new FormData();

        // Add all form fields (same as original submission)
        fallbackFormData.append('firstName', formData.firstName);
        fallbackFormData.append('lastName', formData.lastName);
        fallbackFormData.append('email', formData.email);
        fallbackFormData.append('phone', formData.phone);
        fallbackFormData.append('address', formData.address);
        fallbackFormData.append('address2', formData.address2);
        fallbackFormData.append('city', formData.city);
        fallbackFormData.append('state', formData.state);
        fallbackFormData.append('zipCode', formData.zipCode);
        fallbackFormData.append('services', JSON.stringify(formData.services));
        fallbackFormData.append('otherRequest', formData.otherRequest);

        // Add company name if provided
        if (formData.companyName) {
          fallbackFormData.append('companyName', formData.companyName);
        }

        // Add the actual photo files (not just metadata)
        console.log(
          `Adding ${formData.photos.length} photos to fallback FormData...`
        );
        formData.photos.forEach((photo, index) => {
          console.log(
            `Adding photo_${index}: ${photo.file.name} (${photo.file.size} bytes, ${photo.file.type})`
          );
          fallbackFormData.append(`photo_${index}`, photo.file);
        });

        // Add error context for the email
        fallbackFormData.append(
          'errorMessage',
          error instanceof Error ? error.message : 'Unknown error'
        );

        // Debug: Log what we're sending
        console.log('Fallback FormData entries:');
        Array.from(fallbackFormData.entries()).forEach(([key, value]) => {
          console.log(
            `  ${key}: ${value instanceof File ? `File(${value.name}, ${value.size}b)` : value}`
          );
        });

        await fetch('/api/email-fallback', {
          method: 'POST',
          body: fallbackFormData, // Send FormData instead of JSON
        });

        console.log('Email fallback sent successfully');

        // Email backup succeeded - clear form and show success
        clearFormData();
        setShowSuccessDialog(true);
      } catch (emailError) {
        console.error('Both Jobber and email fallback failed:', emailError);

        // Both failed - show error dialog for manual contact
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to submit request. Please try again or call us directly at (555) 555-0100.';
        setErrorMessage(message);
        setShowErrorDialog(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContactStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Contact Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name *"
          name="firstName"
          autoComplete="given-name"
          value={formData.firstName}
          onChange={e => updateFormData('firstName', e.target.value)}
          error={errors.firstName}
        />
        <Input
          label="Last Name *"
          name="lastName"
          autoComplete="family-name"
          value={formData.lastName}
          onChange={e => updateFormData('lastName', e.target.value)}
          error={errors.lastName}
        />
      </div>

      <Input
        label="Company Name (if applicable)"
        name="companyName"
        autoComplete="organization"
        value={formData.companyName}
        onChange={e => updateFormData('companyName', e.target.value)}
        error={errors.companyName}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email Address *"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={e => updateFormData('email', e.target.value)}
          error={errors.email}
        />
        <Input
          label="Phone Number *"
          name="phone"
          type="tel"
          autoComplete="tel-national"
          value={formData.phone}
          onChange={e => {
            const formatted = formatPhoneNumber(e.target.value);
            updateFormData('phone', formatted);
          }}
          error={errors.phone}
          placeholder="(555) 555-0100"
        />
      </div>

      <Input
        label="Street Address *"
        name="address"
        autoComplete="street-address"
        value={formData.address}
        onChange={e => updateFormData('address', e.target.value)}
        error={errors.address}
      />

      <Input
        label="Street Address 2 (apt, suite, etc.)"
        name="address2"
        autoComplete="address-line2"
        value={formData.address2}
        onChange={e => updateFormData('address2', e.target.value)}
        error={errors.address2}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          label="City *"
          name="city"
          autoComplete="address-level2"
          value={formData.city}
          onChange={e => updateFormData('city', e.target.value)}
          error={errors.city}
          className="md:col-span-2"
        />
        <Select
          label="State *"
          name="state"
          autoComplete="address-level1"
          options={US_STATES}
          value={formData.state}
          onChange={e => updateFormData('state', e.target.value)}
          error={errors.state}
        />
        <Input
          label="ZIP Code *"
          name="zipCode"
          autoComplete="postal-code"
          value={formData.zipCode}
          onChange={e => updateFormData('zipCode', e.target.value)}
          error={errors.zipCode}
        />
      </div>
    </div>
  );

  const renderProjectStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Service Details</h2>

      <ServiceCategoryAccordion
        selectedServices={formData.services}
        otherRequest={formData.otherRequest}
        onServiceChange={handleServicesChange}
        onOtherRequestChange={handleOtherRequestChange}
      />

      {errors.services && (
        <p className="text-sm text-red-600" role="alert">
          {errors.services}
        </p>
      )}
    </div>
  );

  const renderPhotosStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Photos</h2>
      <p className="text-neutral-600 mb-4">
        Upload photos of the area or work needed. This helps us provide a more
        accurate estimate.
      </p>

      <PhotoUpload
        value={formData.photos}
        onChange={photos => updateFormData('photos', photos)}
        maxFiles={6}
        maxSizePerFile={15}
        helperText="Optional: Upload up to 6 photos to help us understand your project better."
      />
    </div>
  );

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <form
        autoComplete="on"
        className="bg-white rounded-lg shadow-sm border p-6 md:p-8"
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="space-y-8 md:space-y-12">
          {/* Contact Details Section */}
          <div className="border-b border-neutral-200 pb-8">
            {renderContactStep()}
          </div>

          {/* Service Details Section */}
          <div className="border-b border-neutral-200 pb-8">
            {renderProjectStep()}
          </div>

          {/* Photos Section */}
          <div className="border-b border-neutral-200 pb-8">
            {renderPhotosStep()}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center pt-6 space-y-4">
            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              name="website"
              style={{
                position: 'absolute',
                left: '-9999px',
                opacity: 0,
                pointerEvents: 'none',
              }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              variant="cta"
              size="lg"
              className="min-w-[200px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
            <p className="text-sm text-neutral-600 text-center max-w-md">
              By submitting this form, you consent to be contacted by Hometown
              Handyman Home Solutions regarding your estimate request.
            </p>
          </div>
        </div>
      </form>

      {/* Loading Animation */}
      <HammerAnimation
        isVisible={isSubmitting}
        message="Building Your Quote..."
      />

      {/* Dialogs */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
      />

      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        errorMessage={errorMessage}
        formData={formData}
      />
    </div>
  );
};
