import { useDeferredValue } from "react";
import { View } from "../bare";
import styles from "./CodePreview.module.css";

import { remark } from "remark";
import html from "remark-html";
import { remarkShakuCodeAnnotate } from "remark-shaku-code-annotate";
import { Fetcher } from "../Fetcher";

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

async function fetchProcessor() {
  return remark()
    .use(remarkShakuCodeAnnotate, {
      // themes: ["github-light", "github-dark"],
      theme: "github-light",
      paths: {
        themes: "/_next/static/shiki/themes",
        wasm: "/_next/static/shiki/dist",
        languages: "/_next/static/shiki/languages",
      },
    })
    .use(html, { sanitize: false });
}
