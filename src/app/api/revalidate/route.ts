import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

// Webhook secret for security (should match backend)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret-here';

// Verify webhook signature
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Webhook event types
interface WebhookEvent {
  type: 'product.created' | 'product.updated' | 'product.deleted' | 
        'category.created' | 'category.updated' | 'category.deleted' |
        'order.created' | 'order.updated' | 'order.deleted';
  data: {
    id: string | number;
    slug?: string;
    category_id?: number;
    category_slug?: string;
  };
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-webhook-signature');
    
    // Verify webhook signature
    if (!signature || !verifySignature(body, signature, WEBHOOK_SECRET)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event: WebhookEvent = JSON.parse(body);
    console.log('Webhook received:', event.type, event.data);

    // Handle different event types
    switch (event.type) {
      case 'product.created':
      case 'product.updated':
        await handleProductChange(event);
        break;
        
      case 'product.deleted':
        await handleProductDeletion(event);
        break;
        
      case 'category.created':
      case 'category.updated':
        await handleCategoryChange(event);
        break;
        
      case 'category.deleted':
        await handleCategoryDeletion();
        break;
        
      case 'order.created':
      case 'order.updated':
        await handleOrderChange();
        break;
        
      default:
        console.log('Unknown event type:', event.type);
        return NextResponse.json({ error: 'Unknown event type' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Cache invalidated for ${event.type}`,
      revalidated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Handle product changes
async function handleProductChange(event: WebhookEvent) {
  const { slug, category_id } = event.data;
  
  // Revalidate specific product page
  if (slug) {
    revalidatePath(`/product/${slug}`);
    console.log(`Revalidated product page: /product/${slug}`);
  }
  
  // Revalidate home page (featured/top products)
  revalidatePath('/');
  console.log('Revalidated home page');
  
  // Revalidate category page if category_id provided
  if (category_id) {
    // We need to get the category slug from the backend or cache
    // For now, we'll revalidate all category pages
    revalidatePath('/category/[slug]', 'page');
    console.log('Revalidated category pages');
  }
  
  // Revalidate search page
  revalidatePath('/search');
  console.log('Revalidated search page');
}

// Handle product deletion
async function handleProductDeletion(_event: WebhookEvent) {
  const { category_id } = _event.data;
  
  // Revalidate home page
  revalidatePath('/');
  console.log('Revalidated home page after product deletion');
  
  // Revalidate category page if category_id provided
  if (category_id) {
    revalidatePath('/category/[slug]', 'page');
    console.log('Revalidated category pages after product deletion');
  }
  
  // Revalidate search page
  revalidatePath('/search');
  console.log('Revalidated search page after product deletion');
}

// Handle category changes
async function handleCategoryChange(event: WebhookEvent) {
  const { slug } = event.data;
  
  // Revalidate specific category page
  if (slug) {
    revalidatePath(`/category/${slug}`);
    console.log(`Revalidated category page: /category/${slug}`);
  }
  
  // Revalidate all category pages
  revalidatePath('/category/[slug]', 'page');
  console.log('Revalidated all category pages');
  
  // Revalidate home page (category showcase)
  revalidatePath('/');
  console.log('Revalidated home page');
}

// Handle category deletion
async function handleCategoryDeletion() {
  // Revalidate all category pages
  revalidatePath('/category/[slug]', 'page');
  console.log('Revalidated all category pages after category deletion');
  
  // Revalidate home page
  revalidatePath('/');
  console.log('Revalidated home page after category deletion');
}

// Handle order changes (usually doesn't affect public pages, but good to have)
async function handleOrderChange() {
  // Orders typically don't affect public page content
  // But we might want to revalidate admin/dashboard pages
  console.log('Order change detected, no public pages to revalidate');
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Revalidation webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
