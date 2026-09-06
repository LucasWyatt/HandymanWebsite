'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from '@/components/atoms/Dialog';
import { Button } from '@/components/atoms/Button';

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessDialog: React.FC<SuccessDialogProps> = ({
  isOpen,
  onClose
}) => {
  const router = useRouter();

  const handleGoHome = () => {
    onClose();
    router.push('/');
  };

  const handleClose = () => {
    onClose();
    router.push('/');
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <div className="text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          Request Submitted Successfully!
        </h3>

        {/* Message */}
        <p className="text-neutral-600 mb-6">
          Thank you! Your estimate request has been submitted. We&apos;ll contact you within 24 hours to discuss your project.
        </p>

        {/* Actions */}
        <div className="flex flex-col space-y-3">
          <Button
            onClick={handleGoHome}
            size="lg"
            className="w-full"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </Dialog>
  );
};