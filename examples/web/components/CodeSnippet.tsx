"use client";

import withShiki from "@stefanprobst/remark-shiki";

import { Editor } from "@monaco-editor/react";
import domtoimage from "dom-to-image";
import { useEffect, useRef, useState } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { remark } from "remark";
import html from "remark-html";
import { remarkShakuCodeAnnotate } from "remark-shaku-code-annotate";
import * as shiki from "shiki";
import styles from "./CodeSnippet.module.css";
import { Button, Column, Row, Text, View } from "./bare";

const defaultCode = `// @dim
import { useState } from 'react';

export default function Counter() {
  // @highlight
  const [count, setCount] = useState(0);
              //~~~~~~~~

  function handleClick() {
    setCount(count + 1);
  //-------------------
  //     ^
  //[This is super important!]
  }

  return (
    <button onClick={handleClick}>
    {/*       ^           */}
    {/* [Supports JSX] */}
    {/* [Awesome,right?] */}
      You pressed me {count} times
    </button>
  );
}`;

function getProcessor() {
  return shiki
    .getHighlighter({
      theme: "github-dark",
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
          theme: "github-dark",
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

export function CodeSnippet({ code: _code }: { code?: string }) {
  const [code, setCode] = useState(_code ?? defaultCode);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    getProcessor().then((processor) =>
      processor.process(`\`\`\`js annotate\n${code}\n\`\`\``).then((data) => {
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

  const refPreview = useRef<HTMLDivElement>(null);

  const download = () => {
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

          // const width = canvas.width;
          // const height = canvas.height;

          // ctx.beginPath();
          // ctx.moveTo(0, 6);
          // ctx.arcTo(0, 0, width, 0, 6);
          // ctx.lineTo(width - 6, 0);
          // ctx.arcTo(width, 0, width, height, 6);
          // ctx.lineTo(width, height - 6);
          // ctx.arcTo(width, height, 0, height, 6);
          // ctx.lineTo(6, height);
          // ctx.arcTo(0, height, 0, 0, 6);
          // ctx.lineTo(0, 6);
          // ctx.clip();

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
  };
  return (
    <Column height={"100vh"} padding={12} gap={12}>
      <View>
        <Text type="headline1">Shaku Snippet</Text>
        <Text type="body">
          Annotate code snippet with{" "}
          <a
            href="https://github.com/JSerZANP/shaku/tree/main/packages/shaku-code-annotate"
            target="_blank"
          >
            Shaku Code Annotate
          </a>{" "}
          and share it with the world! <a href="/">see all syntax</a>
        </Text>
      </View>

      <Row gap={10} flex="1 0 0 ">
        <View flex="1 0 0" maxWidth={600}>
          <Editor
            language="javascript"
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
        </View>
        <View flex="1 0 0">
          <Row justifyContent="space-between" marginBottom="1rem">
            <Text type="headline4">Preview</Text>
            <Button
              onClick={download}
              label="Download"
              icon={<AiOutlineDownload />}
            ></Button>
          </Row>
          <View
            ref={refPreview}
            padding="50px 50px"
            minWidth={400}
            backgroundColor="#d3efff"
            width="min-content"
          >
            <View flex="0 0 0" width="max-content" margin="auto auto">
              <p className={styles.previewHeader}>
                <span
                  className={styles.dot}
                  style={{ backgroundColor: "#ff5f56" }}
                ></span>
                <span
                  className={styles.dot}
                  style={{ backgroundColor: "#ffbd2d" }}
                ></span>

                <span
                  className={styles.dot}
                  style={{ backgroundColor: "#26c940" }}
                ></span>
              </p>
              <div
                className={styles.code}
                dangerouslySetInnerHTML={{ __html: preview }}
              ></div>
              <p className={styles.previewFooter}></p>
            </View>
          </View>
        </View>
      </Row>
    </Column>
  );
}
