import Head from "next/head";
import { Playground } from "../../components/Playground";

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
        <title>shaku-code-annotate playground</title>
      </Head>
      <Playground code={code} />
    </>
  );
}
