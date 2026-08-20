"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.containerRightOptions = exports.containerMessageOptions = exports.containerLeftOptions = exports.containerDetailsOptions = exports.containerCOptions = void 0;
var _utils = require("markdown-it/lib/common/utils");
// containers
// ref: https://github.com/markdown-it/markdown-it-container

// ::: details Detail
//   summary comes here
// :::
const containerDetailsOptions = exports.containerDetailsOptions = {
  validate: function (params) {
    return /^details\s+(.*)$/.test(params.trim());
  },
  render: function (tokens, idx) {
    const m = tokens[idx].info.trim().match(/^details\s+(.*)$/);
    const summary = (m === null || m === void 0 ? void 0 : m[1]) || '';
    if (tokens[idx].nesting === 1) {
      // opening tag
      return '<details><summary>' + (0, _utils.escapeHtml)(summary) + '</summary><div class="details-content">';
    } else {
      // closing tag
      return '</div></details>\n';
    }
  }
};
// ::: message alert
//   text
// :::
const msgClassRegex = /^message\s*(alert)?$/;
const containerMessageOptions = exports.containerMessageOptions = {
  validate: function (params) {
    return msgClassRegex.test(params.trim());
  },
  render: function (tokens, idx) {
    const m = tokens[idx].info.trim().match(msgClassRegex);
    const messageName = (m === null || m === void 0 ? void 0 : m[1]) === 'alert' ? 'alert' : 'message';
    if (tokens[idx].nesting === 1) {
      // opening tag
      const symbol = `<span class="msg-symbol">!</span>`;
      return `<aside class="msg ${messageName}">${symbol}<div class="msg-content">`;
    } else {
      // closing tag
      return `</div></aside>\n`;
    }
  }
};
// ::: c 
//   content goes here
// :::
const containerCOptions = exports.containerCOptions = {
  validate: function (params) {
    return /^c\s*$/.test(params.trim());
  },
  render: function (tokens, idx) {
    if (tokens[idx].nesting === 1) {
      // opening tag
      return `<div class="fig-table-caption">`;
    } else {
      // closing tag
      return `</div>\n`;
    }
  }
};

// ::: columns
//   ::: left
//     Content on the left side.
//   :::
//   ::: right
//     Content on the right side.
//   :::
// :::

// left コンテナの設定
const containerLeftOptions = exports.containerLeftOptions = {
  validate: function (params) {
    return params.trim() === 'left';
  },
  render: function (tokens, idx) {
    if (tokens[idx].nesting === 1) {
      return '<div class="container-columns"><div class="container-left">';
    } else {
      return '</div>\n';
    }
  }
};

// right コンテナの設定
const containerRightOptions = exports.containerRightOptions = {
  validate: function (params) {
    return params.trim() === 'right';
  },
  render: function (tokens, idx) {
    if (tokens[idx].nesting === 1) {
      return '<div class="container-right">';
    } else {
      return '</div></div>\n';
    }
  }
};