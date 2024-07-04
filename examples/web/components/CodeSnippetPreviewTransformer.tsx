import { useDeferredValue, useState } from "react";

import rehypeShiki from "@shikijs/rehype";
import domtoimage from "dom-to-image";
import { $ } from "migacss";
import { useCallback, useRef } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import shakuCodeAnnotateShikiTransformer from "shaku-code-annotate-shiki-transformer";
import * as shiki from "shiki";
import { unified } from "unified";
import styles from "./CodeSnippet.module.css";
import { Fetcher } from "./Fetcher";
import { Button, Row, Text, View } from "./bare";

const themes = [
  {
    name: "blue",
    background: "#d3efff",
    cssVars: {
      "--color-shaku-highlight-dark": "#2b4a70",
      "--color-shaku-callout-dark": "#0685ce",
      "--color-shaku-underline-dark": "#0893e3",
    },
  },
  {
    name: "purple",
    background: "#fddbfd",
    cssVars: {
      "--color-shaku-highlight-dark": "#656065",
      "--color-shaku-callout-dark": "#df1fdf",
      "--color-shaku-underline-dark": "#e221e2",
    },
  },
  {
    name: "green",
    background: "#dbfdeb",
    cssVars: {
      "--color-shaku-highlight-dark": "#424a46",
      "--color-shaku-callout-dark": "#09984a",
      "--color-shaku-underline-dark": "#09984a",
    },
  },
  {
    name: "yellow",
    background: "#f9fddb",
    cssVars: {
      "--color-shaku-highlight-dark": "#3e3f36",
      "--color-shaku-callout-dark": "#738200",
      "--color-shaku-underline-dark": "#738200",
    },
  },
  {
    name: "red",
    background: "#fddbdb",
    cssVars: {
      "--color-shaku-highlight-dark": "#3e3f36",
      "--color-shaku-callout-dark": "#940000",
      "--color-shaku-underline-dark": "#d01212",
    },
  },
] as const;

const unifiedProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype) // this sanitize html by default
  .use(rehypeStringify);

function fetchProcessor(lang) {
  return shiki
    .getHighlighter({
      theme: "github-dark",
      langs: [lang],
      paths: {
        themes: "/_next/static/shiki/themes",
        wasm: "/_next/static/shiki/dist",
        languages: "/_next/static/shiki/languages",
      },
    })
    .then((highlighter) =>
      unified()
        .use(remarkParse)
        .use(remarkRehype)
        // @ts-ignore
        .use(rehypeShiki, {
          includeExplanation: true,
          transformers: [
            shakuCodeAnnotateShikiTransformer({
              useDangerousRawHtml: true,
              markdownToHtmlAndSanitize: (code) =>
                unifiedProcessor.processSync(code).toString(),
            }),
          ],
          // TODO: patch shiki to support multiple themes
          // currently shiki doesn't return explanations if `themes` is used
          theme: "github-dark",
        })
        .use(rehypeStringify)
    );
}

const processorStore = new Map<string, Fetcher<ReturnType<typeof unified>>>();
const getProcessor = (lang: string) => {
  if (!processorStore.has(lang)) {
    // @ts-ignore
    processorStore.set(lang, new Fetcher(() => fetchProcessor(lang)));
  }
  return processorStore.get(lang).fetch();
};

const processedResultStore = new Map<string, Fetcher<string>>();
const getProcessedResult = (
  lang: string,
  code: string,
  processor: ReturnType<typeof remark>
) => {
  const key = `${lang}|${code}`;

  if (!processedResultStore.has(key)) {
    processedResultStore.set(
      key,
      new Fetcher(() =>
        processor
          .process(`\`\`\`${lang} annotate\n${code}\n\`\`\``)
          .then((data) => {
            return data.toString();
          })
      )
    );

    if (processedResultStore.size > 5) {
      const firstResultKey = processedResultStore.entries().next().value.key;
      processedResultStore.delete(firstResultKey);
    }
  }
  return processedResultStore.get(key).fetch();
};

export default function CodeSnippetPreview({
  lang,
  code,
}: {
  lang?: string | null;
  code: string;
}) {
  const [selectedTheme, setTheme] = useState<(typeof themes)[number]>(
    themes[0]
  );
  const [showLogo, setShowLogo] = useState(true);

  const deferredLang = useDeferredValue(lang);
  const deferredCode = useDeferredValue(code);
  const processor = getProcessor(deferredLang);
  // @ts-ignore
  const preview = getProcessedResult(deferredLang, deferredCode, processor);

  const refPreview = useRef<HTMLDivElement>(null);

  const download = useCallback(() => {
    const elPreview = refPreview.current;
    if (elPreview == null) return;
    const offsetWidth = elPreview.offsetWidth;
    const offsetHeight = elPreview.offsetHeight;

    domtoimage
      .toSvg(elPreview, {
        width: offsetWidth * 2,
        height: offsetHeight * 2,
        style: {
          transform: "scale(2)",
          transformOrigin: "0 0",
        },
      })
      .then((dataUrl) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          // render the svg to canvas 2x
          // then export to blob
          const canvas = document.createElement("canvas");

          // document.body.append(canvas)
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            0,
            0,
            canvas.width,
            canvas.height
          );
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            link.download = "shaku.png";

            // It needs to be added to the DOM so it can be clicked
            document.body.appendChild(link);
            link.click();

            // To make this work on Firefox we need to wait
            // a little while before removing it.
            setTimeout(() => {
              URL.revokeObjectURL(link.href);
              link.parentNode.removeChild(link);
            }, 0);
          }, "image/png");
        };
      });

    return;
  }, []);

  return (
    <View $flex="1 0 0">
      <Row
        $justifyContent="flex-start"
        $marginBottom="1rem"
        $gap={12}
        $alignItems="center"
      >
        <Text type="headline4">Preview</Text>

        {themes.map((theme) => (
          <ThemePicker
            key={theme.name}
            name={theme.name}
            background={theme.background}
            selected={selectedTheme === theme}
            onClick={() => setTheme(theme)}
          ></ThemePicker>
        ))}
        <label htmlFor="showlogo">
          <input
            id="showlogo"
            type="checkbox"
            checked={showLogo}
            onChange={(e) => setShowLogo(e.currentTarget.checked)}
          />
          show logo
        </label>
        <Button
          onClick={download}
          label="Download"
          icon={<AiOutlineDownload />}
        ></Button>
      </Row>
      <View
        $padding="40px 40px 10px 40px"
        $minWidth={400}
        $backgroundColor={selectedTheme.background}
        $width="min-content"
        // @ts-ignore
        style={{ ...selectedTheme.cssVars }}
        ref={refPreview}
      >
        <View $flex="0 0 0" $width="max-content" $margin="auto auto">
          <$.p
            $backgroundColor="#15202b"
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
          <div
            className={styles.code}
            dangerouslySetInnerHTML={{ __html: preview }}
          ></div>
          <$.p
            $backgroundColor="#15202b"
            $margin={0}
            $padding="10px 10px 0"
            $display="flex"
            $gap="8px"
            $borderRadius="0 0 6px 6px"
          ></$.p>
          <$.p
            $color="rgba(0,0,0,0.2)"
            $textAlign="center"
            $width="100%"
            $fontWeight="bold"
            $margin="10px"
            $fontSize="12px"
            $height="10px"
          >
            {showLogo ? "Shaku Snippet" : ""}
          </$.p>
        </View>
      </View>
    </View>
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

function ThemePicker({
  onClick,
  name,
  selected,
  background,
}: {
  onClick: () => void;
  name: string;
  selected?: boolean;
  background: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={name}
      style={{
        border: selected ? "1px solid #000" : 0,
        width: "20px",
        height: "20px",
        display: "inline-block",
        background,
      }}
    ></button>
  );
}
