"use client";

import { Editor } from "@monaco-editor/react";
import { $ } from "migacss";
import { useState } from "react";
import { BsStars } from "react-icons/bs";
import { defaultCode } from "remark-shaku-code-annotate";
import { Column, Row, Text, View } from "../bare";
import SugarHighPreview from "./SugarHighPreview";

export function SugarHigh({
  code: _code,
  lang: _lang,
}: {
  code?: string;
  lang?: string;
}) {
  const lang = "javascript";
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
          <Text type="headline1">Shaku Snippet &times; Sugar High</Text>
          <$.a href="/" $textDecoration="none">
            <Text type="headline5" $color="#0e67e4">
              <BsStars />
              Shaku Playground →
            </Text>
          </$.a>
        </Row>
        <Text type="body">
          <a href="https://github.com/huozhi/sugar-high">Sugar High</a> is a
          super lightweight syntax highlighter for JS/JSX, Shaku could be
          enabled through{" "}
          <a href="https://github.com/JSerZANP/shaku/tree/main/packages/shaku-code-annotate-sugar-high">
            shaku-code-annotate-sugar-high
          </a>
          . created by <a href="https://twitter.com/JSer_ZANP">JSer</a>.
        </Text>
      </View>

      <Row $gap={20} $flex="1 0 0 ">
        <Column $flex="1 0 0" $maxWidth={600}>
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
        <SugarHighPreview code={code} lang={lang} />
      </Row>
    </Column>
  );
}
