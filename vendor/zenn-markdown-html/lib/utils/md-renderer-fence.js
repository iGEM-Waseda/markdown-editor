"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mdRendererFence = mdRendererFence;
exports.parseInfo = parseInfo;
var _utils = require("markdown-it/lib/common/utils");
var _highlight = require("./highlight");
function getHtml({
  content,
  className,
  fileName
}) {
  const escapedClass = (0, _utils.escapeHtml)(className);
  return `<div class="code-block-container">${fileName ? `<div class="code-block-filename-container"><span class="code-block-filename">${(0, _utils.escapeHtml)(fileName)}</span></div>` : ''}<pre class="${escapedClass}"><code class="${escapedClass}">${content}</code></pre></div>`;
}
function getClassName({
  langName = '',
  hasDiff
}) {
  const isSafe = /^[\w-]{0,30}$/.test(langName);
  if (!isSafe) return '';
  if (hasDiff) {
    return `diff-highlight ${langName.length ? `language-diff-${langName}` : ''}`;
  }
  return langName ? `language-${langName}` : '';
}
const fallbackLanguages = {
  vue: 'html',
  react: 'jsx',
  fish: 'shell',
  sh: 'shell',
  cwl: 'yaml',
  tf: 'hcl' // ref: https://github.com/PrismJS/prism/issues/1252
};
function normalizeLangName(str) {
  if (!(str !== null && str !== void 0 && str.length)) return '';
  const langName = str.toLocaleLowerCase();
  return fallbackLanguages[langName] ?? langName;
}
function parseInfo(str) {
  if (str.trim() === '') {
    return {
      langName: '',
      fileName: undefined,
      hasDiff: false
    };
  }

  // e.g. foo:filename => ["foo", "filename"]
  // e.g. foo diff:filename => ["foo diff", "filename"]
  const [langInfo, fileName] = str.split(':');
  const langNames = langInfo.split(' ');
  const hasDiff = langNames.some(name => name === 'diff');
  const langName = hasDiff ? langNames.find(lang => lang !== 'diff') : langNames[0];
  return {
    langName: normalizeLangName(langName),
    fileName,
    hasDiff
  };
}
function mdRendererFence(md, options) {
  // override fence
  md.renderer.rules.fence = function (...args) {
    const [tokens, idx] = args;
    const {
      info,
      content
    } = tokens[idx];
    const {
      langName,
      fileName,
      hasDiff
    } = parseInfo(info);
    if (langName === 'mermaid') {
      var _options$customEmbed;
      const generator = options === null || options === void 0 || (_options$customEmbed = options.customEmbed) === null || _options$customEmbed === void 0 ? void 0 : _options$customEmbed.mermaid;
      // generator が(上書きされて)定義されてない場合はそのまま出力する
      return generator ? generator(content.trim(), options) : content;
    }
    const className = getClassName({
      langName,
      hasDiff
    });
    const highlightedContent = (0, _highlight.highlight)(content, langName, hasDiff);
    return getHtml({
      content: highlightedContent,
      className,
      fileName
    });
  };
}