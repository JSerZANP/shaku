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
  console.log("preview", preview);
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
