import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/db/schema';

export async function GET() {
  try {
    // Insert a demo post
    const demoPost = await db
      .insert(posts)
      .values({
        title: 'Hello World',
        slug: 'hello-world',
        content: {
          root: {
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Welcome to Codev Media! This is a sample blog post created to demonstrate the CMS functionality.',
                    type: 'text',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
              },
              {
                children: [
                  {
                    detail: 0,
                    format: 1,
                    mode: 'normal',
                    style: '',
                    text: 'This is a bold statement',
                    type: 'text',
                    version: 1,
                  },
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: ' and this is ',
                    type: 'text',
                    version: 1,
                  },
                  {
                    detail: 0,
                    format: 2,
                    mode: 'normal',
                    style: '',
                    text: 'italic text',
                    type: 'text',
                    version: 1,
                  },
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: '. You can create rich content with the Lexical editor!',
                    type: 'text',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
              },
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Start creating your own posts by visiting the admin panel at /admin/posts/new',
                    type: 'text',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'root',
            version: 1,
          },
        },
        excerpt: 'A sample blog post to get you started with Codev Media CMS.',
        status: 'published',
        published_at: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Demo post created successfully!',
      data: demoPost[0],
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed database',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

