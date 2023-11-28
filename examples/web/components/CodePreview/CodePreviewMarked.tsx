import { Marked } from "marked";
import markedShakuCodeAnnotate from "marked-shaku-code-annotate";
import { useDeferredValue } from "react";
import { Fetcher } from "../Fetcher";
import styles from "./CodePreview.module.css";
import { sanitize } from "./sanitize";

import { View } from "../bare";

const marked = new Marked();

marked.use(
  markedShakuCodeAnnotate({
    theme: "github-light",
    langs: ["javascript", "css", "jsx", "html", "typescript", "tsx"],

    paths: {
      themes: "/_next/static/shiki/themes",
      wasm: "/_next/static/shiki/dist",
      languages: "/_next/static/shiki/languages",
    },
  })
);

const processedResultStore = new Map<string, Fetcher<string>>();

const getProcessedResult = (code: string) => {
  const key = code;

  if (!processedResultStore.has(key)) {
    processedResultStore.set(
      key,
      // @ts-ignore
      new Fetcher(() => marked.parse(code).then(sanitize))
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
  const processedResult = getProcessedResult(deferredCode);
  return (
    <View
      $flex="1 0 0"
      $border="1px solid var(--color-line-3rd)"
      $padding={"1rem"}
    >
      <div
        dangerouslySetInnerHTML={{ __html: processedResult }}
        className={styles.preview}
      ></div>
    </View>
  );
}
