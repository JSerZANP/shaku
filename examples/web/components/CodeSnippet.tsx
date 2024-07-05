"use client";

import { Editor } from "@monaco-editor/react";
import { $ } from "migacss";
import dynamic from "next/dynamic";
import { useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import { RiShareBoxLine } from "react-icons/ri";
import { defaultCode } from "remark-shaku-code-annotate";
import { Button, Column, Row, Text, View } from "./bare";

const CodeSnippetPreview = dynamic(() => import("./CodeSnippetPreview"), {
  ssr: false,
});

const CodeSnippetPreviewTransformer = dynamic(
  () => import("./CodeSnippetPreviewTransformer"),
  {
    ssr: false,
  }
);

const supportedLangs = Object.keys(defaultCode);

export function CodeSnippet({
  code: _code,
  lang: _lang,
  useTransformer,
}: {
  code?: string;
  lang?: string;
  useTransformer?: boolean;
}) {
  const [lang, setLang] = useState<string>(_lang ?? "javascript");
  const [code, setCode] = useState(_code ?? defaultCode[lang] ?? "");

  const share = () => {
    const query =
      "code=" + encodeURIComponent(code) + "&lang=" + encodeURIComponent(lang);
    const url = location.origin + "/snippet?" + query;
    const type = "text/plain";
    const blob = new Blob([url], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    navigator.clipboard.write(data).then(
      () => alert("link copied"),
      () => alert("failed to copy link.")
    );
  };
  return (
    <Column $height={"100vh"} $padding={12} $gap={12}>
      <View>
        <Row $alignItems="center" $justifyContent="space-between" $gap={20}>
          <Text type="headline1">
            Shaku Snippet{" "}
            <$.a
              href="https://github.com/JSerZANP/shaku"
              target="_blank"
              $fontSize={20}
              $marginLeft={12}
            >
              <AiFillGithub />
            </$.a>
          </Text>
          <$.a href="/" $textDecoration="none">
            <Text type="headline5" $color="#0e67e4">
              <BsStars />
              Shaku →
            </Text>
          </$.a>
        </Row>
        <Text type="body">
          Annotate code snippet with <a href="/">Shaku Code Annotate Syntax</a>{" "}
          and share it with the world! Created by{" "}
          <a href="https://twitter.com/JSer_ZANP">JSer</a>.
        </Text>
      </View>

      <Row $gap={20} $flex="1 0 0 ">
        <Column $flex="1 0 0" $maxWidth={600}>
          <Row $marginBottom="1.5rem">
            <select
              value={lang}
              // @ts-ignore
              onChange={(e) => {
                const newLang = e.currentTarget.value;
                setLang(newLang);
                setCode(defaultCode[newLang]);
              }}
            >
              {supportedLangs.map((lang) => (
                <option value={lang} key={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <Button
              onClick={share}
              label="Share page with below code"
              icon={<RiShareBoxLine />}
            ></Button>
          </Row>
          <Editor
            language={lang}
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
        </Column>
        {useTransformer ? (
          <CodeSnippetPreviewTransformer code={code} lang={lang} />
        ) : (
          <CodeSnippetPreview code={code} lang={lang} />
        )}
      </Row>
    </Column>
  );
}
