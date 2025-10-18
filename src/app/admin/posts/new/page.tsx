'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@/components/editor/Editor';

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: 'success' | 'error' | null;
  }>({ message: '', type: null });

  const handleEditorChange = (editorState: string) => {
    setContent(editorState);
  };

  const handleSaveDraft = async () => {
    // Validation
    if (!title.trim()) {
      setFeedback({
        message: 'Please enter a title',
        type: 'error',
      });
      return;
    }

    if (!content) {
      setFeedback({
        message: 'Please add some content',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    setFeedback({ message: '', type: null });

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFeedback({
          message: 'Post saved! 🎉',
          type: 'success',
        });
        
        // Reset form after successful save
        setTimeout(() => {
          setTitle('');
          setContent('');
          setFeedback({ message: '', type: null });
        }, 2000);
      } else {
        setFeedback({
          message: data.error || 'Failed to save post',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error saving post:', error);
      setFeedback({
        message: 'An error occurred while saving',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create New Post
          </h1>
          <p className="text-slate-600">
            Add a new post to your Codev Media CMS
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          {/* Title Input */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Post Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Content Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Content
            </label>
            <Editor
              onChange={handleEditorChange}
              placeholder="Start writing your post content..."
            />
          </div>

          {/* Feedback Message */}
          {feedback.type && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                feedback.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-4 text-sm text-slate-500">
          <p>
            💡 Tip: Your post will be saved as a draft. The slug will be
            automatically generated from the title.
          </p>
        </div>
      </div>
    </div>
  );
}

