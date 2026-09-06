const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Create Sanity client
const client = createClient({
  projectId:
    process.env.SANITY_STUDIO_PROJECT_ID ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    'your-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // You'll need to set this
  useCdn: false,
});

async function importFixtures() {
  console.log('🚀 Starting fixture import...\n');

  try {
    // Import services
    const services = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../fixtures/services.json'), 'utf8')
    );
    console.log('📦 Importing services...');
    for (const service of services) {
      await client.createOrReplace(service);
      console.log(`  ✓ ${service.title}`);
    }

    // Import neighborhoods
    const neighborhoods = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../fixtures/neighborhoods.json'),
        'utf8'
      )
    );
    console.log('\n🏘️  Importing neighborhoods...');
    for (const neighborhood of neighborhoods) {
      await client.createOrReplace(neighborhood);
      console.log(`  ✓ ${neighborhood.name}`);
    }

    // Import FAQs
    const faqs = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../fixtures/faqs.json'), 'utf8')
    );
    console.log('\n❓ Importing FAQs...');
    for (const faq of faqs) {
      await client.createOrReplace(faq);
      console.log(`  ✓ ${faq.question.substring(0, 50)}...`);
    }

    console.log('\n✅ All fixtures imported successfully!');
    console.log(
      '\n🎉 You can now view the content in your Sanity Studio at http://localhost:3333'
    );
  } catch (error) {
    console.error('❌ Import failed:', error.message);

    if (
      error.message.includes('token') ||
      error.message.includes('permissions')
    ) {
      console.log('\n💡 Token permission issue detected.');
      console.log('   1. Go to https://sanity.io/manage');
      console.log('   2. Select your project');
      console.log('   3. Go to API > Tokens');
      console.log(
        '   4. Create a NEW token with "Admin" or "Editor" permissions'
      );
      console.log('   5. Make sure "Write" permission is enabled');
      console.log('   6. Update your .env.local file with the new token');
      console.log('   7. Try running the import again');
    }
  }
}

importFixtures();
