import { useCallback, useEffect, useState } from "react";
import styles from "./Playground.module.css";
import { View } from "./bare";
import useDebouncedCallback from "./useDebouncedCallback";

import withShiki from "@stefanprobst/remark-shiki";
import { remark } from "remark";
import html from "remark-html";
import { remarkShakuCodeAnnotate } from "remark-shaku-code-annotate";
import * as shiki from "shiki";

export default function PlaygroundPreview({ code }: { code: string }) {
  const [preview, setPreview] = useState("");

  const render = useCallback((code) => {
    getProcessor().then((processor) =>
      processor.process(code).then((data) => {
        setPreview(data.toString());
      })
    );
  }, []);

  const debouncedRender = useDebouncedCallback(render, 500);

  useEffect(() => {
    debouncedRender(code);
  }, [code, debouncedRender]);
  return (
    <View $flex="1 0 0">
      <div
        dangerouslySetInnerHTML={{ __html: preview }}
        className={styles.preview}
      ></div>
    </View>
  );
}

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
