// Jobber GraphQL Types
export interface JobberClient {
  id: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email?: string; // For backward compatibility
  phone?: string; // For backward compatibility
  emails?: {
    address: string;
  }[];
  phones?: {
    number: string;
  }[];
}

export interface JobberProperty {
  address?: {
    street1: string;
    street2?: string;
    city: string;
    province?: string; // Jobber uses "province" not "state"
    postalCode: string; // Jobber uses "postalCode" not "zipCode"
  };
}

export interface JobberRequest {
  id: string;
  number: string;
  title?: string;
  description?: string;
  client?: JobberClient;
  property?: JobberProperty;
}

// GraphQL Input Types
export interface ClientCreateInput {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  emails?: {
    address: string;
    description: string;
    primary: boolean;
  }[];
  phones?: {
    number: string;
    description: string;
  }[];
  billingAddress?: {
    street1: string;
    street2?: string;
    city: string;
    province?: string;
    postalCode: string;
  };
}

export interface RequestCreateInput {
  clientId: string;
  title?: string;
  propertyId?: string;
  assessment?: any; // AssessmentCreateInput - complex type, keeping as any for now
  referringClientId?: string;
  requestDetails?: {
    form: any; // Complex form structure, keeping as any for now
  };
}

// GraphQL Response Types
export interface UserError {
  message: string;
  path: string[];
}

export interface ClientCreateResponse {
  clientCreate: {
    client?: JobberClient;
    userErrors: UserError[];
  };
}

export interface RequestCreateResponse {
  requestCreate: {
    request?: JobberRequest;
    userErrors: UserError[];
  };
}

export interface ClientQueryResponse {
  clients: {
    nodes: JobberClient[];
  };
}

// Service Selection Types
export interface ServiceSelection {
  category: string;
  service: string;
}

// Form Data Interface
export interface FormSubmissionData {
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
  consentToContact: boolean;
}