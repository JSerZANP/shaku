import Head from "next/head";
import { Playground } from "../components/Playground";

export default async function Page() {
  return (
    <>
      <Head>
        <title>shaku-code-annotate playground</title>
      </Head>
      <Playground />
    </>
  );
}
