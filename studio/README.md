# Sanity Studio for Hometown Handyman LLC

This directory contains the Sanity v3 studio configuration for managing content on the Hometown Handyman website.

## Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Sanity project ID and dataset
   ```

3. **Start the studio:**
   ```bash
   pnpm dev
   ```

The studio will be available at http://localhost:3333

## Project Setup

To connect this studio to a Sanity project:

1. Create a new project at [sanity.io](https://www.sanity.io/)
2. Copy your project ID and dataset name to `.env.local`
3. Update the `projectId` and `dataset` in `sanity.config.ts`

## Content Schemas

### Core Schemas

- **Site Settings** - Global site configuration (phone, pricing, contact info)
- **Pages** - Static pages with hero sections and rich content
- **Services** - The six core services with pricing and FAQs
- **Neighborhoods** - Service areas with priorities and testimonials
- **FAQs** - Categorized frequently asked questions
- **Gallery Images** - Before/after project photos with details

### Content Structure

The studio is organized with a custom desk structure that groups related content:

- **Site Settings** (singleton)
- **Pages** (multiple documents)
- **Services** (6 core services from PRD)
- **Neighborhoods** (10 East Cincinnati areas)
- **Gallery** (before/after project photos)
- **FAQs** (categorized questions)

## Fixture Data

Initial content is provided in the `fixtures/` directory:

- `services.json` - Six core services (Door & Trim, Drywall & Paint, etc.)
- `neighborhoods.json` - Primary and secondary service areas
- `faqs.json` - Common questions with PRD-compliant answers

To import fixture data:

1. Start the studio (`pnpm dev`)
2. Import data through the studio interface or use Sanity CLI tools

## Key Features

### Service Management

- Featured services for homepage display
- Pricing information (fixed or hourly)
- Service-specific FAQs
- Before/after gallery integration

### Neighborhood Targeting

- Priority levels (primary/secondary/extended)
- ZIP code mapping
- Response time expectations
- Local testimonials

### SEO Optimization

- Custom titles and descriptions per document
- Structured data support
- Image optimization fields

### Content Organization

- Categorized FAQs with priority levels
- Tagged gallery images for filtering
- Sort orders for consistent display

## Development

The studio uses TypeScript and follows Sanity v3 patterns. Schema files are in `schemas/` and imported through `schemas/index.ts`.

For more information, see the [Sanity documentation](https://www.sanity.io/docs).
