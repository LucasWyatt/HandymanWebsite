import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body._type) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })
    }

    const documentType = body._type

    switch (documentType) {
      case 'siteSettings':
        revalidateTag('site-settings')
        revalidatePath('/')
        break
      case 'page':
        revalidateTag('pages')
        revalidatePath('/')
        break
      case 'service':
        revalidateTag('services')
        revalidatePath('/services')
        break
      case 'neighborhood':
        revalidateTag('neighborhoods')
        revalidatePath('/service-area')
        break
      case 'galleryImage':
        revalidateTag('gallery')
        revalidatePath('/gallery')
        break
      case 'faq':
        revalidateTag('faqs')
        revalidatePath('/faqs')
        break
      default:
        revalidatePath('/')
        break
    }

    console.log(`Revalidated content for type: ${documentType}`)

    return NextResponse.json({ 
      message: 'Webhook processed successfully',
      type: documentType,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    )
  }
}