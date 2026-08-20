"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.embedKeys = exports.embedGenerators = void 0;
var _utils = require("markdown-it/lib/common/utils");
var _urlMatcher = require("./utils/url-matcher");
var _embedHelper = require("./utils/embed-helper");
/* 埋め込み要素の種別 */

/** embedサーバーで表示する埋め込み要素の種別 */

/** 埋め込み要素のHTMLを生成する関数 */

/** 埋め込み要素のHTMLを生成する関数をまとめたオブジェクト */
const embedGenerators = exports.embedGenerators = {
  youtube(str) {
    const params = (0, _urlMatcher.extractYoutubeVideoParameters)(str) || {
      videoId: str
    };
    if (!params.videoId.match(/^[a-zA-Z0-9_-]+$/)) {
      return 'YouTubeのvideoIDが不正です';
    }
    const escapedVideoId = (0, _utils.escapeHtml)(params.videoId);
    const time = Math.min(Number(params.start || 0), 48 * 60 * 60); // 48時間以内
    const startQuery = time ? `?start=${time}` : '';
    return `<span class="embed-block embed-youtube"><iframe src="https://www.youtube-nocookie.com/embed/${escapedVideoId}${startQuery}" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></span>`;
  },
  slideshare(key) {
    if (!(key !== null && key !== void 0 && key.match(/^[a-zA-Z0-9_-]+$/))) {
      return 'Slide Shareのkeyが不正です';
    }
    return `<span class="embed-block embed-slideshare"><iframe src="https://www.slideshare.net/slideshow/embed_code/key/${(0, _utils.escapeHtml)(key)}" scrolling="no" allowfullscreen loading="lazy"></iframe></span>`;
  },
  speakerdeck(key) {
    if (!(key !== null && key !== void 0 && key.match(/^[a-zA-Z0-9_-]+$/))) {
      return 'Speaker Deckのkeyが不正です';
    }
    return `<span class="embed-block embed-speakerdeck"><iframe src="https://speakerdeck.com/player/${(0, _utils.escapeHtml)(key)}" scrolling="no" allowfullscreen allow="encrypted-media" loading="lazy"></iframe></span>`;
  },
  jsfiddle(str) {
    if (!(0, _urlMatcher.isJsfiddleUrl)(str)) {
      return 'jsfiddleのURLが不正です';
    }
    // URLを~/embedded/とする
    // ※ すでにembeddedもしくはembedが含まれるURLが入力されている場合は、そのままURLを使用する。
    let url = str;
    if (!url.includes('embed')) {
      url = url.endsWith('/') ? `${url}embedded/` : `${url}/embedded/`;
    }
    return `<span class="embed-block embed-jsfiddle"><iframe src="${(0, _embedHelper.sanitizeEmbedToken)(url)}" scrolling="no" frameborder="no" loading="lazy"></iframe></span>`;
  },
  codepen(str) {
    if (!(0, _urlMatcher.isCodepenUrl)(str)) {
      return 'CodePenのURLが不正です';
    }
    const url = new URL(str.replace('/pen/', '/embed/'));
    url.searchParams.set('embed-version', '2');
    return `<span class="embed-block embed-codepen"><iframe src="${(0, _embedHelper.sanitizeEmbedToken)(url.toString())}" scrolling="no" frameborder="no" loading="lazy"></iframe></span>`;
  },
  codesandbox(str) {
    if (!(0, _urlMatcher.isCodesandboxUrl)(str)) {
      return '「https://codesandbox.io/embed/」から始まる正しいURLを入力してください';
    }
    return `<span class="embed-block embed-codesandbox"><iframe src="${(0, _embedHelper.sanitizeEmbedToken)(str)}" style="width:100%;height:500px;border:none;overflow:hidden;" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" loading="lazy" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></span>`;
  },
  stackblitz(str) {
    if (!(0, _urlMatcher.isStackblitzUrl)(str)) {
      return 'StackBlitzのembed用のURLを指定してください';
    }
    return `<span class="embed-block embed-stackblitz"><iframe src="${(0, _embedHelper.sanitizeEmbedToken)(str)}" scrolling="no" frameborder="no" loading="lazy"></iframe></span>`;
  },
  blueprintue(str) {
    if (!(0, _urlMatcher.isBlueprintUEUrl)(str)) return '「https://blueprintue.com/render/」から始まる正しいURLを指定してください';
    return `<span class="embed-block embed-blueprintue"><iframe src="${(0, _embedHelper.sanitizeEmbedToken)(str)}" width="100%" style="aspect-ratio: 16/9" scrolling="no" frameborder="no" loading="lazy" allowfullscreen></iframe></span>`;
  },
  figma(str) {
    if (!(0, _urlMatcher.isFigmaUrl)(str)) return 'ファイルまたはプロトタイプのFigma URLを指定してください';
    return `<span class="embed-block embed-figma"><iframe src="https://www.figma.com/embed?embed_host=zenn&url=${(0, _embedHelper.sanitizeEmbedToken)(str)}" width="100%" style="aspect-ratio: 16/9" scrolling="no" frameborder="no" loading="lazy" allowfullscreen></iframe></span>`;
  },
  // 以下は埋め込みサーバーが絡む要素。
  // embedOrigin が指定されていれば埋め込みサーバーを iframe で表示、
  // なければデフォルトの挙動(リンクの表示など)を行います。

  card(str, options) {
    if (!(0, _urlMatcher.isValidHttpUrl)(str)) return 'URLが不正です';
    if (options !== null && options !== void 0 && options.embedOrigin) return (0, _embedHelper.generateEmbedServerIframe)('card', str, options.embedOrigin);
    return `<a href="${str}" rel="noreferrer noopener nofollow" target="_blank">${str}</a>`;
  },
  tweet(str, options) {
    if (!(0, _urlMatcher.isTweetUrl)(str)) return 'ツイートページのURLを指定してください';
    if (options !== null && options !== void 0 && options.embedOrigin) return (0, _embedHelper.generateEmbedServerIframe)('tweet', str, options.embedOrigin);
    return `<a href="${str}" rel="noreferrer noopener nofollow" target="_blank">${str}</a>`;
  },
  gist(str, options) {
    /**
     * gistのURL は
     * - https://gist.github.com/foo/bar.json
     * - https://gist.github.com/foo/bar.json?file=example.js
     * のような形式
     */
    if (!(0, _urlMatcher.isGistUrl)(str)) return 'GitHub GistのページURLを指定してください';
    if (options !== null && options !== void 0 && options.embedOrigin) return (0, _embedHelper.generateEmbedServerIframe)('gist', str, options.embedOrigin);
    return `<a href="${str}" rel="noreferrer noopener nofollow" target="_blank">${str}</a>`;
  },
  github(str, options) {
    if (!(0, _urlMatcher.isGithubUrl)(str)) return 'GitHub のファイルURLまたはパーマリンクを指定してください';
    if (options !== null && options !== void 0 && options.embedOrigin) return (0, _embedHelper.generateEmbedServerIframe)('github', str, options.embedOrigin);
    return `<a href="${str}" rel="noreferrer noopener nofollow" target="_blank">${str}</a>`;
  },
  mermaid(str, options) {
    if (options !== null && options !== void 0 && options.embedOrigin) return (0, _embedHelper.generateEmbedServerIframe)('mermaid', str, options.embedOrigin);

    // エスケープ処理しておく
    const src = str.replace(/>/g, '&gt;');

    // ブラウザじゃないと mermaid はレンダリングできないので、Node.jsで描画するときはコードブロックのまま出力する
    return `<div class="code-block-container"><pre><code>${src}</code></pre></div>`;
  }
};

/** 埋め込み要素の種別配列 */
const embedKeys = exports.embedKeys = Object.keys(embedGenerators);