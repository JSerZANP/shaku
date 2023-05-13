import Head from "next/head";
import { remark } from "remark";
import html from "remark-html";
import { remarkShakuCodeAnnotate } from "remark-shaku-code-annotate";

export default async function Page() {
  const processor = remark()
    .use(remarkShakuCodeAnnotate)
    .use(html, { sanitize: false });
  const markdown = `
\`\`\`js annotate

  const b = "jser.dev"
//         ^
//       [JSer.dev is a good blog]
//       [you know you can do better, right?]

  const b = "jser.dev"
//           ~~~~~~~~
//       [jser.dev is a good blog]
//       [you know you can do better, right?]

  const b = "jser.dev"
//           --------
//       [jser.dev is a good blog]

  const b = "jser.dev"
//           ........
//       [jser.dev is a good blog]


  const b = "jser.dev"
//           ........

  const b = "jser.dev"
//           --------
  const b = "jser.dev"
//           ~~~~~~~~




// @highlight
  const a = 1;
  const b = 2;

// @highlight start
  function a() {
    
  }
// @highlight end

  \`\`\`
`;
  const result = await processor.process(markdown);

  return (
    <>
      <Head>
        <title>My page title</title>
      </Head>
      <body>
        <div dangerouslySetInnerHTML={{ __html: result.value }}></div>
      </body>
    </>
  );
}
