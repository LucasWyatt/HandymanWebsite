// Sanity GROQ queries for fetching data from CMS

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  title,
  description,
  contactInfo {
    phone,
    email,
    estimatesEmail,
    address {
      street,
      city,
      state,
      zipCode
    }
  },
  businessHours {
    weekdays,
    saturday,
    sunday,
    emergencyAvailable
  },
  trustChips,
  homePageSettings {
    heroHeadline,
    heroSubheadline,
    heroBackgroundImage,
    featuredServicesCount
  },
  seoSettings {
    defaultTitle,
    titleSuffix,
    ogImage
  },
  serviceAreas {
    primaryAreas,
    secondaryAreas,
    notServedNote
  },
  socialMedia {
    googleBusinessProfile,
    facebook,
    nextdoor
  },
  legalSettings {
    licenseNumber,
    insuranceInfo,
    warrantyTerms
  }
}`;

export const SERVICES_QUERY = `*[_type == "service" && published == true] | order(sortOrder asc, title asc) {
  _id,
  title,
  shortDescription,
  slug,
  featuredImage,
  featured,
  seoTitle,
  seoDescription
}`;

export const SERVICE_BY_SLUG_QUERY = `*[_type == "service" && slug.current == $slug && published == true][0] {
  _id,
  title,
  shortDescription,
  introduction,
  slug,
  featuredImage,
  typicalProblems,
  secondaryImage,
  ourApproach,
  faqs,
  gallery[]-> {
    _id,
    title,
    image,
    description
  },
  internalLinks[] {
    anchorText,
    description,
    service-> {
      _id,
      title,
      shortDescription,
      slug
    }
  },
  seoTitle,
  seoDescription
}`;

export const NEIGHBORHOODS_QUERY = `*[_type == "neighborhood" && active == true] | order(sortOrder asc, priority asc, name asc) {
  _id,
  name,
  slug,
  zipCodes,
  priority,
  description,
  averageResponseTime,
  serviceRadius,
  landmarks,
  testimonials[] {
    customerName,
    review,
    rating,
    serviceProvided,
    date
  },
  specialNotes,
  coordinates {
    lat,
    lng
  },
  sortOrder
}`;

export const GALLERY_QUERY = `*[_type == "galleryImage" && published == true] | order(featured desc, sortOrder asc, completionDate desc) {
  _id,
  title,
  beforeImage,
  afterImage,
  caption,
  service-> {
    title,
    slug
  },
  neighborhood-> {
    name,
    slug
  },
  projectDetails {
    duration,
    materials,
    challenges,
    customerSatisfaction
  },
  technicalDetails {
    workPerformed,
    tools,
    warranty
  },
  seoAlt,
  featured,
  showOnHomepage,
  completionDate,
  tags,
  sortOrder
}`;

export const FAQS_QUERY = `*[_type == "faq" && published == true] | order(priority asc, sortOrder asc, question asc) {
  _id,
  question,
  answer,
  category,
  tags,
  relatedServices[]-> {
    title,
    slug
  },
  priority,
  showOnHomepage,
  lastUpdated,
  sortOrder
}`;

export const PAGES_QUERY = `*[_type == "page" && published == true] {
  _id,
  title,
  slug,
  seoTitle,
  seoDescription,
  hero {
    headline,
    subheadline,
    backgroundImage,
    ctaText,
    ctaLink
  },
  content,
  contentSections[] {
    sectionTitle,
    content
  },
  showInNavigation
}`;

export const PAGE_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug && (published == true || !defined(published))][0] {
  _id,
  title,
  slug,
  seoTitle,
  seoDescription,
  hero {
    headline,
    subheadline,
    backgroundImage,
    ctaText,
    ctaLink
  },
  content,
  contentSections[] {
    sectionTitle,
    content
  },
  showInNavigation,
  published
}`;

export const TESTIMONIALS_QUERY = `*[_type == "testimonial" && published == true && permissionGranted == true] | order(featured desc, rating desc, projectDate desc) {
  _id,
  customerName,
  customerInitials,
  useInitialsOnly,
  review,
  rating,
  service-> {
    title,
    slug
  },
  neighborhood-> {
    name,
    slug
  },
  projectValue,
  projectDate,
  source,
  featured,
  showOnHomepage,
  showOnServicePage,
  tags,
  highlights,
  customerPhoto
}`;

export const HOMEPAGE_TESTIMONIALS_QUERY = `*[_type == "testimonial" && published == true && permissionGranted == true && showOnHomepage == true] | order(featured desc, rating desc, projectDate desc) [0...6] {
  _id,
  customerName,
  customerInitials,
  useInitialsOnly,
  review,
  rating,
  service-> {
    title,
    slug {
      current
    }
  },
  neighborhood-> {
    name,
    slug {
      current
    }
  },
  projectDate,
  highlights,
  customerPhoto
}`;

export const FOOTER_SERVICES_QUERY = `*[_type == "service" && published == true] | order(sortOrder asc, title asc) [0...8] {
  _id,
  title,
  seoTitle,
  slug
}`;

export const FOOTER_NEIGHBORHOODS_QUERY = `*[_type == "neighborhood" && active == true && showInFooter == true] | order(priority asc, sortOrder asc, name asc) [0...10] {
  _id,
  name,
  slug
}`;
