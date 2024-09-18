"use client";
import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';
import { SetStateAction, useState } from 'react';
import markdownToHtml from 'zenn-markdown-html';
import 'zenn-content-css';
import { useEffect } from 'react';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

const MarkdownEditorWithPreview = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('zenn-embed-elements');
    }
  }, []);  
  const [text, setText] = useState('');

  const handleChange = (value: SetStateAction<string>) => {
    setText(value);
  };
  const htmlRes = markdownToHtml(text);
  return (
    <div className="flex min-h-screen mt-4">
      <div className="w-1/2 p-4">
        <SimpleMDE value={text} onChange={handleChange} spellCheck={false} />
      </div>
      <div className="w-1/2 p-4 bg-gray-100">
        <div className="znc" dangerouslySetInnerHTML={{ __html: htmlRes }} />
      </div>
    </div>
  );
};

export default MarkdownEditorWithPreview;