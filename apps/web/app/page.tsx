import Head from 'next/head';
import { remark } from "remark";
import { remarkCodeAnnotate } from 'remark-code-annotate';
import html from "remark-html";

export default async function Page() {
    
  const processor = remark().use(remarkCodeAnnotate).use(html, { sanitize: false });
  const markdown = `
\`\`\`js annotate
// This is a comment from source code
const a = 3;
//    ^ This is annotation from tech writer.
const b = "JSer.dev"
//           ^ JSer.dev is a really cool blog.

const processor = remark().use(remarkCodeAnnotate).use(html, { sanitize: false });
//                         ^---------------------- This is important                

const processor = remark().use(remarkCodeAnnotate).use(html, { sanitize: false });
//                         ^~~~~~~~~~~~~~~~~~~~~~~ This is important   

const processor = remark().use(remarkCodeAnnotate).use(html, { sanitize: false });
//                         ^~~~~~~~~~~~~~~~~~~~~~~ Visit [jser.dev] for more

const processor = remark().use(remarkCodeAnnotate).use(html, { sanitize: false });
//^<< To move the arrow left

const processor = remark().use(remarkCodeAnnotate).use(html, { sanitize: false });
//^<< To move the arrow left


\`\`\`
`
  const result = await processor.process(markdown);

  console.log(result.value)
  return (
    <>
      <Head>
        <title>My page title</title>
      </Head>
      <body>
        <div dangerouslySetInnerHTML={{__html: result.value}}></div>
      </body>
    </>
  )
}