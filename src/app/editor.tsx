"use client";
import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import markdownToHtml from 'zenn-markdown-html';
import 'zenn-content-css';
import type EasyMDE from 'easymde';
import { ROOT_DIRS } from '@/lib/wiki';

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
  const [authorName, setAuthorName] = useState('');
  const [comment, setComment] = useState('');
  const [level1, setLevel1] = useState('');
  const [level2, setLevel2] = useState('');
  const [level3, setLevel3] = useState('');
  const [level2Options, setLevel2Options] = useState<string[] | null>(null);
  const [level3Options, setLevel3Options] = useState<string[] | null>(null);
  const [dirLoading, setDirLoading] = useState(false);
  const [dirError, setDirError] = useState('');
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

  const fetchSubdirs = async (path: string): Promise<string[]> => {
    const res = await fetch(`/api/github/list-dirs?path=${encodeURIComponent(path)}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'ディレクトリ一覧の取得に失敗しました');
    }
    return data.directories as string[];
  };
  const handleLevel1Change = async (value: string) => {
    setLevel1(value);
    setLevel2('');
    setLevel2Options(null);
    setLevel3('');
    setLevel3Options(null);
    setDirError('');
    if (!value) return;
    setDirLoading(true);
    try {
      setLevel2Options(await fetchSubdirs(value));
    } catch (err) {
      setDirError(err instanceof Error ? err.message : 'ディレクトリ一覧の取得に失敗しました');
    } finally {
      setDirLoading(false);
    }
  };
  const handleLevel2Change = async (value: string) => {
    setLevel2(value);
    setLevel3('');
    setLevel3Options(null);
    setDirError('');
    if (!value) return;
    setDirLoading(true);
    try {
      setLevel3Options(await fetchSubdirs(`${level1}/${value}`));
    } catch (err) {
      setDirError(err instanceof Error ? err.message : 'ディレクトリ一覧の取得に失敗しました');
    } finally {
      setDirLoading(false);
    }
  };
  const level1HasNoSubdirs = level2Options !== null && level2Options.length === 0;
  const level2HasNoSubdirs = level3Options !== null && level3Options.length === 0;
  const targetDir = [level1, level2, level3].filter(Boolean).join('/');
  const targetDirReady =
    level1 !== '' &&
    (level1HasNoSubdirs || (level2 !== '' && (level2HasNoSubdirs || level3 !== '')));

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
        setAuthorName('');
        setComment('');
        setLevel1('');
        setLevel2('');
        setLevel3('');
        setLevel2Options(null);
        setLevel3Options(null);
        setDirError('');
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
        body: JSON.stringify({ fileName, content: text, authorName, targetDir, comment }),
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
      <div className="px-4 py-2">
        <p className={`text-sm font-semibold mb-2 ${!hasFile ? 'text-gray-400' : 'text-gray-700'}`}>
          提出先
        </p>
        <div className="flex items-center gap-2">
          <select
            value={level1}
            disabled={!hasFile}
            onChange={(e) => handleLevel1Change(e.target.value)}
            className="border rounded px-2 py-1 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed">
            <option value="">選択してください</option>
            {ROOT_DIRS.map((dir) => (
              <option key={dir} value={dir}>
                {dir}
              </option>
            ))}
          </select>
          {level1 !== '' && !level1HasNoSubdirs && (
            <select
              value={level2}
              disabled={level2Options === null}
              onChange={(e) => handleLevel2Change(e.target.value)}
              className="border rounded px-2 py-1 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed">
              <option value="">選択してください</option>
              {(level2Options ?? []).map((dir) => (
                <option key={dir} value={dir}>
                  {dir}
                </option>
              ))}
            </select>
          )}
          {level2 !== '' && !level2HasNoSubdirs && (
            <select
              value={level3}
              disabled={level3Options === null}
              onChange={(e) => setLevel3(e.target.value)}
              className="border rounded px-2 py-1 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed">
              <option value="">選択してください</option>
              {(level3Options ?? []).map((dir) => (
                <option key={dir} value={dir}>
                  {dir}
                </option>
              ))}
            </select>
          )}
          {dirLoading && <span className="text-sm text-gray-500">読み込み中...</span>}
        </div>
        {dirError && <p className="text-sm text-red-600 mt-1">{dirError}</p>}
        {targetDirReady && (
          <p className="text-sm text-gray-600 mt-1">提出先: {targetDir}</p>
        )}
      </div>
      <div className="px-4 py-2">
        <label className={`flex items-center gap-2 text-sm ${!hasFile ? 'text-gray-400' : 'text-gray-700'}`}>
          執筆責任者の名前:
          <input
            type="text"
            value={authorName}
            disabled={!hasFile}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="例: 山田太郎"
            className="border rounded px-2 py-1 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </label>
      </div>
      <div className="px-4 py-2">
        <label className={`flex flex-col gap-1 text-sm ${!hasFile ? 'text-gray-400' : 'text-gray-700'}`}>
          コメント(任意):
          <textarea
            value={comment}
            disabled={!hasFile}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Web作成者への申し送り事項があれば入力してください"
            rows={3}
            className="border rounded px-2 py-1 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </label>
      </div>
      <div className="px-4 py-2 flex items-center gap-2">
        <button
          onClick={handleSend}
          disabled={!hasFile || !allChecked || !authorName.trim() || !targetDirReady || sending}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
          {sending ? '送信中...' : '提出'}
        </button>
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
        
      </div>
    </div>
  );
};

export default MarkdownEditorWithPreview;
