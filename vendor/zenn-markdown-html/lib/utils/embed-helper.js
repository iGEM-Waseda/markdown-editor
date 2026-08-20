"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateEmbedHTML = void 0;
exports.generateEmbedServerIframe = generateEmbedServerIframe;
exports.generateLinkifyEmbedHTML = void 0;
exports.isEmbedType = isEmbedType;
exports.sanitizeEmbedToken = sanitizeEmbedToken;
exports.validateEmbedToken = void 0;
var _embed = require("../embed");
var _urlMatcher = require("./url-matcher");
/** 渡された文字列をサニタイズする */
function sanitizeEmbedToken(str) {
  return str.replace(/"/g, '%22');
}

/** `EmbedType`か判定する */
function isEmbedType(type) {
  return _embed.embedKeys.includes(type);
}

/** 渡された埋め込みURLまたはTokenを検証する */
const validateEmbedToken = (str, type) => {
  /** 検証から除外する埋め込みの種別 */
  const ignoredEmbedType = ['card', 'github'];
  /** 埋め込みURLまたはTokenの最大文字数( excludeEmbedTypeは除く ) */
  const MAX_EMBED_TOKEN_LENGTH = 300;
  if (ignoredEmbedType.includes(type)) {
    return {
      isValid: true,
      message: ''
    };
  }
  if (str.length > MAX_EMBED_TOKEN_LENGTH) {
    return {
      isValid: false,
      message: `埋め込みURLは${MAX_EMBED_TOKEN_LENGTH}文字以内にする必要があります`
    };
  }
  return {
    isValid: true,
    message: ''
  };
};

/** Embedサーバーを使った埋め込み要素の文字列を生成する */
exports.validateEmbedToken = validateEmbedToken;
function generateEmbedServerIframe(type, src, embedOrigin) {
  const origin = (() => {
    try {
      return new URL(embedOrigin).origin;
    } catch {
      return void 0;
    }
  })();

  // 埋め込みサーバーの origin が設定されてなければ空文字列を返す
  if (!origin) {
    console.warn('The embedOrigin option not set');
    return '';
  }

  // ユーザーからの入力値が引数として渡されたときのために念のためencodeする
  const encodedType = encodeURIComponent(type);
  const encodedSrc = encodeURIComponent(src);
  const id = `zenn-embedded__${Math.random().toString(16).slice(2)}`;
  const iframeSrc = `${origin}/${encodedType}#${id}`;
  return `<span class="embed-block zenn-embedded zenn-embedded-${encodedType}"><iframe id="${id}" src="${iframeSrc}" data-content="${encodedSrc}" frameborder="0" scrolling="no" loading="lazy"></iframe></span>`;
}

/** 渡された`type`の埋め込み要素のHTML文字列を返す */
const generateEmbedHTML = (type, str, options) => {
  var _options$customEmbed;
  const {
    isValid,
    message
  } = validateEmbedToken(str, type);
  const generator = options === null || options === void 0 || (_options$customEmbed = options.customEmbed) === null || _options$customEmbed === void 0 ? void 0 : _options$customEmbed[type];
  return isValid ? (generator === null || generator === void 0 ? void 0 : generator(str, options)) || str : message;
};

/** Linkifyな埋め込み要素のHTML生成する */
exports.generateEmbedHTML = generateEmbedHTML;
const generateLinkifyEmbedHTML = (url, options) => {
  var _generators$tweet, _generators$youtube, _generators$github, _generators$card;
  const {
    isValid,
    message: msg
  } = validateEmbedToken(url);
  const generators = options === null || options === void 0 ? void 0 : options.customEmbed;
  if (!generators) return url;
  if ((0, _urlMatcher.isTweetUrl)(url)) return isValid ? ((_generators$tweet = generators.tweet) === null || _generators$tweet === void 0 ? void 0 : _generators$tweet.call(generators, url, options)) || url : msg;
  if ((0, _urlMatcher.isYoutubeUrl)(url)) return isValid ? ((_generators$youtube = generators.youtube) === null || _generators$youtube === void 0 ? void 0 : _generators$youtube.call(generators, url, options)) || url : msg;

  // GitHub は URL が長くなりやすいためバリデーション(`validateEmbedToken`)から外す
  if ((0, _urlMatcher.isGithubUrl)(url)) return ((_generators$github = generators.github) === null || _generators$github === void 0 ? void 0 : _generators$github.call(generators, url, options)) || url;
  return ((_generators$card = generators.card) === null || _generators$card === void 0 ? void 0 : _generators$card.call(generators, url, options)) || url;
};
exports.generateLinkifyEmbedHTML = generateLinkifyEmbedHTML;