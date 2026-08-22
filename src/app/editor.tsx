"use client";
import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import markdownToHtml from 'zenn-markdown-html';
import 'zenn-content-css';
import type EasyMDE from 'easymde';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

const CHECKLIST_ITEMS = [
  '見出し1〜4、太字、斜体、箇条書き、リンクが正しく反映されていますか？',
  '画像は正しく表示されていますか？',
  '表は正しく表示されていますか？',
  '図・表タイトルは正しく反映されていますか？',
  '参考・引用文献は[1]などの表示と文末の文献リストの両方が正しく反映されていますか？',
  '数式・化学式は正しく表示されていますか？',
  'PDFは正しく表示されていますか？',
  'その他自分が意図した表示になっていますか？',
];

const MarkdownEditorWithPreview = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('zenn-embed-elements');
    }
  }, []);
  const [text, setText] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [hasFile, setHasFile] = useState(false);
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [fileName, setFileName] = useState('');
  const [wikiPreview, setWikiPreview] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ issueUrl: string } | { error: string } | null>(null);
  const [checklist, setChecklist] = useState<boolean[]>(Array(CHECKLIST_ITEMS.length).fill(false));
  const allChecked = checklist.every(Boolean);
  const isLocked = !hasFile || !confirmEdit;
  const mdeInstanceRef = useRef<EasyMDE | null>(null);

  const applyLockState = (instance: EasyMDE, locked: boolean) => {
    instance.codemirror.setOption('readOnly', locked);
    const toolbar = instance.codemirror.getWrapperElement().parentElement?.querySelector('.editor-toolbar');
    toolbar?.classList.toggle('disabled-for-preview', locked);
  };

  useEffect(() => {
    if (mdeInstanceRef.current) {
      applyLockState(mdeInstanceRef.current, isLocked);
    }
  }, [isLocked]);

  function unescapeMarkdown(text: string): string {
    return text.replace(/\\([`*_{}\[\]()#+\-\.!=<>\\$])/g, '$1');
  }
  const applyContent = (value: string) => {
    const unescapedText = unescapeMarkdown(value);
    setText(unescapedText);
    const htmlRes = markdownToHtml(unescapedText);
    setHtmlContent(htmlRes);
  };
  const handleChange = (value: string) => {
    applyContent(value);
  };
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.md')) {
      alert('.mdファイルを選択してください');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        applyContent(content);
        setFileName(file.name);
        setHasFile(true);
        setConfirmEdit(false);
        setChecklist(Array(CHECKLIST_ITEMS.length).fill(false));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };
  const handleClick = () => {
    const htmlRes = markdownToHtml(text);
    // Copy the HTML to clipboard
    navigator.clipboard.writeText(htmlRes)
      .then(() => {
        console.log("HTML content copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
      });
  };
  const handleSend = async () => {
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch('/api/github/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, content: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSendResult({ error: data.error || '送信に失敗しました' });
      } else {
        setSendResult({ issueUrl: data.issueUrl });
      }
    } catch {
      setSendResult({ error: '送信に失敗しました' });
    } finally {
      setSending(false);
    }
  };
  return (
    <div className="flex min-h-screen mt-4 flex-col">
      <div className="px-4 pb-2 flex items-center gap-4">
        <label className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          .mdファイルをアップロード
          <input type="file" accept=".md" onChange={handleFileUpload} className="hidden" />
        </label>
        {fileName && (
          <span className="text-sm text-gray-600">読み込み済み: {fileName}</span>
        )}
        <label className={`flex items-center gap-2 text-sm ${!hasFile ? 'text-gray-400' : 'text-gray-700'}`}>
          <input
            type="checkbox"
            checked={confirmEdit}
            disabled={!hasFile}
            onChange={(e) => setConfirmEdit(e.target.checked)}
          />
          .mdファイルの内容を変更する
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={wikiPreview}
            onChange={(e) => setWikiPreview(e.target.checked)}
          />
          Wikiに実装した時のイメージを確認する
        </label>
        {isLocked && (
          <span className="text-sm text-red-500">
            {!hasFile && 'ファイルをアップロードするまでエディタは無効です'}
          </span>
        )}
      </div>
      <div className="flex flex-1">
        <div className={`${wikiPreview ? 'w-[25%]' : 'w-1/2'} pl-[30px] pr-4 py-4 relative`}>
          <SimpleMDE
            value={text}
            onChange={handleChange}
            spellCheck={false}
            getMdeInstance={(instance: EasyMDE) => {
              mdeInstanceRef.current = instance;
              applyLockState(instance, isLocked);
            }}
          />
          {isLocked && (
            <div className="absolute inset-4 top-4 flex items-center justify-center bg-white/60 rounded pointer-events-none">
              <span className="text-gray-500 font-semibold text-center px-4">
                {!hasFile
                  ? '.mdファイルをアップロードしてください'
                  : '「.mdファイルの内容を変更する」にチェックを入れてください'}
              </span>
            </div>
          )}
        </div>
        <div className={`${wikiPreview ? 'w-[75%]' : 'w-1/2'} pl-4 pr-[30px] py-4 bg-gray-100`}>
          <div className="flex justify-end">
            <button
              onClick={handleClick}
              disabled={!hasFile}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
              Copy HTML
            </button>
          </div>
          <div className="mt-4 znc" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </div>
      <div className="px-4 py-2">
        <p className={`text-xl font-semibold mb-2 ${!hasFile ? 'text-gray-400' : 'text-gray-700'}`}>
          提出前チェックリスト(すべてチェックして提出)
        </p>
        <div className="flex flex-col gap-1">
          {CHECKLIST_ITEMS.map((item, index) => (
            <label
              key={item}
              className={`flex items-start gap-2 text-lg ${!hasFile ? 'text-gray-400' : 'text-gray-700'}`}>
              <input
                type="checkbox"
                className="mt-[7.5px]"
                checked={checklist[index]}
                disabled={!hasFile}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setChecklist((prev) => prev.map((v, i) => (i === index ? checked : v)));
                }}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="px-4 py-2 flex items-center gap-2">
        {sendResult && 'issueUrl' in sendResult && (
          <a
            href={sendResult.issueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-700 underline">
            送信しました(Issueを見る)
          </a>
        )}
        {sendResult && 'error' in sendResult && (
          <span className="text-sm text-red-600">{sendResult.error}</span>
        )}
        <button
          onClick={handleSend}
          disabled={!hasFile || !allChecked || sending}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
          {sending ? '送信中...' : '提出'}
        </button>
      </div>
    </div>
  );
};

export default MarkdownEditorWithPreview;
