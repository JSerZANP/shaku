import { $ } from "migacss";
import { useRef } from "react";
import { highlight } from "shaku-code-annotate-sugar-high";
import { View } from "./bare";

export default function CodeSnippetPreviewSugarHigh({
  lang,
  code,
}: {
  lang?: string | null;
  code: string;
}) {
  const preview = highlight(code);
  const refPreview = useRef<HTMLDivElement>(null);

  return (
    <View $flex="1 0 0">
      <View
        $minWidth={400}
        $width="max-content"
        // @ts-ignore
        ref={refPreview}
        $backgroundColor="#fff"
      >
        <$.div
          $whiteSpace="pre-wrap"
          $fontFamily="var(--font-code)"
          $fontSize={"14px"}
          dangerouslySetInnerHTML={{ __html: preview }}
        ></$.div>
      </View>
    </View>
  );
}
