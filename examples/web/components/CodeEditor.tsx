"use client";

import Editor from "@monaco-editor/react";

export function CodeEditor({
  defaultValue,
  onChange,
}: {
  defaultValue: string;
  onChange: (value: string) => void;
}) {
  return (
    <Editor
      defaultLanguage="markdown"
      defaultValue={defaultValue}
      onChange={() => {}}
    />
  );
}
