import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, type } = body

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    switch (type) {
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

    return NextResponse.json({ 
      message: 'Revalidation successful',
      type,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    )
  }
}