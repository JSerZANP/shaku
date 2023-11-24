import Head from "next/head";
import { ShikiTokenInspector } from "../../components/ShikiTokenInspector/ShikiTokenInspector";

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
        <title>Shiki Token Visualizer</title>
      </Head>
      <ShikiTokenInspector code={code} lang={lang} />
    </>
  );
}
