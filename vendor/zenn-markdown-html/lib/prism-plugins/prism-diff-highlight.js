"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableDiffHighlight = enableDiffHighlight;
var _prismCore = _interopRequireDefault(require("prismjs/components/prism-core"));
require("prismjs/components/prism-markup");
require("prismjs/components/prism-css");
require("prismjs/components/prism-clike");
require("prismjs/components/prism-regex");
require("prismjs/components/prism-javascript");
require("prismjs/components/prism-abap");
require("prismjs/components/prism-abnf");
require("prismjs/components/prism-actionscript");
require("prismjs/components/prism-ada");
require("prismjs/components/prism-agda");
require("prismjs/components/prism-al");
require("prismjs/components/prism-antlr4");
require("prismjs/components/prism-apacheconf");
require("prismjs/components/prism-sql");
require("prismjs/components/prism-apex");
require("prismjs/components/prism-apl");
require("prismjs/components/prism-applescript");
require("prismjs/components/prism-aql");
require("prismjs/components/prism-c");
require("prismjs/components/prism-cpp");
require("prismjs/components/prism-arduino");
require("prismjs/components/prism-arff");
require("prismjs/components/prism-armasm");
require("prismjs/components/prism-bash");
require("prismjs/components/prism-yaml");
require("prismjs/components/prism-markdown");
require("prismjs/components/prism-arturo");
require("prismjs/components/prism-asciidoc");
require("prismjs/components/prism-csharp");
require("prismjs/components/prism-aspnet");
require("prismjs/components/prism-asm6502");
require("prismjs/components/prism-asmatmel");
require("prismjs/components/prism-autohotkey");
require("prismjs/components/prism-autoit");
require("prismjs/components/prism-avisynth");
require("prismjs/components/prism-avro-idl");
require("prismjs/components/prism-awk");
require("prismjs/components/prism-basic");
require("prismjs/components/prism-batch");
require("prismjs/components/prism-bbcode");
require("prismjs/components/prism-bbj");
require("prismjs/components/prism-bicep");
require("prismjs/components/prism-birb");
require("prismjs/components/prism-bison");
require("prismjs/components/prism-bnf");
require("prismjs/components/prism-bqn");
require("prismjs/components/prism-brainfuck");
require("prismjs/components/prism-brightscript");
require("prismjs/components/prism-bro");
require("prismjs/components/prism-bsl");
require("prismjs/components/prism-cfscript");
require("prismjs/components/prism-chaiscript");
require("prismjs/components/prism-cil");
require("prismjs/components/prism-cilkc");
require("prismjs/components/prism-cilkcpp");
require("prismjs/components/prism-clojure");
require("prismjs/components/prism-cmake");
require("prismjs/components/prism-cobol");
require("prismjs/components/prism-coffeescript");
require("prismjs/components/prism-concurnas");
require("prismjs/components/prism-csp");
require("prismjs/components/prism-cooklang");
require("prismjs/components/prism-coq");
require("prismjs/components/prism-ruby");
require("prismjs/components/prism-crystal");
require("prismjs/components/prism-css-extras");
require("prismjs/components/prism-csv");
require("prismjs/components/prism-cue");
require("prismjs/components/prism-cypher");
require("prismjs/components/prism-d");
require("prismjs/components/prism-dart");
require("prismjs/components/prism-dataweave");
require("prismjs/components/prism-dax");
require("prismjs/components/prism-dhall");
require("prismjs/components/prism-diff");
require("prismjs/components/prism-markup-templating");
require("prismjs/components/prism-django");
require("prismjs/components/prism-dns-zone-file");
require("prismjs/components/prism-docker");
require("prismjs/components/prism-dot");
require("prismjs/components/prism-ebnf");
require("prismjs/components/prism-editorconfig");
require("prismjs/components/prism-eiffel");
require("prismjs/components/prism-ejs");
require("prismjs/components/prism-elixir");
require("prismjs/components/prism-elm");
require("prismjs/components/prism-lua");
require("prismjs/components/prism-etlua");
require("prismjs/components/prism-erb");
require("prismjs/components/prism-erlang");
require("prismjs/components/prism-excel-formula");
require("prismjs/components/prism-fsharp");
require("prismjs/components/prism-factor");
require("prismjs/components/prism-false");
require("prismjs/components/prism-firestore-security-rules");
require("prismjs/components/prism-flow");
require("prismjs/components/prism-fortran");
require("prismjs/components/prism-ftl");
require("prismjs/components/prism-gml");
require("prismjs/components/prism-gap");
require("prismjs/components/prism-gcode");
require("prismjs/components/prism-gdscript");
require("prismjs/components/prism-gedcom");
require("prismjs/components/prism-gettext");
require("prismjs/components/prism-gherkin");
require("prismjs/components/prism-git");
require("prismjs/components/prism-glsl");
require("prismjs/components/prism-gn");
require("prismjs/components/prism-linker-script");
require("prismjs/components/prism-go");
require("prismjs/components/prism-go-module");
require("prismjs/components/prism-gradle");
require("prismjs/components/prism-graphql");
require("prismjs/components/prism-groovy");
require("prismjs/components/prism-less");
require("prismjs/components/prism-scss");
require("prismjs/components/prism-textile");
require("prismjs/components/prism-haml");
require("prismjs/components/prism-handlebars");
require("prismjs/components/prism-haskell");
require("prismjs/components/prism-haxe");
require("prismjs/components/prism-hcl");
require("prismjs/components/prism-hlsl");
require("prismjs/components/prism-hoon");
require("prismjs/components/prism-hpkp");
require("prismjs/components/prism-hsts");
require("prismjs/components/prism-json");
require("prismjs/components/prism-uri");
require("prismjs/components/prism-http");
require("prismjs/components/prism-ichigojam");
require("prismjs/components/prism-icon");
require("prismjs/components/prism-icu-message-format");
require("prismjs/components/prism-idris");
require("prismjs/components/prism-ignore");
require("prismjs/components/prism-inform7");
require("prismjs/components/prism-ini");
require("prismjs/components/prism-io");
require("prismjs/components/prism-j");
require("prismjs/components/prism-java");
require("prismjs/components/prism-php");
require("prismjs/components/prism-javadoclike");
require("prismjs/components/prism-scala");
require("prismjs/components/prism-javadoc");
require("prismjs/components/prism-javastacktrace");
require("prismjs/components/prism-jexl");
require("prismjs/components/prism-jolie");
require("prismjs/components/prism-jq");
require("prismjs/components/prism-js-templates");
require("prismjs/components/prism-typescript");
require("prismjs/components/prism-jsdoc");
require("prismjs/components/prism-n4js");
require("prismjs/components/prism-js-extras");
require("prismjs/components/prism-json5");
require("prismjs/components/prism-jsonp");
require("prismjs/components/prism-jsstacktrace");
require("prismjs/components/prism-julia");
require("prismjs/components/prism-keepalived");
require("prismjs/components/prism-keyman");
require("prismjs/components/prism-kotlin");
require("prismjs/components/prism-kumir");
require("prismjs/components/prism-kusto");
require("prismjs/components/prism-latex");
require("prismjs/components/prism-latte");
require("prismjs/components/prism-scheme");
require("prismjs/components/prism-lilypond");
require("prismjs/components/prism-liquid");
require("prismjs/components/prism-lisp");
require("prismjs/components/prism-livescript");
require("prismjs/components/prism-llvm");
require("prismjs/components/prism-log");
require("prismjs/components/prism-lolcode");
require("prismjs/components/prism-magma");
require("prismjs/components/prism-makefile");
require("prismjs/components/prism-mata");
require("prismjs/components/prism-matlab");
require("prismjs/components/prism-maxscript");
require("prismjs/components/prism-mel");
require("prismjs/components/prism-mermaid");
require("prismjs/components/prism-metafont");
require("prismjs/components/prism-mizar");
require("prismjs/components/prism-mongodb");
require("prismjs/components/prism-monkey");
require("prismjs/components/prism-moonscript");
require("prismjs/components/prism-n1ql");
require("prismjs/components/prism-nand2tetris-hdl");
require("prismjs/components/prism-naniscript");
require("prismjs/components/prism-nasm");
require("prismjs/components/prism-neon");
require("prismjs/components/prism-nevod");
require("prismjs/components/prism-nginx");
require("prismjs/components/prism-nim");
require("prismjs/components/prism-nix");
require("prismjs/components/prism-nsis");
require("prismjs/components/prism-objectivec");
require("prismjs/components/prism-ocaml");
require("prismjs/components/prism-odin");
require("prismjs/components/prism-opencl");
require("prismjs/components/prism-openqasm");
require("prismjs/components/prism-oz");
require("prismjs/components/prism-parigp");
require("prismjs/components/prism-parser");
require("prismjs/components/prism-pascal");
require("prismjs/components/prism-pascaligo");
require("prismjs/components/prism-psl");
require("prismjs/components/prism-pcaxis");
require("prismjs/components/prism-peoplecode");
require("prismjs/components/prism-perl");
require("prismjs/components/prism-phpdoc");
require("prismjs/components/prism-php-extras");
require("prismjs/components/prism-plant-uml");
require("prismjs/components/prism-plsql");
require("prismjs/components/prism-powerquery");
require("prismjs/components/prism-powershell");
require("prismjs/components/prism-processing");
require("prismjs/components/prism-prolog");
require("prismjs/components/prism-promql");
require("prismjs/components/prism-properties");
require("prismjs/components/prism-protobuf");
require("prismjs/components/prism-stylus");
require("prismjs/components/prism-twig");
require("prismjs/components/prism-pug");
require("prismjs/components/prism-puppet");
require("prismjs/components/prism-pure");
require("prismjs/components/prism-purebasic");
require("prismjs/components/prism-purescript");
require("prismjs/components/prism-python");
require("prismjs/components/prism-qsharp");
require("prismjs/components/prism-q");
require("prismjs/components/prism-qml");
require("prismjs/components/prism-qore");
require("prismjs/components/prism-r");
require("prismjs/components/prism-racket");
require("prismjs/components/prism-cshtml");
require("prismjs/components/prism-jsx");
require("prismjs/components/prism-tsx");
require("prismjs/components/prism-reason");
require("prismjs/components/prism-rego");
require("prismjs/components/prism-renpy");
require("prismjs/components/prism-rescript");
require("prismjs/components/prism-rest");
require("prismjs/components/prism-rip");
require("prismjs/components/prism-roboconf");
require("prismjs/components/prism-robotframework");
require("prismjs/components/prism-rust");
require("prismjs/components/prism-sas");
require("prismjs/components/prism-sass");
require("prismjs/components/prism-shell-session");
require("prismjs/components/prism-smali");
require("prismjs/components/prism-smalltalk");
require("prismjs/components/prism-smarty");
require("prismjs/components/prism-sml");
require("prismjs/components/prism-solidity");
require("prismjs/components/prism-solution-file");
require("prismjs/components/prism-soy");
require("prismjs/components/prism-turtle");
require("prismjs/components/prism-sparql");
require("prismjs/components/prism-splunk-spl");
require("prismjs/components/prism-sqf");
require("prismjs/components/prism-squirrel");
require("prismjs/components/prism-stan");
require("prismjs/components/prism-stata");
require("prismjs/components/prism-iecst");
require("prismjs/components/prism-supercollider");
require("prismjs/components/prism-swift");
require("prismjs/components/prism-systemd");
require("prismjs/components/prism-t4-templating");
require("prismjs/components/prism-t4-cs");
require("prismjs/components/prism-vbnet");
require("prismjs/components/prism-t4-vb");
require("prismjs/components/prism-tap");
require("prismjs/components/prism-tcl");
require("prismjs/components/prism-tt2");
require("prismjs/components/prism-toml");
require("prismjs/components/prism-tremor");
require("prismjs/components/prism-typoscript");
require("prismjs/components/prism-unrealscript");
require("prismjs/components/prism-uorazor");
require("prismjs/components/prism-v");
require("prismjs/components/prism-vala");
require("prismjs/components/prism-velocity");
require("prismjs/components/prism-verilog");
require("prismjs/components/prism-vhdl");
require("prismjs/components/prism-vim");
require("prismjs/components/prism-visual-basic");
require("prismjs/components/prism-warpscript");
require("prismjs/components/prism-wasm");
require("prismjs/components/prism-web-idl");
require("prismjs/components/prism-wgsl");
require("prismjs/components/prism-wiki");
require("prismjs/components/prism-wolfram");
require("prismjs/components/prism-wren");
require("prismjs/components/prism-xeora");
require("prismjs/components/prism-xml-doc");
require("prismjs/components/prism-xojo");
require("prismjs/components/prism-xquery");
require("prismjs/components/prism-yang");
require("prismjs/components/prism-zig");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * PrismJSのDiff構文を使用できるようにするためのプラグイン
 * ソースコードの大部分は、以下のファイルより抜き出したもの
 * @reference https://github.com/PrismJS/prism/blob/master/plugins/diff-highlight/prism-diff-highlight.js
 * @note `babel-plugin-prismjs`によって全ての言語プラグインを読み込んでいるため`locaLanguages()`の実行はしていない
 */
function enableDiffHighlight() {
  const LANGUAGE_REGEX = /^diff-([\w-]+)/i;
  const HTML_TAG = /<\/?(?!\d)[^\s>/=$<%]+(?:\s(?:\s*[^\s>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/gi;

  //this will match a line plus the line break while ignoring the line breaks HTML tags may contain.
  const HTML_LINE = RegExp(/(?:__|[^\r\n<])*(?:\r\n?|\n|(?:__|[^\r\n<])(?![^\r\n])(?:__)?)(?:__)?/.source.replace(/__/g, function () {
    return HTML_TAG.source;
  }), 'gi');
  let warningLogged = false;
  _prismCore.default.hooks.add('before-sanity-check', function (env) {
    const lang = env.language;
    if (LANGUAGE_REGEX.test(lang) && !env.grammar) {
      env.grammar = _prismCore.default.languages[lang] = _prismCore.default.languages.diff;
    }
  });
  _prismCore.default.hooks.add('before-tokenize', function (env) {
    if (!warningLogged && !_prismCore.default.languages.diff && !_prismCore.default.plugins.autoloader) {
      warningLogged = true;
      console.warn("Prism's Diff Highlight plugin requires the Diff language definition (prism-diff.js)." + "Make sure the language definition is loaded or use Prism's Autoloader plugin.");
    }
    const lang = env.language;
    if (LANGUAGE_REGEX.test(lang) && !_prismCore.default.languages[lang]) {
      _prismCore.default.languages[lang] = _prismCore.default.languages.diff;
    }
  });
  _prismCore.default.hooks.add('wrap', function (env) {
    let diffLanguage = '',
      diffGrammar;
    if (env.language !== 'diff') {
      const langMatch = LANGUAGE_REGEX.exec(env.language);
      if (!langMatch) {
        return; // not a language specific diff
      }
      diffLanguage = langMatch[1];
      diffGrammar = _prismCore.default.languages[diffLanguage];
    }

    /**
     * A map from the name of a block to its line prefix, same as `Prism.languages.diff.PREFIXES`
     *
     * @type {Object<string, string>}
     */
    const DIFF_PREFIXES = {
      'deleted-sign': '-',
      'deleted-arrow': '<',
      'inserted-sign': '+',
      'inserted-arrow': '>',
      unchanged: ' ',
      diff: '!'
    };
    const PREFIXES = _prismCore.default.languages.diff && DIFF_PREFIXES;
    // one of the diff tokens without any nested tokens
    if (PREFIXES && env.type in PREFIXES) {
      /** @type {string} */
      const content = env.content.replace(HTML_TAG, ''); // remove all HTML tags

      /** @type {string} */
      const decoded = content.replace(/&lt;/g, '<').replace(/&amp;/g, '&');

      // remove any one-character prefix
      const code = decoded.replace(/(^|[\r\n])./g, '$1');

      // highlight, if possible
      let highlighted;
      if (diffLanguage && diffGrammar) {
        highlighted = _prismCore.default.highlight(code, diffGrammar, diffLanguage);
      } else {
        highlighted = _prismCore.default.util.encode(code);
      }

      // get the HTML source of the prefix token
      const prefixToken = new _prismCore.default.Token('prefix', PREFIXES[env.type], [/\w+/.exec(env.type)[0]]);
      const prefix = _prismCore.default.Token.stringify(prefixToken, env.language);

      // add prefix
      const lines = [];
      let m;
      HTML_LINE.lastIndex = 0;
      while (m = HTML_LINE.exec(highlighted)) {
        lines.push(prefix + m[0]);
      }
      if (/(?:^|[\r\n]).$/.test(decoded)) {
        // because both "+a\n+" and "+a\n" will map to "a\n" after the line prefixes are removed
        lines.push(prefix);
      }
      env.content = lines.join('');
      if (diffGrammar) {
        env.classes.push('language-' + diffLanguage);
      }
    }
  });
}