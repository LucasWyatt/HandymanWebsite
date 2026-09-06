'use client';

import React, { useState } from 'react';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Textarea } from '@/components/atoms/Textarea';
// Simple chevron icons
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);
import { cn } from '@/lib/utils';

export interface ServiceSelection {
  category: string;
  service: string;
}

interface ServiceCategoryAccordionProps {
  selectedServices: ServiceSelection[];
  otherRequest: string;
  onServiceChange: (services: ServiceSelection[]) => void;
  onOtherRequestChange: (value: string) => void;
  className?: string;
}

const SERVICE_CATEGORIES = {
  'Most Requested': [
    'TV Mounting',
    'Drywall Repair',
    'Faucet Installation',
    'Furniture Assembly'
  ],
  'Carpentry & Doors': [
    'Carpentry & Door Repairs',
    'Window Repairs',
    'Trim Installation & Door Hardware'
  ],
  'Walls & Paint': [
    'Drywall & Ceiling Repair',
    'Interior Painting & Touch-Ups',
    'Exterior Painting & Touch-Ups'
  ],
  'Fixtures & Electrical': [
    'Light Fixture Installation & Replacement',
    'Ceiling Fan Installation & Repair',
    'Outlet & Switch Replacement (including smart switches)'
  ],
  'Media & Smart Home': [
    'TV Mounting & Cable Management',
    'Home Theater & Sound System Setup',
    'Security Camera & Smart Device Installation'
  ],
  'Outdoor Repairs': [
    'Sprinkler & Outdoor Water Repairs',
    'Deck & Fence Repairs',
    'Gutter Cleaning & Power Washing'
  ],
  'General Tasks & Organization': [
    'Furniture & Cabinet Assembly (including IKEA)',
    'Closet & Storage Organization',
    'Art, Mirror & TV Wall Hanging',
    'General Home Repairs & Seasonal Maintenance'
  ]
};

export const ServiceCategoryAccordion: React.FC<ServiceCategoryAccordionProps> = ({
  selectedServices,
  otherRequest,
  onServiceChange,
  onOtherRequestChange,
  className
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Most Requested']) // Most Requested starts expanded
  );
  const [showOtherInput, setShowOtherInput] = useState(false);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleServiceToggle = (category: string, service: string, checked: boolean) => {
    const serviceKey = `${category}|${service}`;
    
    if (checked) {
      // Add service
      const newSelection: ServiceSelection = { category, service };
      onServiceChange([...selectedServices, newSelection]);
    } else {
      // Remove service
      onServiceChange(
        selectedServices.filter(s => !(s.category === category && s.service === service))
      );
    }
  };

  const handleOtherToggle = (checked: boolean) => {
    setShowOtherInput(checked);
    if (!checked) {
      onOtherRequestChange('');
      // Remove "Other" from selected services
      onServiceChange(
        selectedServices.filter(s => s.category !== 'Other')
      );
    } else {
      // Add empty "Other" selection that will be populated when user types
      const otherSelection: ServiceSelection = { category: 'Other', service: 'Custom Request' };
      onServiceChange([...selectedServices, otherSelection]);
    }
  };

  const isServiceSelected = (category: string, service: string): boolean => {
    return selectedServices.some(s => s.category === category && s.service === service);
  };

  const isOtherSelected = (): boolean => {
    return selectedServices.some(s => s.category === 'Other');
  };

  const getCategorySelectionCount = (category: string): number => {
    return selectedServices.filter(s => s.category === category).length;
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          Select the services you&apos;re interested in <span className="text-neutral-500">(optional)</span>
        </label>
        
        {/* Service Categories */}
        <div className="space-y-3">
          {Object.entries(SERVICE_CATEGORIES).map(([category, services]) => {
            const isExpanded = expandedCategories.has(category);
            const selectionCount = getCategorySelectionCount(category);
            
            return (
              <div key={category} className="border border-neutral-200 rounded-lg">
                {/* Category Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDownIcon className="h-5 w-5 text-neutral-500" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5 text-neutral-500" />
                    )}
                    <span className="font-medium text-neutral-900">{category}</span>
                    {selectionCount > 0 && (
                      <span className="bg-brand-100 text-brand-700 px-2 py-1 rounded-full text-xs font-medium">
                        {selectionCount} selected
                      </span>
                    )}
                  </div>
                </button>
                
                {/* Category Services */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-neutral-100">
                    <div className="pt-3 space-y-2">
                      {services.map(service => (
                        <Checkbox
                          key={`${category}-${service}`}
                          label={service}
                          checked={isServiceSelected(category, service)}
                          onChange={e => handleServiceToggle(category, service, e.target.checked)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Other Option */}
          <div className="border border-neutral-200 rounded-lg">
            <div className="p-4">
              <Checkbox
                label="Other (please describe below)"
                checked={isOtherSelected()}
                onChange={e => handleOtherToggle(e.target.checked)}
              />
              
              {showOtherInput && (
                <div className="mt-3 pl-7">
                  <Textarea
                    label="Describe your project"
                    name="otherRequest"
                    value={otherRequest}
                    onChange={e => onOtherRequestChange(e.target.value)}
                    placeholder="Tell us about your specific project needs..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};