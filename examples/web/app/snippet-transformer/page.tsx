import Head from "next/head";
import { CodeSnippet } from "../../components/CodeSnippet";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const codeFromParams = searchParams?.code;
  const langFromParams = searchParams?.lang;
  const code = typeof codeFromParams === "string" ? codeFromParams : null;
  const lang = typeof langFromParams === "string" ? langFromParams : null;

  return (
    <>
      <Head>
        <title>Shaku Code Snippet</title>
      </Head>
      <CodeSnippet code={code} lang={lang} useTransformer />
    </>
  );
}
