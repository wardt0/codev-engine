'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { EditorState } from 'lexical';

interface EditorProps {
  onChange: (editorState: string) => void;
  initialContent?: string;
  placeholder?: string;
  className?: string;
}

export default function Editor({
  onChange,
  initialContent,
  placeholder = 'Start writing...',
  className = '',
}: EditorProps) {
  const initialConfig = {
    namespace: 'CodevEditor',
    theme: {
      root: 'p-4 border-slate-500 border-2 rounded h-auto min-h-[200px] focus:outline-none focus-visible:border-slate-400',
      link: 'cursor-pointer text-blue-600 hover:text-blue-700',
      text: {
        bold: 'font-semibold',
        underline: 'underline',
        italic: 'italic',
        strikethrough: 'line-through',
        underlineStrikethrough: 'underline line-through',
      },
    },
    onError: (error: Error) => {
      console.error('Lexical Editor Error:', error);
    },
    editorState: initialContent,
  };

  const handleChange = (editorState: EditorState) => {
    try {
      const json = editorState.toJSON();
      onChange(JSON.stringify(json));
    } catch (error) {
      console.error('Error serializing editor state:', error);
    }
  };

  return (
    <div className={`lexical-editor ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input outline-none"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="editor-placeholder absolute top-4 left-4 text-slate-400 pointer-events-none select-none">
                    {placeholder}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <OnChangePlugin onChange={handleChange} />
        </div>
      </LexicalComposer>
    </div>
  );
}

