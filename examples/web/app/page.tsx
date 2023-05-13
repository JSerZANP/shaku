import withShiki from "@stefanprobst/remark-shiki";
import Head from "next/head";
import { remark } from "remark";
import html from "remark-html";
import { remarkShakuCodeAnnotate } from "remark-shaku-code-annotate";
import * as shiki from "shiki";

export default async function Page() {
  const highlighter = await shiki.getHighlighter({ theme: "github-light" });
  const processorShaku = remark()
    .use(remarkShakuCodeAnnotate, { theme: "github-light" })
    .use(html, { sanitize: false });

  const processorShiki = remark()
    .use(withShiki, { highlighter })
    .use(html, { sanitize: false });

  const markdownCode = `
\`\`\`js

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

  const markdownShaku = `
\`\`\`js annotate

  const b = "jser.dev"
//         ^
//       [<b>s</b>JSer.dev is a good blog]
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

  const resultShiki = await processorShiki.process(markdownCode);
  const resultShaku = await processorShaku.process(markdownShaku);

  return (
    <>
      <Head>
        <title>shaku-code-annotate demo</title>
      </Head>
      <body>
        <h1>shaku-code-annotate example</h1>
        <div style={{ display: "flex" }}>
          <div style={{ flexGrow: 1 }}>
            what you write (highlight with `remark-shiki`)
            <div dangerouslySetInnerHTML={{ __html: resultShiki.value }}></div>
          </div>
          <div style={{ flexGrow: 1 }}>
            what you see (highlight with `remark-shaku-code-annotate`)
            <div dangerouslySetInnerHTML={{ __html: resultShaku.value }}></div>
          </div>
        </div>
      </body>
    </>
  );
}
