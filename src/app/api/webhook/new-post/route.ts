import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { posts } from '@/db/schema';

interface WebhookPostBody {
  title: string;
  content: object;
  excerpt?: string;
  featured_image?: string;
  status?: 'draft' | 'published';
  author_id?: string; // Optional: for automated posts from n8n
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body: WebhookPostBody = await request.json();

    // Validate required fields
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Title is required and must be a string' },
        { status: 400 }
      );
    }

    if (!body.content || typeof body.content !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Content is required and must be an object' },
        { status: 400 }
      );
    }

    // Validate optional fields
    if (body.excerpt && typeof body.excerpt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Excerpt must be a string' },
        { status: 400 }
      );
    }

    if (body.featured_image && typeof body.featured_image !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Featured image must be a string' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Check if slug already exists and make it unique
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1)
      .then((rows) => rows[0]);

    let uniqueSlug = slug;
    if (existingPost) {
      // Add timestamp to make slug unique
      const timestamp = Date.now();
      uniqueSlug = `${slug}-${timestamp}`;
    }

    // Insert new post into database
    const newPost = await db
      .insert(posts)
      .values({
        title: body.title,
        slug: uniqueSlug,
        content: body.content,
        excerpt: body.excerpt || null,
        featured_image: body.featured_image || null,
        authorId: body.author_id || null, // Optional for automated posts
        status: body.status || 'draft',
        published_at: body.status === 'published' ? new Date() : null,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Post created successfully',
        data: newPost[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Webhook error:', error);

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body',
        },
        { status: 400 }
      );
    }

    // Handle database errors
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create post',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

