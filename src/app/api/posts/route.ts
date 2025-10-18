import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/db/schema';
import { createClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
    // Get current authenticated user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug from title (lowercase, replace spaces with hyphens, remove special chars)
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Insert new post with author_id
    const newPost = await db
      .insert(posts)
      .values({
        title,
        slug,
        content: JSON.parse(content), // Store as JSONB
        authorId: user.id, // Track the author
        status: 'draft',
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newPost[0],
      message: 'Post saved successfully!',
    });
  } catch (error) {
    console.error('Error creating post:', error);
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

