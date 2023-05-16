import { expect, test } from "vitest";
import html from "remark-html";
import { remark } from "remark";
import { remarkShakuCodeAnnotate } from "../index";

async function process(md: string) {
  const processor = remark()
    .use(remarkShakuCodeAnnotate, {
      theme: 'github-light'
    })
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

test("able to render solid underline: ----", async () => {
  const result = await process(`
\`\`\`js annotate
const a = 1;
//    -----
//    [This is line 1]
//    [This is line two]
\`\`\`
`);
  expect(result.value)
    .toEqual(`<pre class="shiki" style="color:#24292e;background-color:#fff"><div class="code-container"><code><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">a</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="shaku-underline shaku-underline-solid" style="left:6ch"><span class="shaku-underline-line" style="left:0ch">-----</span>This is line 1
This is line two</div></code></div></pre>
`);
});

test("able to render dotted underline: .....", async () => {
  const result = await process(`
\`\`\`js annotate
const a = 1;
//    .....
//    [This is line 1]
//    [This is line two]
\`\`\`
`);
  expect(result.value)
    .toEqual(`<pre class="shiki" style="color:#24292e;background-color:#fff"><div class="code-container"><code><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">a</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="shaku-underline shaku-underline-dotted" style="left:6ch"><span class="shaku-underline-line" style="left:0ch">.....</span>This is line 1
This is line two</div></code></div></pre>
`);
});


test("able to render wavy underline: ~~~~~ ", async () => {
  const result = await process(`
\`\`\`js annotate
const a = 1;
//    ~~~~~
//    [This is line 1]
//    [This is line two]
\`\`\`
`);
  expect(result.value)
    .toEqual(`<pre class="shiki" style="color:#24292e;background-color:#fff"><div class="code-container"><code><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">a</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="shaku-underline shaku-underline-wavy" style="left:6ch"><span class="shaku-underline-line" style="left:0ch">~~~~~</span>This is line 1
This is line two</div></code></div></pre>
`);
});


test("able to render underline without comments ", async () => {
  const result = await process(`
\`\`\`js annotate
const a = 1;
//    -----
const b = 1;
//    .....
const c = 1;
//    ~~~~~
\`\`\`
`);
  expect(result.value)
    .toEqual(`<pre class="shiki" style="color:#24292e;background-color:#fff"><div class="code-container"><code><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">a</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="shaku-underline shaku-underline-solid" style="left:6ch"><span class="shaku-underline-line" style="left:0ch">-----</span></div><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">b</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="shaku-underline shaku-underline-dotted" style="left:6ch"><span class="shaku-underline-line" style="left:0ch">.....</span></div><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">c</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="shaku-underline shaku-underline-wavy" style="left:6ch"><span class="shaku-underline-line" style="left:0ch">~~~~~</span></div></code></div></pre>
`);
});



test("able to render highlight ", async () => {
  const result = await process(`
\`\`\`js annotate

// @highlight
const a = 1;

// @highlight start
const b = 1;
const c = 1;
// @highlight end

\`\`\`
`);
  expect(result.value)
    .toEqual(`<pre class="shiki" style="color:#24292e;background-color:#fff"><div class="code-container"><code><div class="line"></div><div class="line highlight"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">a</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="line"></div><div class="line highlight"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">b</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="line highlight"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">c</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="line"></div></code></div></pre>
`);
});


