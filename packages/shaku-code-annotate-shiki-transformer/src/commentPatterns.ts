import { supportedLangs } from "./defaultCode";

type Lang = (typeof supportedLangs)[number];

const PatternAsterisk = /^(?<leadingSpaces>\s*)(?<markerStart>\*)(?<body>.*)$/;
const PatternDoubleSlash =
  /^(?<leadingSpaces>\s*)(?<markerStart>\/\/)(?<body>.*)$/;
const PatternDoubleDash =
  /^(?<leadingSpaces>\s*)(?<markerStart>\-\-)(?<body>.*)$/;
const PatternHash = /^(?<leadingSpaces>\s*)(?<markerStart>#)(?<body>.*)$/;
const PatternSemiColon = /^(?<leadingSpaces>\s*)(?<markerStart>;)(?<body>.*)$/;
const PatternDoubleSemiColon =
  /^(?<leadingSpaces>\s*)(?<markerStart>;;)(?<body>.*)$/;
const PatternSFC =
  /^(?<leadingSpaces>\s*)(?<markerStart>(\/\/|\<\!\-\-|\/\*))(?<body>.*?)(?<markerEnd>(\-\-\>|\*\/))?$/;
const PatternXML =
  /^(?<leadingSpaces>\s*)(?<markerStart>\<\!\-\-)(?<body>.*)(?<markerEnd>\-\-\>)$/;
const PatternPercentage = /^(?<leadingSpaces>\s*)(?<markerStart>%)(?<body>.*)$/;
const PatternDoublePercentage =
  /^(?<leadingSpaces>\s*)(?<markerStart>%%)(?<body>.*)$/;
const PatternSlashAsterisk =
  /^(?<leadingSpaces>\s*)(?<markerStart>\/\*)(?<body>.*)(?<markerEnd>\*\/)$/;
const PatternJSWithJSX =
  /^(?<leadingSpaces>\s*)(?<markerStart>(\/\*|\/\/|\{\/\*))(?<body>.*?)(?<markerEnd>(\*\/|\*\/\}))?$/;
const PatternHBS =
  /^(?<leadingSpaces>\s*)(?<markerStart>\{\{\!\-\-)(?<body>.*)(?<markerEnd>\-\-\}\})$/;
const PatternBatch = /^(?<leadingSpaces>\s*)(?<markerStart>REM)(?<body>.*)$/i;
const PatternDoubleQuote =
  /^(?<leadingSpaces>\s*)(?<markerStart>\")(?<body>.*)$/;

export const commentPatterns: Record<string, RegExp> = {
  abap: PatternAsterisk,
  "actionscript-3": PatternDoubleSlash,
  ada: PatternDoubleDash,
  apache: PatternHash,
  apex: PatternDoubleSlash,
  apl: /^(?<leadingSpaces>\s*)(?<markerStart>⍝)(?<body>.*)$/,
  applescript: PatternDoubleDash,
  ara: PatternDoubleSlash,
  astro:
    /^(?<leadingSpaces>\s*)(?<markerStart>(\<!\-\-|\{\/\*))(?<body>.*)(?<markerEnd>(\-\-\>|\*\/\}))$/,
  awk: PatternHash,
  ballerina: PatternDoubleSlash,
  batch: PatternBatch,
  berry: PatternHash,
  bicep: PatternDoubleSlash,
  blade:
    /^(?<leadingSpaces>\s*)(?<markerStart>\{\{\-\-)(?<body>.*)(?<markerEnd>\-\-\}\})$/,
  cadence: PatternDoubleSlash,
  clarity: PatternDoubleSemiColon,
  clojure: PatternSemiColon,
  cmake: PatternHash,
  asm: PatternSemiColon,
  c: PatternDoubleSlash,
  cobol: PatternAsterisk,
  coffee: PatternHash,
  crystal: PatternHash,
  css: PatternSlashAsterisk,
  cue: PatternDoubleSlash,
  d: PatternDoubleSlash,
  dart: PatternDoubleSlash,
  dax: PatternDoubleSlash,
  dockerfile: PatternHash,
  "dream-maker": PatternDoubleSlash,
  elixir: PatternHash,
  elm: PatternDoubleDash,
  erb: /^(?<leadingSpaces>\s*)(?<markerStart>\<%#)(?<body>.*)(?<markerEnd>%\>)$/,
  erlang: PatternDoublePercentage,
  fish: PatternHash,
  "f#": PatternDoubleSlash,
  "git-commit": PatternHash,
  glsl: PatternDoubleSlash,
  gnuplot: PatternHash,
  graphql: PatternHash,
  groovy: PatternDoubleSlash,
  hack: PatternDoubleSlash,
  haml: /^(?<leadingSpaces>\s*)(?<markerStart>-#)(?<body>.*)$/,
  handlebars: PatternHBS,
  haskell: PatternDoubleDash,
  hcl: PatternHash,
  hlsl: PatternDoubleSlash,
  html: PatternXML,
  cpp: PatternDoubleSlash,
  "c#": PatternDoubleSlash,
  go: PatternDoubleSlash,
  java: PatternDoubleSlash,
  javascript: PatternJSWithJSX,
  imba: PatternHash,
  ini: PatternSemiColon,
  properties: PatternHash,
  json5: PatternDoubleSlash,
  jsonc: PatternDoubleSlash,
  jsonnet: PatternDoubleSlash,
  jssm: PatternDoubleSlash,
  jsx: PatternJSWithJSX,
  kotlin: PatternDoubleSlash,
  kusto: PatternDoubleSlash,
  kql: PatternDoubleSlash,
  julia: PatternHash,
  matlab: PatternPercentage,
  latex: PatternPercentage,
  less: /^(?<leadingSpaces>\s*)(?<markerStart>(\/\*|\/\/))(?<body>.*?)(?<markerEnd>(\*\/))?$/,
  php: PatternDoubleSlash,
  lisp: PatternSemiColon,
  logo: PatternSemiColon,
  lua: PatternDoubleDash,
  make: PatternHash,
  makefile: PatternHash,
  markdown: PatternXML,
  marko: PatternXML,
  mdx: /^(?<leadingSpaces>\s*)(?<markerStart>\{\/\*)(?<body>.*)(?<markerEnd>\*\/\})$/,
  mermaid: /^(?<leadingSpaces>\s*)(?<markerStart>%%)(?<body>.*)$/,
  nginx: PatternHash,
  nim: PatternHash,
  nix: PatternHash,
  "objective-c": PatternDoubleSlash,
  "objective-cpp": PatternDoubleSlash,
  ocaml:
    /^(?<leadingSpaces>\s*)(?<markerStart>\(\*)(?<body>.*)(?<markerEnd>\*\))$/,
  pascal:
    /^(?<leadingSpaces>\s*)(?<markerStart>\{)(?<body>.*)(?<markerEnd>\})$/,
  perl: PatternHash,
  powerquery: PatternDoubleSlash,
  powershell: PatternHash,
  prisma: PatternDoubleSlash,
  prolog: PatternPercentage,
  proto: PatternDoubleSlash,
  plsql: PatternDoubleDash,
  purescript: PatternDoubleDash,
  raku: PatternHash,
  perl6: PatternHash,
  reg: PatternSemiColon,
  rel: PatternDoubleSlash,
  riscv: PatternHash,
  sas: PatternSlashAsterisk,
  sass: PatternDoubleSlash,
  scala: PatternDoubleSlash,
  scheme: PatternSemiColon,
  shaderlab: PatternDoubleSlash,
  shader: PatternDoubleSlash,
  scss: PatternSlashAsterisk,
  shellscript: PatternHash,
  bash: PatternHash,
  sh: PatternHash,
  shell: PatternHash,
  zsh: PatternHash,
  solidity: PatternDoubleSlash,
  r: PatternHash,
  sparql: PatternHash,
  stata: PatternAsterisk,
  stylus: PatternDoubleSlash,
  svelte: PatternSFC,
  python: PatternHash,
  ruby: PatternHash,
  rust: PatternDoubleSlash,
  sql: PatternDoubleDash,
  "system-verilog": PatternDoubleSlash,
  tcl: PatternHash,
  tex: PatternPercentage,
  toml: PatternHash,
  tsx: PatternJSWithJSX,
  turtle: PatternHash,
  swift: PatternDoubleSlash,
  twig: /^(?<leadingSpaces>\s*)(?<markerStart>\{#)(?<body>.*)(?<markerEnd>#\})$/,
  typescript: PatternJSWithJSX,
  vb: /^(?<leadingSpaces>\s*)(?<markerStart>\')(?<body>.*)$/,
  verilog: PatternDoubleSlash,
  vhdl: PatternDoubleDash,
  viml: PatternDoubleQuote,
  vimscript: PatternDoubleQuote,
  vue: PatternSFC,
  wasm: PatternDoubleSemiColon,
  wenyan: /^(?<leadingSpaces>\s*)(?<markerStart>注曰。)(?<body>.*)$/,
  wgsl: PatternDoubleSlash,
  wolfram:
    /^(?<leadingSpaces>\s*)(?<markerStart>\(\*)(?<body>.*)(?<markerEnd>\*\))$/,
  xml: PatternXML,
  xsl: PatternXML,
  yaml: PatternHash,
  zenscript: PatternDoubleSlash,
  jison: PatternDoubleSlash,
  "ssh-config": PatternHash,
} satisfies Record<Lang, RegExp>;
