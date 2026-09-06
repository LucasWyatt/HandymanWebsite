const { createClient } = require('@sanity/client');

const client = createClient({
  projectId:
    process.env.SANITY_STUDIO_PROJECT_ID ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    'your-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function testConnection() {
  try {
    console.log('🔍 Testing Sanity connection...');

    // Test basic connection
    const projects = await client.request({ uri: '/projects' });
    console.log('✅ Connection successful!');

    // Test permissions by creating a simple test document
    console.log('🧪 Testing create permissions...');
    const testDoc = {
      _type: 'siteSettings',
      _id: 'siteSettings',
      title: 'Test Site Settings',
    };

    const result = await client.createOrReplace(testDoc);
    console.log('✅ Create permissions work!');
    console.log('📄 Created document:', result._id);
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);

    if (error.statusCode === 401) {
      console.log('\n🔑 Authentication failed - check your token');
    } else if (error.statusCode === 403) {
      console.log('\n🚫 Permission denied - token needs more permissions');
    } else {
      console.log('\n🐛 Full error:', error);
    }
  }
}

testConnection();
