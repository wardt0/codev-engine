import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { posts } from '@/db/schema';
import PostViewer from '@/components/editor/PostViewer';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  // Await params in Next.js 15
  const { slug } = await params;
  
  // Fetch post by slug
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1)
    .then((rows) => rows[0]);

  // Handle post not found
  if (!post) {
    notFound();
  }

  // Only show published posts (optional: remove this check to show all posts)
  if (post.status !== 'published' && post.status !== 'draft') {
    notFound();
  }

  // Format date
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-8 border-b border-slate-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            {post.title}
          </h1>
          
          {/* Meta Information */}
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <time dateTime={post.published_at?.toISOString() || post.created_at.toISOString()}>
              {publishedDate}
            </time>
            {post.status === 'draft' && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                Draft
              </span>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-slate prose-lg max-w-none">
          {post.content ? (
            <PostViewer content={JSON.stringify(post.content)} />
          ) : (
            <p className="text-slate-500 italic">No content available.</p>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-200">
          <div className="text-sm text-slate-500">
            Last updated: {new Date(post.updated_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </footer>
      </article>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  // Await params in Next.js 15
  const { slug } = await params;
  
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1)
    .then((rows) => rows[0]);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.featured_image ? [post.featured_image] : [],
    },
  };
}

