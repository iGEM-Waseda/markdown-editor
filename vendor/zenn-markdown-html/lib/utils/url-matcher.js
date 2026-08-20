"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractYoutubeVideoParameters = extractYoutubeVideoParameters;
exports.isBlueprintUEUrl = isBlueprintUEUrl;
exports.isCodepenUrl = isCodepenUrl;
exports.isCodesandboxUrl = isCodesandboxUrl;
exports.isFigmaUrl = isFigmaUrl;
exports.isGistUrl = isGistUrl;
exports.isGithubUrl = isGithubUrl;
exports.isJsfiddleUrl = isJsfiddleUrl;
exports.isStackblitzUrl = isStackblitzUrl;
exports.isTweetUrl = isTweetUrl;
exports.isValidHttpUrl = isValidHttpUrl;
exports.isYoutubeUrl = isYoutubeUrl;
/** URL文字列か判定する */
function isValidHttpUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}
function isGithubUrl(url) {
  return /^https:\/\/github\.com\/([a-zA-Z0-9](-?[a-zA-Z0-9]){0,38})\/([a-zA-Z0-9](-?[a-zA-Z0-9._]){0,99})\/blob\/[^~\s:?[*^/\\]{2,}\/[\w!\-_~.*%()'"/]+(?:#L\d+(?:-L\d+)?)?$/.test(url);
}

// Thanks: https://github.com/forem/forem/blob/d2d9984f28b1d0662f2a858b325a0e6b7a27a24c/app/liquid_tags/gist_tag.rb
function isGistUrl(url) {
  return /^https:\/\/gist\.github\.com\/([a-zA-Z0-9](-?[a-zA-Z0-9]){0,38})\/([a-zA-Z0-9]){1,32}(\/[a-zA-Z0-9]+)?(\?file=.+)?$/.test(url);
}
function isTweetUrl(url) {
  return /^https:\/\/(twitter|x)\.com\/[a-zA-Z0-9_-]+\/status\/[a-zA-Z0-9?=&\-_]+$/.test(url);
}
function isStackblitzUrl(url) {
  return /^https:\/\/stackblitz\.com\/[a-zA-Z0-9\-_/.@?&=%[\]]+$/.test(url);
}
function isCodesandboxUrl(url) {
  return /^https:\/\/codesandbox\.io\/embed\/[a-zA-Z0-9\-_/.@?&=%,+]+$/.test(url);
}
function isCodepenUrl(url) {
  return /^https:\/\/codepen\.io\/[a-zA-Z0-9\-_/@]+\/pen\/[a-zA-Z0-9\-_/.@?&=%,]+$/.test(url);
}
function isJsfiddleUrl(url) {
  return /^(http|https):\/\/jsfiddle\.net\/[a-zA-Z0-9_,/-]+$/.test(url);
}
function isYoutubeUrl(url) {
  return [/^https?:\/\/youtu\.be\/[\w-]+(?:\?[\w=&-]+)?$/, /^https?:\/\/(?:www\.)?youtube\.com\/watch\?[\w=&-]+$/].some(pattern => pattern.test(url));
}

/** YoutubeのVideoIdの文字列の長さ */
const YOUTUBE_VIDEO_ID_LENGTH = 11;

/**
 * youtube の URL から videoId と開始位置の秒数を取得する
 */
function extractYoutubeVideoParameters(youtubeUrl) {
  var _params$get;
  if (!isYoutubeUrl(youtubeUrl)) return void 0;
  const url = new URL(youtubeUrl);
  const params = new URLSearchParams(url.search || '');

  // https://youtu.be/Hoge の "HogeHoge" の部分または、
  // https://www.youtube.com/watch?v=Hoge の "Hoge" の部分を値とする
  const videoId = params.get('v') || url.pathname.split('/')[1];

  // https://www.youtube.com/watch?v=Hoge&t=100s の "100" の部分を値とする
  const start = (_params$get = params.get('t')) === null || _params$get === void 0 ? void 0 : _params$get.replace('s', '');
  if ((videoId === null || videoId === void 0 ? void 0 : videoId.length) !== YOUTUBE_VIDEO_ID_LENGTH) return void 0;
  return {
    videoId,
    start
  };
}

/**
 * 参考: https://blueprintue.com/
 * 生成されるURLをもとに正規表現を定義した
 */

function isBlueprintUEUrl(url) {
  return /^https:\/\/blueprintue\.com\/render\/[-\w]+\/?$/.test(url);
}

/**
 * 参考: https://www.figma.com/developers/embed
 */
function isFigmaUrl(url) {
  return /^https:\/\/([\w.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/[\w-?=&%]+)?$/.test(url);
}