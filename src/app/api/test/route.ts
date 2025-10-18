import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/db/schema';

export async function GET() {
  try {
    const allPosts = await db.select().from(posts);
    
    return NextResponse.json({
      success: true,
      data: allPosts,
      count: allPosts.length,
    });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch posts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

