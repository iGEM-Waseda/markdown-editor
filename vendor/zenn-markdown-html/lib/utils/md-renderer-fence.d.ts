import MarkdownIt from 'markdown-it';
import { MarkdownOptions } from '../types';
export declare function parseInfo(str: string): {
    hasDiff: boolean;
    langName: string;
    fileName?: string;
};
export declare function mdRendererFence(md: MarkdownIt, options?: MarkdownOptions): void;
