"use client";

import withShiki from "@stefanprobst/remark-shiki";

import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { RiShareBoxLine } from "react-icons/ri";
import { remark } from "remark";
import html from "remark-html";
import { remarkShakuCodeAnnotate } from "remark-shaku-code-annotate";
import * as shiki from "shiki";
import styles from "./Playground.module.css";

const defaultMarkdown = `

**shaku-code-annotate** allows you to annotate the code snippets,
in a different context.

**Here is a callout**

\`\`\`js annotate
const blog = "https://jser.dev"
//                    ^
//       [JSer.dev is the homepage for JSer.]
//       [Check it out!]
// This is a normal comment
\`\`\`

See how the callout is rendered separately from normal comments

**Various kinds of underlines**

\`\`\`js annotate
// This is normal comments from source code.
const blog = "https://jser.dev"
//                    ~~~~~~~~
//       [JSer.dev is the homepage for JSer.]
//       [Check it out!]

const blog = "jser.dev"
//            --------
//          [Check it out!]

const blog = "jser.dev"
//            ........
//          [Check it out!]

const blog = "jser.dev"
//            ........

const blog = "jser.dev"
//            --------
const blog = "jser.dev"
//            ~~~~~~~~
\`\`\`

**easily Highlight lines**

You don't need to add code meta, just add the command where you want to highlight.

\`\`\`js annotate
// @highlight
function useSomeEffect({blog}) {

  useEffect(() => {
    // do some staff

// @highlight start
      return () => {
        location.href = 'https://jser.dev'
      }
// @highlight end

    }, [blog])
}
\`\`\`

**easily Dim lines**

Use this command to de-emphasize some lines.

\`\`\`js annotate
// @dim
function foo() {
  console.log("Hello!")
// @dim start
  setTimeout(() => {
    console.log("World!")
  },1000)
// @dim end
}
\`\`\`


**easily Focus lines**

Emphasize some lines while de-emphasize the others.

\`\`\`js annotate
// @focus
function foo(){
  console.log("Hello!")
// @focus start
  setTimeout(() => {
    console.log('World!')
  },1000)
// @focus end
}
\`\`\`

**How to Use**

Visit [shaku on github](https://github.com/JSerZANP/shaku/tree/main) to find the right plugin.
`;

function getProcessor() {
  return shiki
    .getHighlighter({
      theme: "github-light",
      langs: ["javascript", "css", "html"],
      paths: {
        themes: "/_next/static/shiki/themes",
        wasm: "/_next/static/shiki/dist",
        languages: "/_next/static/shiki/languages",
      },
    })
    .then((highlighter) =>
      remark()
        .use(remarkShakuCodeAnnotate, {
          theme: "github-light",
          langs: ["javascript", "css"],

          paths: {
            themes: "/_next/static/shiki/themes",
            wasm: "/_next/static/shiki/dist",
            languages: "/_next/static/shiki/languages",
          },
        })
        .use(withShiki, { highlighter })
        .use(html, { sanitize: false })
    );
}

export function Playground({ code: _code }: { code?: string }) {
  const [code, setCode] = useState(_code ?? defaultMarkdown);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    getProcessor().then((processor) =>
      processor.process(code).then((data) => {
        setPreview(data.toString());
      })
    );
  }, [code]);

  const share = () => {
    const query = "code=" + encodeURIComponent(code);
    const url = location.origin + "?" + query;
    const type = "text/plain";
    const blob = new Blob([url], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    navigator.clipboard.write(data).then(
      () => alert("link copied"),
      () => alert("failed to copy link.")
    );
  };
  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <h1 className={styles.heading}>shaku-code-annotate playground</h1>
        <p>
          The markdown preview is highlighted with{" "}
          <a
            href="https://github.com/JSerZANP/shaku/tree/main/packages/remark-shaku-code-annotate"
            target="_blank"
          >
            remark-shaku-code-annotate
          </a>
          , style controlled by CSS.
        </p>
      </div>
      <div className={styles.toolbar}>
        <button className={styles.share} onClick={share}>
          <RiShareBoxLine /> Share page with below code
        </button>
      </div>
      <div className={styles.playground}>
        <div className={styles.editor}>
          <Editor
            defaultLanguage="markdown"
            height="100%"
            value={code}
            theme="vs-dark"
            onChange={setCode}
          />
        </div>
        <div className={styles.preview}>
          <div dangerouslySetInnerHTML={{ __html: preview }}></div>
        </div>
      </div>
    </div>
  );
}
