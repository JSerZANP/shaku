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

async function processWithThemes(md: string) {
  const processor = remark()
    .use(remarkShakuCodeAnnotate, {
      themes: ["github-light", "github-dark"],
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

  expect(result.value).toMatchSnapshot();
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

  const result4 = await process(`
\`\`\`js annotate
const a = 1;
/*      ^<<*/
  //    [This is line 1] <<
   /*  [This is line two]< */
\`\`\`
`);
  expect(result1.value).toMatchSnapshot();
  expect(result2.value).toEqual(result1.value);
  expect(result3.value).toEqual(result1.value);
  expect(result4.value).toEqual(result1.value);
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
  const result3 = await process(`
\`\`\`js annotate
const a = 1;
   /*  -----<   */
  /*    [This is line 1]  <<
          [This is line two] <<<< */
\`\`\`
`);
  expect(result1.value).toMatchSnapshot();
  expect(result2.value).toEqual(result1.value);
  expect(result3.value).toEqual(result1.value);
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
  const result3 = await process(`
\`\`\`js annotate
const a = 1;
   /*  .....< */
  /*    [This is line 1]  <<
         [This is line two]<<< */
\`\`\`
`);
  expect(result1.value).toMatchSnapshot();
  expect(result2.value).toEqual(result1.value);
  expect(result3.value).toEqual(result1.value);
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

  const result3 = await process(`
\`\`\`js annotate
const a = 1;
   /*  ~~~~~< */
  /*    [This is line 1] << */
   /*    [This is line two]   <<< */
\`\`\`
`);

  expect(result1.value).toMatchSnapshot();
  expect(result2.value).toEqual(result1.value);
  expect(result3.value).toEqual(result1.value);
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
  expect(result1.value).toMatchSnapshot();
  expect(result2.value).toEqual(result1.value);
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

  expect(result1.value).toMatchSnapshot();
  expect(result2.value).toEqual(result1.value);
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
  expect(result1.value).toMatchSnapshot();
  expect(result2.value).toEqual(result1.value);
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
  expect(result1.value).toMatchSnapshot();
  expect(result2.value).toEqual(result1.value);
});

test("able to render  in jsx", async () => {
  const result = await process(`
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
  expect(result.value).toMatchSnapshot();
});

test("able to render  in tsx", async () => {
  const result = await process(`
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
  expect(result.value).toMatchSnapshot();
});

test("able to render multiple code blocks with themes", async () => {
  const result = await processWithThemes(`
\`\`\`js annotate
const a = 1;
//    ^
//    [This is line 1]
//    [This is line two]
\`\`\`
`);

  expect(result.value).toMatchSnapshot();
});
