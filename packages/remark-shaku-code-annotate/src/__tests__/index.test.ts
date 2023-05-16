import { assert, expect, test } from "vitest";
import codeTitle from "remark-code-title";
import html from "remark-html";
import { remark } from "remark";
import { remarkShakuCodeAnnotate } from "../index";

async function process(md: string) {
  const processor = remark()
    .use(remarkShakuCodeAnnotate)
    .use(html, { sanitize: false });
  const result = await processor.process(md);
  return result;
}

test("should not apply annotation without meta", async () => {
  const result = await process(`
\`\`\`js 
const a = 1;
//    ^
//    [This is line 1]
//    [This is line two]
\`\`\`
`);

  expect(result.value).toEqual(`<pre><code class="language-js">const a = 1;
//    ^
//    [This is line 1]
//    [This is line two]
</code></pre>
`);
});

test("able to render callout: ^", async () => {
  const result = await process(`
\`\`\`js annotate
const a = 1;
//    ^
//    [This is line 1]
//    [This is line two]
\`\`\`
`);
  expect(result.value)
    .toEqual(`<pre class="shiki" style="color:#24292e;background-color:#fff"><div class="code-container"><code><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">a</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="shaku-callout" style="left:6ch"><span class="shaku-callout-arrow" style="left:0ch"></span>This is line 1
This is line two</div></code></div></pre>
`);
});
