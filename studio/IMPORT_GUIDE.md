# Fixture Data Import Guide

There are several ways to import the fixture data into your Sanity studio:

## Method 1: Automated Import (Recommended)

1. **Get a Sanity API token:**
   - Go to [sanity.io/manage](https://sanity.io/manage)
   - Select your project (`your-project-id`)
   - Go to API > Tokens
   - Create a token with "Editor" permissions
   - Copy the token

2. **Add the token to your environment:**

   ```bash
   # Add this line to studio/.env.local
   SANITY_API_TOKEN="your-token-here"
   ```

3. **Install the Sanity client and run import:**
   ```bash
   cd studio
   pnpm install
   pnpm import-fixtures
   ```

This will automatically import all services, neighborhoods, and FAQs.

## Method 2: Manual Import Through Studio

1. **Open the studio** at http://localhost:3333
2. **For each content type**, click the "+" button to create new documents
3. **Copy data from fixture files:**
   - Services: Copy from `fixtures/services.json`
   - Neighborhoods: Copy from `fixtures/neighborhoods.json`
   - FAQs: Copy from `fixtures/faqs.json`

## Method 3: Sanity CLI Import

1. **Install Sanity CLI globally:**

   ```bash
   npm install -g @sanity/cli
   ```

2. **Login to Sanity:**

   ```bash
   sanity login
   ```

3. **Convert and import data:**
   ```bash
   cd studio
   node scripts/import-fixtures.js  # Creates NDJSON files
   sanity dataset import import/services.ndjson production
   sanity dataset import import/neighborhoods.ndjson production
   sanity dataset import import/faqs.ndjson production
   ```

## What Gets Imported

### Services (6 items)

- ✅ Door & Trim Carpentry (Featured)
- ✅ Drywall & Paint Repair (Featured)
- ✅ Fixture Installations (Featured)
- ✅ Tile & Caulk Repair
- ✅ Deck & Fence Repair
- ✅ Bathroom Refresh

### Neighborhoods (10 items)

**Primary Service Areas:**

- ✅ Hyde Park (45208)
- ✅ Indian Hill (45243)
- ✅ Terrace Park (45174)

**Secondary Service Areas:**

- ✅ Mount Lookout (45208)
- ✅ Oakley (45209)
- ✅ Columbia-Tusculum (45226)
- ✅ Mariemont (45227)
- ✅ Madeira (45243)
- ✅ Mount Adams (45202)
- ✅ Walnut Hills (45206)

### FAQs (10 items)

- ✅ Service areas and coverage
- ✅ Pricing and minimum fees
- ✅ Warranty information
- ✅ Scheduling and availability
- ✅ Materials and supplies
- ✅ Payment methods
- ✅ Insurance and licensing
- ✅ Permits and contractors
- ✅ Estimate costs
- ✅ Cleanup procedures

## Troubleshooting

- **"Project not found"**: Make sure your `SANITY_STUDIO_PROJECT_ID` is correct in `.env.local`
- **"Unauthorized"**: You need a valid `SANITY_API_TOKEN` with write permissions
- **Studio won't load**: Try refreshing the browser or restarting the dev server

After importing, refresh your studio at http://localhost:3333 to see all the content!
