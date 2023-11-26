import { expect, test } from "vitest";
import { Marked } from "marked";
import markedShakuCodeAnnotate from "../index";

const marked = new Marked(markedShakuCodeAnnotate());
const markedWithTheme = new Marked(
  markedShakuCodeAnnotate({
    themes: ["github-light", "github-dark"],
  })
);

test("should not apply annotation without meta", async () => {
  const result = await marked.parse(`
\`\`\`js 
const a = 1;
//    ^
//    [This is line 1]
//    [This is line two]
\`\`\`
`);

  expect(result).toMatchSnapshot();
});

test("able to render callout: ^", async () => {
  const result1 = await marked.parse(`
\`\`\`js annotate
const a = 1;
//    ^
//    [This is line 1]
//    [This is line two]
\`\`\`
`);

  const result2 = await marked.parse(`
\`\`\`js annotate
const a = 1;
/*    ^ 
      [This is line 1] 
      [This is line two] */
\`\`\`
`);

  const result3 = await marked.parse(`
\`\`\`js annotate
const a = 1;
/*    ^  */
  //  [This is line 1] 
   /* [This is line two] */
\`\`\`
`);

  const result4 = await marked.parse(`
\`\`\`js annotate
const a = 1;
/*      ^<<*/
  //    [This is line 1] <<
   /*  [This is line two]< */
\`\`\`
`);
  expect(result1).toMatchSnapshot();
  expect(result2).toEqual(result1);
  expect(result3).toEqual(result1);
  expect(result4).toEqual(result1);
});

test("able to render solid underline: ----", async () => {
  const result1 = await marked.parse(`
\`\`\`js annotate
const a = 1;
//    -----
//    [This is line 1]
//    [This is line two]
\`\`\`
`);
  const result2 = await marked.parse(`
\`\`\`js annotate
const a = 1;
   /* -----   */
  /*  [This is line 1] 
      [This is line two] */
\`\`\`
`);
  const result3 = await marked.parse(`
\`\`\`js annotate
const a = 1;
   /*  -----<   */
  /*    [This is line 1]  <<
          [This is line two] <<<< */
\`\`\`
`);
  expect(result1).toMatchSnapshot();
  expect(result2).toEqual(result1);
  expect(result3).toEqual(result1);
});

test("able to render dotted underline: .....", async () => {
  const result1 = await marked.parse(`
\`\`\`js annotate
const a = 1;
//    .....
//    [This is line 1]
//    [This is line two]
\`\`\`
`);
  const result2 = await marked.parse(`
\`\`\`js annotate
const a = 1;
   /* ..... */
  /*  [This is line 1]
      [This is line two] */
\`\`\`
`);
  const result3 = await marked.parse(`
\`\`\`js annotate
const a = 1;
   /*  .....< */
  /*    [This is line 1]  <<
         [This is line two]<<< */
\`\`\`
`);
  expect(result1).toMatchSnapshot();
  expect(result2).toEqual(result1);
  expect(result3).toEqual(result1);
});

test("able to render wavy underline: ~~~~~ ", async () => {
  const result1 = await marked.parse(`
\`\`\`js annotate
const a = 1;
//    ~~~~~
//    [This is line 1]
//    [This is line two]
\`\`\`
`);

  const result2 = await marked.parse(`
\`\`\`js annotate
const a = 1;
   /* ~~~~~ */
  /*  [This is line 1] */
   /* [This is line two] */
\`\`\`
`);

  const result3 = await marked.parse(`
\`\`\`js annotate
const a = 1;
   /*  ~~~~~< */
  /*    [This is line 1] << */
   /*    [This is line two]   <<< */
\`\`\`
`);

  expect(result1).toMatchSnapshot();
  expect(result2).toEqual(result1);
  expect(result3).toEqual(result1);
});

test("able to render underline without comments ", async () => {
  const result1 = await marked.parse(`
\`\`\`js annotate
const a = 1;
//    -----
const b = 1;
//    .....
const c = 1;
//    ~~~~~
\`\`\`
`);

  const result2 = await marked.parse(`
\`\`\`js annotate
const a = 1;
  /*  ----- */
const b = 1;
   /* ..... */
const c = 1;
    /*~~~~~ */
\`\`\`
`);
  expect(result1).toMatchSnapshot();
  expect(result2).toEqual(result1);
});

test("able to render highlight ", async () => {
  const result1 = await marked.parse(`
\`\`\`js annotate

// @highlight
const a = 1;

// @highlight start
const b = 1;
const c = 1;
// @highlight end

\`\`\`
`);

  const result2 = await marked.parse(`
\`\`\`js annotate

/* @highlight */
const a = 1;

/*  @highlight start */
const b = 1;
const c = 1;
/*  @highlight end */

\`\`\`
`);

  expect(result1).toMatchSnapshot();
  expect(result2).toEqual(result1);
});

test("able to render dim ", async () => {
  const result1 = await marked.parse(`
\`\`\`js annotate

// @dim
const a = 1;

// @dim start
const b = 1;
const c = 1;
// @dim end

\`\`\`
`);

  const result2 = await marked.parse(`
\`\`\`js annotate

/* @dim */
const a = 1;

/*   @dim start */
const b = 1;
const c = 1;
   /*   @dim end */

\`\`\`
`);
  expect(result1).toMatchSnapshot();
  expect(result2).toEqual(result1);
});

test("able to render focus ", async () => {
  const result1 = await marked.parse(`
\`\`\`js annotate

// @focus
const a = 1;

// @focus start
const b = 1;
const c = 1;
  // @focus end

\`\`\`
`);

  const result2 = await marked.parse(`
\`\`\`js annotate

/* @focus */
const a = 1;

  /* @focus start */
const b = 1;
const c = 1;
  /* @focus end */

\`\`\`
`);
  expect(result1).toMatchSnapshot();
  expect(result2).toEqual(result1);
});

test("able to render  in jsx", async () => {
  const result = await marked.parse(`
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
  expect(result).toMatchSnapshot();
});

test("able to render  in tsx", async () => {
  const result = await marked.parse(`
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
  expect(result).toMatchSnapshot();
});

test("able to render multiple code blocks with themes", async () => {
  const result = await markedWithTheme.parse(`
\`\`\`js annotate
const a = 1;
//    ^
//    [This is line 1]
//    [This is line two]
\`\`\`
`);

  expect(result).toMatchSnapshot();
});
