import Head from "next/head";
import { SugarHigh } from "../../components/SugarHigh/SugarHigh";

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
        <title>Shaku x Sugar High</title>
      </Head>
      <SugarHigh code={code} lang={lang} />
    </>
  );
}
