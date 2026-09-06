'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface JobberBookingFormProps {
  className?: string;
}

export const JobberBookingForm: React.FC<JobberBookingFormProps> = ({
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold mb-2">Request an Estimate</h2>
          <p className="text-neutral-600">
            Fill out the form below to request a free estimate for your home
            repair project.
          </p>
        </div>

        <div className="relative">
          <iframe
            src="https://clienthub.getjobber.com/booking/f4567248-0550-49a2-817d-830f5b3f92a9"
            width="100%"
            height="800"
            frameBorder="0"
            title="Request Estimate - Hometown Handyman"
            className="w-full"
            loading="lazy"
          />
        </div>

        <div className="p-4 bg-neutral-50 text-sm text-neutral-600">
          <p>
            <strong>Need help?</strong> Call us at{' '}
            <a
              href="tel:+15555550100"
              className="text-blue-600 hover:text-blue-800"
            >
              (555) 555-0100
            </a>{' '}
            if you have any questions about your estimate request.
          </p>
        </div>
      </div>
    </div>
  );
};
