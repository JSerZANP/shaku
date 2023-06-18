import { expect, test } from "vitest";
import html from "remark-html";
import { remark } from "remark";
import { remarkShakuCodeAnnotate } from "../index";

async function process(md: string) {
  const processor = remark()
    .use(remarkShakuCodeAnnotate, {
      theme: "github-light",
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
  const result1 = await process(`
\`\`\`js annotate
const a = 1;
//    ^
//    [This is line 1]
//    [This is line two]
\`\`\`
`);

  const result2 = await process(`
\`\`\`js annotate
const a = 1;
/*    ^ 
      [This is line 1] 
      [This is line two] */
\`\`\`
`);

  const result3 = await process(`
\`\`\`js annotate
const a = 1;
/*    ^  */
  //  [This is line 1] 
   /* [This is line two] */
\`\`\`
`);
  const expected = `<pre class="shiki" style="color:#24292e;background-color:#fff"><div class="code-container"><code><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">a</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="shaku-callout" style="left:6ch"><span class="shaku-callout-arrow" style="left:0ch"></span><p>This is line 1</p><p>This is line two</p></div></code></div></pre>
`;
  expect(result1.value).toEqual(expected);
  expect(result2.value).toEqual(expected);
  expect(result3.value).toEqual(expected);
});

test("able to render solid underline: ----", async () => {
  const result1 = await process(`
\`\`\`js annotate
const a = 1;
//    -----
//    [This is line 1]
//    [This is line two]
\`\`\`
`);
  const result2 = await process(`
\`\`\`js annotate
const a = 1;
   /* -----   */
  /*  [This is line 1] 
      [This is line two] */
\`\`\`
`);

  const expected = `<pre class="shiki" style="color:#24292e;background-color:#fff"><div class="code-container"><code><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">a</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="shaku-underline shaku-underline-solid" style="left:6ch"><span class="shaku-underline-line" style="left:0ch">-----</span><p>This is line 1</p><p>This is line two</p></div></code></div></pre>
`;
  expect(result1.value).toEqual(expected);
  expect(result2.value).toEqual(expected);
});

test("able to render dotted underline: .....", async () => {
  const result1 = await process(`
\`\`\`js annotate
const a = 1;
//    .....
//    [This is line 1]
//    [This is line two]
\`\`\`
`);
  const result2 = await process(`
\`\`\`js annotate
const a = 1;
   /* ..... */
  /*  [This is line 1]
      [This is line two] */
\`\`\`
`);
  const expected = `<pre class="shiki" style="color:#24292e;background-color:#fff"><div class="code-container"><code><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">a</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="shaku-underline shaku-underline-dotted" style="left:6ch"><span class="shaku-underline-line" style="left:0ch">.....</span><p>This is line 1</p><p>This is line two</p></div></code></div></pre>
`;
  expect(result1.value).toEqual(expected);
  expect(result2.value).toEqual(expected);
});

test("able to render wavy underline: ~~~~~ ", async () => {
  const result1 = await process(`
\`\`\`js annotate
const a = 1;
//    ~~~~~
//    [This is line 1]
//    [This is line two]
\`\`\`
`);

  const result2 = await process(`
\`\`\`js annotate
const a = 1;
   /* ~~~~~ */
  /*  [This is line 1] */
   /* [This is line two] */
\`\`\`
`);

  const expected = `<pre class="shiki" style="color:#24292e;background-color:#fff"><div class="code-container"><code><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">a</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="shaku-underline shaku-underline-wavy" style="left:6ch"><span class="shaku-underline-line" style="left:0ch">~~~~~</span><p>This is line 1</p><p>This is line two</p></div></code></div></pre>
`;
  expect(result1.value).toEqual(expected);
  expect(result2.value).toEqual(expected);
});

test("able to render underline without comments ", async () => {
  const result1 = await process(`
\`\`\`js annotate
const a = 1;
//    -----
const b = 1;
//    .....
const c = 1;
//    ~~~~~
\`\`\`
`);

  const result2 = await process(`
\`\`\`js annotate
const a = 1;
  /*  ----- */
const b = 1;
   /* ..... */
const c = 1;
    /*~~~~~ */
\`\`\`
`);
  const expected = `<pre class="shiki" style="color:#24292e;background-color:#fff"><div class="code-container"><code><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">a</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="shaku-underline shaku-underline-solid" style="left:6ch"><span class="shaku-underline-line" style="left:0ch">-----</span></div><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">b</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="shaku-underline shaku-underline-dotted" style="left:6ch"><span class="shaku-underline-line" style="left:0ch">.....</span></div><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">c</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="shaku-underline shaku-underline-wavy" style="left:6ch"><span class="shaku-underline-line" style="left:0ch">~~~~~</span></div></code></div></pre>
`;
  expect(result1.value).toEqual(expected);
  expect(result2.value).toEqual(expected);
});

test("able to render highlight ", async () => {
  const result1 = await process(`
\`\`\`js annotate

// @highlight
const a = 1;

// @highlight start
const b = 1;
const c = 1;
// @highlight end

\`\`\`
`);

  const result2 = await process(`
\`\`\`js annotate

/* @highlight */
const a = 1;

/*  @highlight start */
const b = 1;
const c = 1;
/*  @highlight end */

\`\`\`
`);

  const expected = `<pre class="shiki" style="color:#24292e;background-color:#fff"><div class="code-container"><code><div class="line"></div><div class="line highlight"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">a</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="line"></div><div class="line highlight"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">b</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="line highlight"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">c</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="line"></div></code></div></pre>
`;
  expect(result1.value).toEqual(expected);

  expect(result2.value).toEqual(expected);
});

test("able to render dim ", async () => {
  const result1 = await process(`
\`\`\`js annotate

// @dim
const a = 1;

// @dim start
const b = 1;
const c = 1;
// @dim end

\`\`\`
`);

  const result2 = await process(`
\`\`\`js annotate

/* @dim */
const a = 1;

/*   @dim start */
const b = 1;
const c = 1;
   /*   @dim end */

\`\`\`
`);
  const expected = `<pre class="shiki" style="color:#24292e;background-color:#fff"><div class="code-container"><code><div class="line"></div><div class="line dim"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">a</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="line"></div><div class="line dim"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">b</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="line dim"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">c</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="line"></div></code></div></pre>
`;
  expect(result1.value).toEqual(expected);
  expect(result2.value).toEqual(expected);
});

test("able to render focus ", async () => {
  const result1 = await process(`
\`\`\`js annotate

// @focus
const a = 1;

// @focus start
const b = 1;
const c = 1;
  // @focus end

\`\`\`
`);

  const result2 = await process(`
\`\`\`js annotate

/* @focus */
const a = 1;

  /* @focus start */
const b = 1;
const c = 1;
  /* @focus end */

\`\`\`
`);
  const expected = `<pre class="shiki" style="color:#24292e;background-color:#fff"><div class="code-container"><code><div class="line dim"></div><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">a</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="line dim"></div><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">b</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="line"><span style="color: #D73A49">const</span><span style="color: #24292E"> </span><span style="color: #005CC5">c</span><span style="color: #24292E"> </span><span style="color: #D73A49">=</span><span style="color: #24292E"> </span><span style="color: #005CC5">1</span><span style="color: #24292E">;</span></div><div class="line dim"></div></code></div></pre>
`;
  expect(result1.value).toEqual(expected);

  expect(result2.value).toEqual(expected);
});

test("able to render  in jsx", async () => {
  const result1 = await process(`
\`\`\`jsx annotate
function a() {
  //       ^
  //     [This is line 1]
    return <p>aaa
    { /*      ---       */}
       {/*   [This is line 2]       */}
       {/*   @highlight       */}
       <button>click me </button>
       {123}
    </p>
  }
\`\`\`
`);
  const expected = `<pre class="shiki" style="color:#24292e;background-color:#fff"><div class="code-container"><code><div class="line"><span style="color: #D73A49">function</span><span style="color: #24292E"> </span><span style="color: #6F42C1">a</span><span style="color: #24292E">() {</span></div><div class="shaku-callout" style="left:9ch"><span class="shaku-callout-arrow" style="left:2ch"></span><p>This is line 1</p></div><div class="line"><span style="color: #24292E">    </span><span style="color: #D73A49">return</span><span style="color: #24292E"> &lt;</span><span style="color: #22863A">p</span><span style="color: #24292E">&gt;aaa</span></div><div class="shaku-underline shaku-underline-solid" style="left:13ch"><span class="shaku-underline-line" style="left:1ch">---</span><p>This is line 2</p></div><div class="line highlight"><span style="color: #24292E">       &lt;</span><span style="color: #22863A">button</span><span style="color: #24292E">&gt;click me &lt;/</span><span style="color: #22863A">button</span><span style="color: #24292E">&gt;</span></div><div class="line"><span style="color: #24292E">       {</span><span style="color: #005CC5">123</span><span style="color: #24292E">}</span></div><div class="line"><span style="color: #24292E">    &lt;/</span><span style="color: #22863A">p</span><span style="color: #24292E">&gt;</span></div><div class="line"><span style="color: #24292E">  }</span></div></code></div></pre>
`;
  expect(result1.value).toEqual(expected);
});

test("able to render  in tsx", async () => {
  const result1 = await process(`
\`\`\`tsx annotate
function a() {
  //       ^
  //     [This is line 1]
    return <p>aaa
    { /*      ---       */}
       {/*   [This is line 2]       */}
       {/*   @highlight       */}
       <button>click me </button>
       {123}
    </p>
  }
\`\`\`
`);
  const expected = `<pre class="shiki" style="color:#24292e;background-color:#fff"><div class="code-container"><code><div class="line"><span style="color: #D73A49">function</span><span style="color: #24292E"> </span><span style="color: #6F42C1">a</span><span style="color: #24292E">() {</span></div><div class="shaku-callout" style="left:9ch"><span class="shaku-callout-arrow" style="left:2ch"></span><p>This is line 1</p></div><div class="line"><span style="color: #24292E">    </span><span style="color: #D73A49">return</span><span style="color: #24292E"> &lt;</span><span style="color: #22863A">p</span><span style="color: #24292E">&gt;aaa</span></div><div class="shaku-underline shaku-underline-solid" style="left:13ch"><span class="shaku-underline-line" style="left:1ch">---</span><p>This is line 2</p></div><div class="line highlight"><span style="color: #24292E">       &lt;</span><span style="color: #22863A">button</span><span style="color: #24292E">&gt;click me &lt;/</span><span style="color: #22863A">button</span><span style="color: #24292E">&gt;</span></div><div class="line"><span style="color: #24292E">       {</span><span style="color: #005CC5">123</span><span style="color: #24292E">}</span></div><div class="line"><span style="color: #24292E">    &lt;/</span><span style="color: #22863A">p</span><span style="color: #24292E">&gt;</span></div><div class="line"><span style="color: #24292E">  }</span></div></code></div></pre>
`;
  expect(result1.value).toEqual(expected);
});
