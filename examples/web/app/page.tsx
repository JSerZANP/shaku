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

  const blog = "https://jser.dev"
  //                    ^
  //       [JSer.dev is the homepage for JSer.]
  //       [Check it out!]
  
  // This is normal comments from source code.
  const blog = "https://jser.dev"
  //                    ~~~~~~~~
  //       [JSer.dev is the homepage for JSer.]
  //       [Check it out!]
  
  const blog = "jser.dev"
  //            --------
  //          [Check it out!]
  
  const blog = "jser.dev"
  //            ........
  //          [Check it out!]
  
  // Code blocks work well too!
  /*             ^
          [Yes! That's right!]
  */
  
  const blog = "jser.dev"
  //            ........
  
  const blog = "jser.dev"
  //            --------
  const blog = "jser.dev"
  //            ~~~~~~~~
  
  // @highlight
  function useSomeEffect({blog}) {
  //       ~~~~~~~~~~~~~
    useEffect(() => {
      // do some stuff
      
  // @highlight start
        return () => {
          location.href = 'https://jser.dev'
        }
  //    ^
  // [This cleanup function is super important]
  // @highlight end
  
      }, [blog])
  }
  \`\`\`
`;

  const markdownShaku = `
\`\`\`js annotate

const blog = "https://jser.dev"
//                    ^
//       [JSer.dev is the homepage for JSer.]
//       [Check it out!]

// This is normal comments from source code.
const blog = "https://jser.dev"
//                    ~~~~~~~~
//       [JSer.dev is the homepage for JSer.]
//       [Check it out!]

const blog = "jser.dev"
//            --------
//          [Check it out!]

const blog = "jser.dev"
//            ........
//          [Check it out!]

// Code blocks work well too!
/*             ^
        [Yes! That's right!]
*/

const blog = "jser.dev"
//            ........

const blog = "jser.dev"
//            --------
const blog = "jser.dev"
//            ~~~~~~~~

// @highlight
function useSomeEffect({blog}) {
//       ~~~~~~~~~~~~~
  useEffect(() => {
    // do some stuff
    
// @highlight start
      return () => {
        location.href = 'https://jser.dev'
      }
//    ^
// [This cleanup function is super important]
// @highlight end

    }, [blog])
}
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
            what you write (highlight with <a href="https://github.com/stefanprobst/remark-shiki" target="blank">remark-shiki</a>)
            <div dangerouslySetInnerHTML={{ __html: resultShiki.value }}></div>
          </div>
          <div style={{ flexGrow: 1 }}>
            what you see (highlight with <a href="https://github.com/JSerZANP/shaku/tree/main/packages/remark-shaku-code-annotate" target="_blank">remark-shaku-code-annotate</a>, control how it looks by CSS)
            <div dangerouslySetInnerHTML={{ __html: resultShaku.value }}></div>
          </div>
        </div>
      </body>
    </>
  );
}
