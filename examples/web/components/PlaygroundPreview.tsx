import { useDeferredValue } from "react";
import styles from "./Playground.module.css";
import { View } from "./bare";

import withShiki from "@stefanprobst/remark-shiki";
import { remark } from "remark";
import html from "remark-html";
import { remarkShakuCodeAnnotate } from "remark-shaku-code-annotate";
import * as shiki from "shiki";
import { Fetcher } from "./Fetcher";

let fetcher: Fetcher<ReturnType<typeof remark>> | null = null;
const getProcessor = () => {
  if (fetcher == null) {
    fetcher = new Fetcher(() => fetchProcessor());
  }
  return fetcher.fetch();
};

const processedResultStore = new Map<string, Fetcher<string>>();

const getProcessedResult = (
  code: string,
  processor: ReturnType<typeof remark>
) => {
  const key = code;

  if (!processedResultStore.has(key)) {
    processedResultStore.set(
      key,
      new Fetcher(() => processor.process(code).then((data) => data.toString()))
    );

    if (processedResultStore.size > 5) {
      const firstResultKey = processedResultStore.entries().next().value.key;
      processedResultStore.delete(firstResultKey);
    }
  }
  return processedResultStore.get(key).fetch();
};

export default function PlaygroundPreview({ code }: { code: string }) {
  const deferredCode = useDeferredValue(code);
  const processor = getProcessor();
  const processedResult = getProcessedResult(deferredCode, processor);
  return (
    <View $flex="1 0 0">
      <div
        dangerouslySetInnerHTML={{ __html: processedResult }}
        className={styles.preview}
      ></div>
    </View>
  );
}

function fetchProcessor() {
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
