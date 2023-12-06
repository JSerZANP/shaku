import Head from "next/head";
import { SugarHighTokenInspector } from "./SugarHighTokenInspector";

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
        <title>Sugar High Token Visualizer</title>
      </Head>
      <SugarHighTokenInspector code={code} lang={lang} />
    </>
  );
}
