# shaku-code-annotate-shiki

<ruby>釈<rp>(<rp><rt>Shaku</rt><rp>)<rp></ruby>- _elucidate, explain_

This module enables you to annotate your code snippet with separation from normal comments,
makes it easier to explain the code. It uses [shiki](https://github.com/shikijs/shiki) as backbone and inspired by [shiki-twoslash](https://shikijs.github.io/twoslash/).

![](./docs/static/shaku-code-annotate-screenshot.png)

Take a look at the live demo from

1. [Shaku playground](https://shaku-web.vercel.app)
2. [demo with Astro](https://stackblitz.com/edit/github-yunziv?file=src%2Fcontent%2Fblog%2Fshaku.mdx).
3. [demo with Next.js](https://stackblitz.com/edit/github-hrpoqm-zfq1kt?file=pages%2Findex.mdx).

## Usage

```ts
import { getShakuHighlighters } from "shaku-code-annotate-shiki";

// 1. get highlighters of one theme or multiple themes
const highlighters = await getShakuHighlighters({
  langs: [lang],
  // theme: 'github-light'
  themes: ["github-light", "github-dark"],
});

// 2. for each theme generate HTML from code
const html = highlighters
  .map(
    (highlighter) =>
      highlighter.codeToShakuHtml({
        code,
        meta: "annotate",
        options: {
          // by default, shaku escapes, but you can use following combination
          // to do custom markdown parsing
          useDangerousRawHtml: true,
          markdownToHtmlAndSanitize: (code) => html
          lang,
        },
      }).html
  )
  .join("\n");
```

## Plugins

Generally it is better for you to choose the right plugin for your markdown engine.

1. Remark - [remark-shaku-code-annotate](../remark-shaku-code-annotate/)
2. Marked - [marked-shaku-code-annotate](../marked-shaku-code-annotate/)
