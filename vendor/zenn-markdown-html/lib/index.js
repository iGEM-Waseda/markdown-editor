"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "markdownToSimpleHtml", {
  enumerable: true,
  get: function () {
    return _markdownToSimpleHtml.markdownToSimpleHtml;
  }
});
var _markdownIt = _interopRequireDefault(require("markdown-it"));
var _embed = require("./embed");
var _markdownItImsize = _interopRequireDefault(require("@steelydylan/markdown-it-imsize"));
var _markdownItAnchor = _interopRequireDefault(require("markdown-it-anchor"));
var _mdBr = require("./utils/md-br");
var _mdKatex = require("./utils/md-katex");
var _mdCustomBlock = require("./utils/md-custom-block");
var _mdLinkAttributes = require("./utils/md-link-attributes");
var _mdLinkifyToCard = require("./utils/md-linkify-to-card");
var _mdRendererFence = require("./utils/md-renderer-fence");
var _mdContainer = require("./utils/md-container");
var _markdownToSimpleHtml = require("./markdown-to-simple-html");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// plugis

const mdContainer = require('markdown-it-container');
const mdFootnote = require('markdown-it-footnote');
const mdTaskLists = require('markdown-it-task-lists');
const mdInlineComments = require('markdown-it-inline-comments');
const markdownToHtml = (text, options) => {
  if (!(text && text.length)) return '';
  const markdownOptions = {
    ...options,
    customEmbed: {
      ..._embed.embedGenerators,
      ...(options === null || options === void 0 ? void 0 : options.customEmbed)
    }
  };
  const md = (0, _markdownIt.default)({
    breaks: true,
    linkify: true,
    html: true
  });
  md.linkify.set({
    fuzzyLink: false
  });
  md.use(_mdBr.mdBr).use(_mdKatex.mdKatex).use(mdFootnote).use(mdInlineComments).use(_markdownItImsize.default).use(_mdLinkAttributes.mdLinkAttributes).use(_mdCustomBlock.mdCustomBlock, markdownOptions).use(_mdRendererFence.mdRendererFence, markdownOptions).use(_mdLinkifyToCard.mdLinkifyToCard, markdownOptions).use(mdTaskLists, {
    enabled: true
  }).use(mdContainer, 'details', _mdContainer.containerDetailsOptions).use(mdContainer, 'message', _mdContainer.containerMessageOptions).use(mdContainer, 'c', _mdContainer.containerCOptions).use(mdContainer, 'left', _mdContainer.containerLeftOptions).use(mdContainer, 'right', _mdContainer.containerRightOptions).use(_markdownItAnchor.default, {
    level: [1, 2, 3, 4],
    permalink: _markdownItAnchor.default.permalink.ariaHidden({
      placement: 'before',
      class: 'header-anchor-link',
      symbol: ''
    }),
    tabIndex: false
  });

  // custom footnote
  md.renderer.rules.footnote_block_open = () => '<h1 id="references"><a class="header-anchor-link" href="#references" aria-hidden="true"></a> References</h1>\n' + '<section class="footnotes">\n' + '<ol class="footnotes-list">\n';
  md.renderer.rules.footnote_caption = (tokens, idx, options, env, slf) => {
    var n = Number(tokens[idx].meta.id + 1).toString();
    return '[' + n + ']';
  };

  // docIdは複数のコメントが1ページに指定されたときに脚注のリンク先が重複しないように指定する
  // 1ページの中で重複しなければ問題ないため、ごく短いランダムな文字列とする
  // - https://github.com/zenn-dev/zenn-community/issues/356
  // - https://github.com/markdown-it/markdown-it-footnote/pull/8
  // const docId = crypto.randomBytes(2).toString('hex');
  return md.render(text);
};
var _default = exports.default = markdownToHtml;