"use client";

import { Editor } from "@monaco-editor/react";
import { $ } from "migacss";
import dynamic from "next/dynamic";
import { useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import { RiShareBoxLine } from "react-icons/ri";
import { defaultCode } from "remark-shaku-code-annotate";
import { Button, Column, Row, Text, View } from "./bare";

const CodeSnippetPreview = dynamic(() => import("./CodeSnippetPreview"), {
  ssr: false,
});

const ALL_LANGS = [
  "abap",
  "actionscript-3",
  "ada",
  "apache",
  "apex",
  "apl",
  "applescript",
  "ara",
  "asm",
  "astro",
  "awk",
  "ballerina",
  // "bat",
  "batch",
  "berry",
  // "be",
  "bibtex",
  "bicep",
  "blade",
  "c",
  "cadence",
  // "cdc",
  "clarity",
  "clojure",
  // "clj",
  "cmake",
  "cobol",
  "codeql", // nothing to test
  // "ql",
  "coffee",
  "cpp",
  "crystal",
  "c#",
  // "cs",
  "css",
  "cue",
  "d",
  "dart",
  "dax",
  "diff", // nothing to test
  // "docker",
  "dockerfile",
  "dream-maker",
  "elixir",
  "elm",
  "erb",
  "erlang",
  // "erl",
  "fish",
  // "fsharp",
  "f#",
  // "fs",
  // "gdresource",
  // "gdscript",
  // "gdshader",
  // "gherkin",
  "git-commit",
  // "git-rebase",
  "glsl",
  "gnuplot",
  "go",
  "graphql",
  "groovy",
  "hack",
  "haml",
  "handlebars",
  // "hbs",
  "haskell",
  // "hs",
  "hcl",
  "hlsl",
  "html",
  // "http",
  "imba",
  "ini",
  "properties",
  "java",
  "javascript",
  // "jinja-html",
  "jison",
  "json",
  "json5",
  "jsonc",
  "jsonnet",
  "jssm",
  "fsl",
  "jsx",
  "julia",
  "kotlin",
  "kusto",
  "kql",
  "latex",
  "less",
  "liquid",
  "lisp",
  "logo",
  "lua",
  "make",
  "makefile",
  "markdown",
  // "md",
  "marko",
  "matlab",
  "mdx",
  "mermaid",
  "nginx",
  "nim",
  "nix",
  // "objective-c",
  "objc",
  // "objective-cpp",
  "ocaml",
  "pascal",
  "perl",
  "php",
  "plsql",
  // "postcss",
  "powerquery",
  "powershell",
  // "ps",
  // "ps1",
  "prisma",
  "prolog",
  "proto",
  // "pug",
  // "jade",
  // "puppet",
  "purescript",
  "python",
  "r",
  "raku",
  "perl6",
  "razor",
  "reg",
  "rel",
  "riscv",
  "rst",
  "ruby",
  // "rb",
  "rust",
  // "rs",
  "sas",
  "sass",
  "scala",
  "scheme",
  "scss",
  "shaderlab",
  "shader",
  "shellscript",
  "bash",
  // "console",
  // "sh",
  "shell",
  "zsh",
  "smalltalk",
  "solidity",
  "sparql",
  "sql",
  "ssh-config",
  "stata",
  "stylus",
  // "styl",
  "svelte",
  "swift",
  "system-verilog",
  // "tasl",
  "tcl",
  "tex",
  "toml",
  "tsx",
  "turtle",
  "twig",
  "typescript",
  // "ts",
  // "v",
  "vb",
  // "cmd",
  "verilog",
  "vhdl",
  "viml",
  // "vim",
  "vimscript",
  // "vue-html",
  "vue",
  "wasm",
  "wenyan",
  // "文言",
  "wgsl",
  "wolfram",
  "xml",
  "xsl",
  "yaml",
  // "yml",
  "zenscript",
];

export function CodeSnippet({
  code: _code,
  lang: _lang,
}: {
  code?: string;
  lang?: string;
}) {
  const [lang, setLang] = useState<string>(_lang ?? "javascript");
  const [code, setCode] = useState(_code ?? defaultCode[lang] ?? "");

  const share = () => {
    const query =
      "code=" + encodeURIComponent(code) + "&lang=" + encodeURIComponent(lang);
    const url = location.origin + "/snippet?" + query;
    const type = "text/plain";
    const blob = new Blob([url], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    navigator.clipboard.write(data).then(
      () => alert("link copied"),
      () => alert("failed to copy link.")
    );
  };
  return (
    <Column $height={"100vh"} $padding={12} $gap={12}>
      <View>
        <Row $alignItems="center" $justifyContent="space-between" $gap={20}>
          <Text type="headline1">
            Shaku Snippet{" "}
            <$.a
              href="https://github.com/JSerZANP/shaku"
              target="_blank"
              $fontSize={20}
              $marginLeft={12}
            >
              <AiFillGithub />
            </$.a>
          </Text>
          <$.a href="/" $textDecoration="none">
            <Text type="headline5" $color="#0e67e4">
              <BsStars />
              Shaku Playground →
            </Text>
          </$.a>
        </Row>
        <Text type="body">
          Annotate code snippet with <a href="/">Shaku Code Annotate Syntax</a>{" "}
          and share it with the world! Created by{" "}
          <a href="https://twitter.com/JSer_ZANP">JSer</a>.
        </Text>
      </View>

      <Row $gap={20} $flex="1 0 0 ">
        <Column $flex="1 0 0" $maxWidth={600}>
          <Row $marginBottom="1.5rem">
            <select
              value={lang}
              // @ts-ignore
              onChange={(e) => {
                setLang(e.currentTarget.value);
                setCode(defaultCode[lang]);
              }}
            >
              {ALL_LANGS.map((lang) => (
                <option value={lang} key={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <Button
              onClick={share}
              label="Share page with below code"
              icon={<RiShareBoxLine />}
            ></Button>
          </Row>
          <Editor
            language={lang}
            height="100%"
            value={code}
            theme="vs-dark"
            onChange={setCode}
            options={{
              minimap: {
                enabled: false,
              },
              lineNumbers: "off",
            }}
          />
        </Column>
        <CodeSnippetPreview code={code} lang={lang} />
      </Row>
    </Column>
  );
}
