"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseToc = parseToc;
var cheerio = _interopRequireWildcard(require("cheerio"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function parseToc(html) {
  const $ = cheerio.load(html);
  const headings = $('body > h1, body > h2, body > h3').toArray();
  const headingsToc = headings.map(heading => ({
    level: parseInt(heading.name.slice(1), 10),
    // eslint-disable-next-line no-control-regex
    text: $(heading).text().replace(/\x08/g, '').trim(),
    id: heading.attribs.id,
    children: []
  }));

  // 先頭に出現したHeadingタグは最上位の階層とする
  // 以降に出現したHeadingタグは、最上位の階層の最後のHeadingタグのレベルと比較して同じか大きければ末尾に追加、
  // 小さい場合は一つ下の階層で同様の判定を行う。最下位の階層の最後のHeadingタグのレベルよりも低い場合は、さらに下の階層に追加する。
  return headingsToc.reduce((acc, current) => {
    let array = acc; // current TOC を投入するターゲットとなる配列。トップレベルから初めて条件を満たすたびにネストする
    do {
      if (array.length === 0 || array[array.length - 1].level >= current.level) {
        // ターゲット配列が空（最初のheadings）のときはcurrentを先頭に追加
        // ターゲット配列の末尾レベルがcurrentと比べて同じか大きければarrayの末尾に追加
        break;
      }

      // それ以外の場合は走査するarrayを末尾のchildrenにする
      array = array[array.length - 1].children;

      // eslint-disable-next-line no-constant-condition
    } while (true);
    array.push(current);
    return acc;
  }, []);
}