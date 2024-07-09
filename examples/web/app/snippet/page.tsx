import Head from "next/head";
import { CodeSnippet } from "../../components/CodeSnippet";

const langMap = {
  js: "javascript",
  ts: "typescript",
  yml: "yaml",
  rb: "ruby",
  rs: "rust",
  ps1: "powershell",
  fs: "f#",
  fsharp: "f#",
  docker: "dockerfile",
  bat: "batch",
};
function getCanonicalLang(lang?: string | null) {
  if (lang == null) return null;
  return langMap[lang] ?? lang;
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const codeFromParams = searchParams?.code;
  const langFromParams = searchParams?.lang;
  const code = typeof codeFromParams === "string" ? codeFromParams : null;
  const lang = getCanonicalLang(
    typeof langFromParams === "string" ? langFromParams : null
  );

  return (
    <>
      <Head>
        <title>Shaku Code Snippet</title>
      </Head>
      <CodeSnippet code={code} lang={lang} />
    </>
  );
}
