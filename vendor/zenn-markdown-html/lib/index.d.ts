import { MarkdownOptions } from './types';
declare const markdownToHtml: (text: string, options?: MarkdownOptions) => string;
export default markdownToHtml;
export { markdownToSimpleHtml } from './markdown-to-simple-html';
