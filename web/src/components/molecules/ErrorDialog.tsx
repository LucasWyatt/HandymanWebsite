'use client';

import React from 'react';
import { Dialog } from '@/components/atoms/Dialog';
import { Button } from '@/components/atoms/Button';
import { TextButton } from '@/components/atoms/TextButton';

interface ServiceSelection {
  category: string;
  service: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  services: ServiceSelection[];
  otherRequest?: string;
}

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage?: string;
  formData?: FormData;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  isOpen,
  onClose,
  errorMessage,
  formData
}) => {
  const formatSMSMessage = (data?: FormData): string => {
    if (!data) return 'Hi, I need help with an estimate request for home repair services.';
    
    let services = 'General repairs';
    if (data.services.length > 0) {
      const grouped = data.services.reduce((acc, service) => {
        if (!acc[service.category]) {
          acc[service.category] = [];
        }
        acc[service.category].push(service.service);
        return acc;
      }, {} as Record<string, string[]>);
      
      const serviceList = Object.entries(grouped).map(([category, serviceNames]) => 
        `${category}: ${serviceNames.join(', ')}`
      );
      services = serviceList.join('; ');
      
      if (data.otherRequest) {
        services += `; Other: ${data.otherRequest}`;
      }
    }
    
    return `Hi, I need an estimate for ${services}. My info: ${data.firstName} ${data.lastName}, ${data.phone}, ${data.address}, ${data.city}, ${data.state} ${data.zipCode}. The online form had an issue submitting.`;
  };
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        {/* Error Icon */}
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          Submission Failed
        </h3>

        {/* Error Message */}
        <p className="text-neutral-600 mb-6">
          Our system encountered an issue. Submit your request directly via text message instead.
        </p>

        {/* Actions */}
        <div className="flex flex-col space-y-3">
          <TextButton
            size="lg"
            className="w-full"
            message={formatSMSMessage(formData)}
          >
            Submit via Text Message
          </TextButton>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Try Again
          </Button>
        </div>
      </div>
    </Dialog>
  );
};