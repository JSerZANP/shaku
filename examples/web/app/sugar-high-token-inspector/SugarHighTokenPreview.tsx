import {
  startTransition,
  useCallback,
  useDeferredValue,
  useMemo,
  useState,
} from "react";

import { $ } from "migacss";
import { getShakuTokenLines } from "shaku-code-annotate-sugar-high";
import * as shiki from "shiki";
import { Fetcher } from "../../components/Fetcher";
import { Column, Text } from "../../components/bare";
import styles from "./SugarHighTokenVisualizer.module.css";

function fetchProcessor(lang, theme) {
  return shiki.getHighlighter({
    theme,
    langs: [lang],
    paths: {
      themes: "/_next/static/shiki/themes",
      wasm: "/_next/static/shiki/dist",
      languages: "/_next/static/shiki/languages",
    },
  });
}

const processorStore = new Map<string, Fetcher<shiki.Highlighter>>();

const getProcessor = (lang: string, theme: shiki.Theme) => {
  const key = `${lang}|${theme}`;
  if (!processorStore.has(key)) {
    processorStore.set(key, new Fetcher(() => fetchProcessor(lang, theme)));
  }
  return processorStore.get(key).fetch();
};

type SugerHighTokenWithId = ReturnType<
  typeof getShakuTokenLines
>[number][number] & {
  id: number;
};

const processedResultStore = new Map<
  string,
  Fetcher<SugerHighTokenWithId[][]>
>();
const getProcessedTokensResult = (
  lang: string,
  code: string,
  theme: shiki.Theme,
  processor: shiki.Highlighter
) => {
  const key = `${lang}|${code}|${theme}`;

  if (!processedResultStore.has(key)) {
    processedResultStore.set(
      key,
      new Fetcher(async () => {
        let tokenId = 0;

        const lines = getShakuTokenLines(code);

        return lines.map((tokens) => {
          return tokens.map((token) => ({
            ...token,
            id: tokenId++,
          }));
        });
      })
    );

    if (processedResultStore.size > 5) {
      const firstResultKey = processedResultStore.entries().next().value.key;
      processedResultStore.delete(firstResultKey);
    }
  }
  return processedResultStore.get(key).fetch();
};

function Line({
  line,
  selectToken,
  selectedToken,
  isStatic = false,
}: {
  line: SugerHighTokenWithId[];
  selectedToken?: SugerHighTokenWithId;
  selectToken: (token: SugerHighTokenWithId) => void;
  isStatic?: boolean;
}) {
  return (
    <>
      <span className={styles.line}>
        {line.map((token) => (
          <span
            style={{ color: `var(--sh-${token.type})` }}
            className={
              (isStatic ? "" : styles.token) +
              " " +
              (selectedToken === token ? styles.selected : "")
            }
            data-token-id={token.id}
            key={token.id}
            onClick={isStatic ? null : () => selectToken(token)}
          >
            {token.content}
          </span>
        ))}
      </span>
      {"\n"}
    </>
  );
}

function Lines({
  lines,
  selectToken,
  isStatic = false,
  selectedToken,
  bg,
  theme,
}: {
  lines: SugerHighTokenWithId[][];
  selectedToken?: SugerHighTokenWithId;
  selectToken?: (token: SugerHighTokenWithId) => void;
  isStatic?: boolean;
  bg: string;
  theme: shiki.Theme;
}) {
  return (
    <pre className={`shiki ${theme}`} style={{ backgroundColor: bg }}>
      <code>
        {lines.map((line, i) => (
          <Line
            line={line}
            selectedToken={selectedToken}
            selectToken={selectToken}
            isStatic={isStatic}
            key={i.toString()}
          />
        ))}
      </code>
    </pre>
  );
}

export default function ShikiTokenPreview({ code }: { code: string }) {
  const deferredLang = useDeferredValue("javascript");
  const deferredCode = useDeferredValue(code);
  const deferredTheme = useDeferredValue("github-dark");
  const processor = getProcessor(deferredLang, deferredTheme);
  const lines = getShakuTokenLines(deferredCode).map((line) => {
    return line.map((token, id) => ({ ...token, id }));
  });

  const [selectedToken, _selectToken] = useState<SugerHighTokenWithId>(
    lines[0][0]
  );
  const selectToken = useCallback((token) => {
    startTransition(() => _selectToken(token));
  }, []);
  const JSON_THEME = "github-dark";
  const jsonProcessor = getProcessor("json", JSON_THEME);

  const selectedTokenWithOutId = useMemo(() => {
    if (selectedToken) {
      const clone = { ...selectedToken };
      delete clone.id;
      return clone;
    }
    return null;
  }, [selectedToken]);

  const jsonLines = getProcessedTokensResult(
    "json",
    JSON.stringify(selectedTokenWithOutId, undefined, "  "),
    JSON_THEME,
    jsonProcessor
  );

  return (
    <Column
      $flex="1 0 0"
      $justifyContent="flex-start"
      $marginBottom="1rem"
      $gap={12}
      $alignItems="stretch"
    >
      <Text type="body">
        Click the tokens in below preview to see more details. Tokens varies on
        themes.
      </Text>
      <Column $flexGrow={1} $flexBasis={0} $minHeight={0} $width="min-content">
        <$.div className={styles.code} $flexShrink={1} $overflow="auto">
          <Lines
            theme={deferredTheme}
            lines={lines}
            bg={processor.getBackgroundColor()}
            selectToken={selectToken}
            selectedToken={selectedToken}
          />
        </$.div>
      </Column>
      <Column $flexGrow={1} $flexBasis={0} $flexShrink={1} $height={0}>
        <Text type="body">Selected Token:</Text>
        <$.div $flex="1 1 0" $overflow="auto">
          <Lines
            lines={jsonLines}
            isStatic
            bg={jsonProcessor.getBackgroundColor()}
            theme={JSON_THEME}
          />
        </$.div>
      </Column>
    </Column>
  );
}
