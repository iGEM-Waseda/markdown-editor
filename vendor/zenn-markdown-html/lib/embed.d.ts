import type { MarkdownOptions } from './types';
export type EmbedType = 'youtube' | 'slideshare' | 'speakerdeck' | 'jsfiddle' | 'codepen' | 'codesandbox' | 'stackblitz' | 'tweet' | 'blueprintue' | 'figma' | 'card' | 'gist' | 'github' | 'mermaid';
/** embedサーバーで表示する埋め込み要素の種別 */
export type EmbedServerType = Extract<EmbedType, 'tweet' | 'card' | 'mermaid' | 'github' | 'gist'>;
/** 埋め込み要素のHTMLを生成する関数 */
export type EmbedGenerator = (str: string, options?: MarkdownOptions) => string;
export type EmbedGeneratorList = Record<EmbedType, EmbedGenerator>;
/** 埋め込み要素のHTMLを生成する関数をまとめたオブジェクト */
export declare const embedGenerators: Readonly<EmbedGeneratorList>;
/** 埋め込み要素の種別配列 */
export declare const embedKeys: EmbedType[];
