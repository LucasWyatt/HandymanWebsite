import {getCliClient} from 'sanity/cli'

const client = getCliClient()

async function removePricingFields() {
  console.log('🔍 Looking for site settings documents with pricing fields...')
  
  // Fetch all site settings documents
  const docs = await client.fetch('*[_type == "siteSettings"]')
  
  if (docs.length === 0) {
    console.log('No site settings documents found.')
    return
  }
  
  console.log(`Found ${docs.length} site settings document(s)`)
  
  // Create patches to remove pricing field
  const patches = docs
    .filter(doc => doc.pricing) // Only patch docs that have pricing field
    .map(doc => ({
      id: doc._id,
      patch: {
        unset: ['pricing']
      }
    }))
  
  if (patches.length === 0) {
    console.log('No pricing fields found to remove.')
    return
  }
  
  console.log(`Removing pricing field from ${patches.length} document(s)...`)
  
  // Execute the patches
  const transaction = client.transaction()
  patches.forEach(({id, patch}) => {
    transaction.patch(id, patch)
  })
  
  try {
    await transaction.commit()
    console.log('✅ Successfully removed pricing fields from site settings')
  } catch (error) {
    console.error('❌ Failed to remove pricing fields:', error)
    throw error
  }
}

removePricingFields()
  .then(() => {
    console.log('Migration completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })