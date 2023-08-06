import Head from "next/head";
import { CodeSnippet } from "../../components/CodeSnippet";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const codeFromParams = searchParams?.code;
  const code = typeof codeFromParams === "string" ? codeFromParams : null;
  return (
    <>
      <Head>
        <title>Shaku Code Snippet</title>
      </Head>
      <CodeSnippet code={code} />
    </>
  );
}
