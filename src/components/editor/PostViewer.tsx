'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

interface PostViewerProps {
  content: string;
  className?: string;
}

export default function PostViewer({ content, className = '' }: PostViewerProps) {
  const initialConfig = {
    namespace: 'PostViewer',
    theme: {
      root: 'p-0',
      link: 'text-blue-600 hover:text-blue-700 underline',
      text: {
        bold: 'font-semibold',
        underline: 'underline',
        italic: 'italic',
        strikethrough: 'line-through',
        underlineStrikethrough: 'underline line-through',
      },
      paragraph: 'mb-4',
    },
    editable: false,
    editorState: content,
    onError: (error: Error) => {
      console.error('Lexical Viewer Error:', error);
    },
  };

  return (
    <div className={`lexical-viewer prose prose-slate max-w-none ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="outline-none focus:outline-none" />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </LexicalComposer>
    </div>
  );
}

