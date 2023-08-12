"use client";

import withShiki from "@stefanprobst/remark-shiki";

import { Editor } from "@monaco-editor/react";
import { $ } from "migacss";
import { useCallback, useEffect, useState } from "react";
import { BsStars } from "react-icons/bs";
import { RiShareBoxLine } from "react-icons/ri";
import { remark } from "remark";
import html from "remark-html";
import { remarkShakuCodeAnnotate } from "remark-shaku-code-annotate";
import * as shiki from "shiki";
import styles from "./Playground.module.css";
import { Button, Column, Row, Text, View } from "./bare";
import useDebouncedCallback from "./useDebouncedCallback";

const defaultMarkdown = `

**shaku-code-annotate** allows you to annotate the code snippets,
in a different context.

## Here is a callout

\`\`\`js annotate
const blog = "https://jser.dev"
//                    ^
//       [JSer.dev is the *homepage* for JSer.]
//       [Check it out! [jser.dev](https://jser.dev)]
// This is a normal comment
\`\`\`

See how the callout is rendered separately from normal comments

## Various kinds of underlines

\`\`\`js annotate
// This is normal comments from source code.
const blog = "https://jser.dev"
//                    ~~~~~~~~
//       [JSer.dev is the **homepage** for JSer.]
//       [Check it out! [jser.dev](https://jser.dev)]

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

## Easily Highlight lines

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

## Easily Dim lines

Use this command to de-emphasize some lines.

\`\`\`js annotate
function useSomeEffect({blog}) {
  // @dim
  useEffect(() => {
    // do some staff

      return () => {
        // @dim start
        location.href = 'https://jser.dev'
        // @dim end

      }

    }, [blog])
}
\`\`\`


## Easily Focus lines

Emphasize some lines while de-emphasize the others.

\`\`\`js annotate
function useSomeEffect({blog}) {
  // @focus
  useEffect(() => {
    // do some staff

      return () => {
        // @focus start
        location.href = 'https://jser.dev'
        // @focus end

      }

    }, [blog])
}
\`\`\`

## Also works in JSX/TSX

\`\`\`tsx annotate
function component() {
  //       ^
  //     [This is line 1]
    return <p>jser.dev
    { /*      --------       */}
       {/*   [This is line 2]       */}
       {/*   @highlight       */}
       <button>click me</button>
       {123}
    </p>
  }
\`\`\`

## How to Use

Visit [shaku on github](https://github.com/JSerZANP/shaku/tree/main) to find the right plugin.
`;

function getProcessor() {
  return shiki
    .getHighlighter({
      theme: "github-light",
      langs: ["javascript", "css", "jsx", "html", "typescript", "tsx"],
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
          langs: ["javascript", "css", "jsx", "html", "typescript", "tsx"],

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

  const render = useCallback((code) => {
    getProcessor().then((processor) =>
      processor.process(code).then((data) => {
        setPreview(data.toString());
      })
    );
  }, []);

  const debouncedRender = useDebouncedCallback(render, 1000);

  useEffect(() => {
    debouncedRender(code);
  }, [code, debouncedRender]);

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
    <Column height={"100vh"} padding={12} gap={12}>
      <View>
        <Row alignItems="center" justifyContent="space-between" gap={20}>
          <Text type="headline1">Shaku Playground</Text>
          <$.a href="/snippet" $textDecoration="none">
            <Text type="headline5" color="#dc0bf0">
              <BsStars />
              Shaku Snippet →
            </Text>
          </$.a>
        </Row>
        <Text type="body">
          <a href="https://github.com/JSerZANP/shaku/tree/main" target="_blank">
            Shaku
          </a>{" "}
          allows you to annotate your code easily. Created by{" "}
          <a href="https://twitter.com/JSer_ZANP">JSer</a>.
        </Text>
      </View>
      <Row>
        <Button
          onClick={share}
          label="Share page with below code"
          icon={<RiShareBoxLine />}
        ></Button>
      </Row>
      <Row gap={20} flex="1 0 0 ">
        <Column flex="1 0 0">
          <Editor
            defaultLanguage="markdown"
            height="100%"
            value={code}
            theme="vs-dark"
            onChange={setCode}
          />
        </Column>
        <View flex="1 0 0">
          <div
            dangerouslySetInnerHTML={{ __html: preview }}
            className={styles.preview}
          ></div>
        </View>
      </Row>
    </Column>
  );
}
