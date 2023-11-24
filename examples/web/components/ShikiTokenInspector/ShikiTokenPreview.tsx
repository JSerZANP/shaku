import {
  startTransition,
  useCallback,
  useDeferredValue,
  useMemo,
  useState,
} from "react";

import { $ } from "migacss";
import * as shiki from "shiki";
import { Fetcher } from "../Fetcher";
import { Column, Text } from "../bare";
import styles from "./ShikiTokenVisualizer.module.css";

function fetchProcessor(lang) {
  return shiki.getHighlighter({
    theme: "github-dark",
    langs: [lang],
    paths: {
      themes: "/_next/static/shiki/themes",
      wasm: "/_next/static/shiki/dist",
      languages: "/_next/static/shiki/languages",
    },
  });
}

const processorStore = new Map<string, Fetcher<shiki.Highlighter>>();

const getProcessor = (lang: string) => {
  if (!processorStore.has(lang)) {
    processorStore.set(lang, new Fetcher(() => fetchProcessor(lang)));
  }
  return processorStore.get(lang).fetch();
};

type ShikiTokenWithId = shiki.IThemedToken & {
  id: number;
};

const processedResultStore = new Map<string, Fetcher<ShikiTokenWithId[][]>>();
const getProcessedTokensResult = (
  lang: string,
  code: string,
  processor: shiki.Highlighter
) => {
  const key = `${lang}|${code}`;

  if (!processedResultStore.has(key)) {
    processedResultStore.set(
      key,
      new Fetcher(async () => {
        let tokenId = 0;

        const lines = processor.codeToThemedTokens(code, lang);

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
  line: ShikiTokenWithId[];
  selectedToken?: ShikiTokenWithId;
  selectToken: (token: ShikiTokenWithId) => void;
  isStatic?: boolean;
}) {
  return (
    <>
      <span className="line">
        {line.map((token) => (
          <span
            style={{ color: token.color }}
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
}: {
  lines: ShikiTokenWithId[][];
  selectedToken?: ShikiTokenWithId;
  selectToken?: (token: ShikiTokenWithId) => void;
  isStatic?: boolean;
}) {
  return (
    <pre className="shiki github-dark" style={{ backgroundColor: "#24292e" }}>
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

export default function ShikiTokenPreview({
  lang,
  code,
}: {
  lang?: string | null;
  code: string;
}) {
  const deferredLang = useDeferredValue(lang);
  const deferredCode = useDeferredValue(code);
  const processor = getProcessor(deferredLang);
  const lines = getProcessedTokensResult(deferredLang, deferredCode, processor);
  const [selectedToken, _selectToken] = useState<ShikiTokenWithId>(lines[0][0]);
  const selectToken = useCallback((token) => {
    startTransition(() => _selectToken(token));
  }, []);

  const jsonProcessor = getProcessor("json");

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
    jsonProcessor
  );

  const jsonHtml = useMemo(
    () => <Lines lines={jsonLines} isStatic />,
    [jsonLines]
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
        <$.p
          $backgroundColor="#24292e"
          $margin={0}
          $padding="15px 15px 0"
          $display="flex"
          $gap="8px"
          $borderRadius="6px 6px 0 0"
          $alignItems="center"
        >
          <Dot color="#ff5f56" />
          <Dot color="#ffbd2d" />
          <Dot color="#26c940" />
          <$.span $color="#a39d9d" $fontSize="12px">
            {lang}
          </$.span>
        </$.p>
        <$.div className={styles.code} $flexShrink={1} $overflow="auto">
          <Lines
            lines={lines}
            selectToken={selectToken}
            selectedToken={selectedToken}
          />
        </$.div>
        <$.p
          $backgroundColor="#24292e"
          $margin={0}
          $padding="10px 10px 0"
          $display="flex"
          $gap="8px"
          $borderRadius="0 0 6px 6px"
        ></$.p>
      </Column>
      <Column $flexGrow={1} $flexBasis={0} $flexShrink={1} $height={0}>
        <Text type="body">Selected Token:</Text>
        <$.div $flex="1 1 0" $overflow="auto">
          <Lines lines={jsonLines} isStatic />
        </$.div>
      </Column>
    </Column>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <$.span
      $backgroundColor={color}
      $width="12px"
      $height="12px"
      $display="inline-block"
      $borderRadius="15px"
    ></$.span>
  );
}
