"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markdownToSimpleHtml = void 0;
var _markdownIt = _interopRequireDefault(require("markdown-it"));
var _mdLinkAttributes = require("./utils/md-link-attributes");
var _sanitizer = require("./sanitizer");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// preset 'zero' はデフォルトで全ての変換を無効化したプリセットです。
// Ref: https://github.com/markdown-it/markdown-it/blob/master/lib/presets/zero.js
const md = (0, _markdownIt.default)('zero', {
  breaks: true,
  // 改行を<br>に変換する
  linkify: true // URLをリンクに変換する
});
md.enable('emphasis'); // 太字と斜体を有効化
md.enable('link'); // リンクを有効化
md.enable('list'); // リストを有効化
// 改行コードを<br>に変換する（'zero'presetの場合、newlineを有効化する必要がある）
// Ref: https://github.com/markdown-it/markdown-it/issues/491
md.enable('newline');
// linkify を有効化('zero'presetの場合、linkifyを有効化する必要がある)
// Ref: https://github.com/markdown-it/markdown-it/issues/396
md.enable('linkify');

// fuzzyLink - recognize URL-s without http(s):// head. Default true.
// Ref: http://markdown-it.github.io/linkify-it/doc/#LinkifyIt.prototype.set
md.linkify.set({
  fuzzyLink: false
});
md.use(_mdLinkAttributes.mdLinkAttributes);

// 限られた記法のみをHTMLに変換するパーサー
const markdownToSimpleHtml = text => {
  if (!(text && text.length)) return '';
  return (0, _sanitizer.sanitize)(md.render(text));
};
exports.markdownToSimpleHtml = markdownToSimpleHtml;