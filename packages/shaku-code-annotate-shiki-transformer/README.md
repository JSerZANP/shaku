# shaku-code-annotate-shiki-transformer

This is a [Shiki Transformer](https://shiki.matsu.io/guide/transformers) to support Shaku syntax.

You can use this transformer anywhere shiki is supported with simple integration.

## Live demos

|     |               |                                                                                                                                                              |
| --- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Astro + Shaku | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/github-yunziv-kcb1ow?file=astro.config.mjs) |
| 2   | Next + Shaku  | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/github-hrpoqm-sbmxb9?file=next.config.mjs)  |

## Usage

```ts
import shakuCodeAnnotateShikiTransformer from "shaku-code-annotate-shiki-transformer";
import { codeToHtml } from "shiki";

const unifiedProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype) // this sanitize html by default
  .use(rehypeStringify);

const code = await codeToHtml("foo\bar", {
  lang: "js",
  theme: "vitesse-light",
  transformers: [
    shakuCodeAnnotateShikiTransformer(),
    // if you want markdown support in the annotation
    // shakuCodeAnnotateShikiTransformer({
    //   useDangerousRawHtml: true,
    //   markdownToHtmlAndSanitize: (code) =>
    //     unifiedProcessor.processSync(code).toString(),
    // }),
  ],
});
```

Or in a rehype plugin.

```ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeShiki from "@shikijs/rehype";

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeShiki, {
    transformers: [
      shakuCodeAnnotateShikiTransformer(),
      // if you want markdown support in the annotation
      // shakuCodeAnnotateShikiTransformer({
      //   useDangerousRawHtml: true,
      //   markdownToHtmlAndSanitize: (code) =>
      //     unifiedProcessor.processSync(code).toString(),
      // }),
    ],
    theme: "vitesse-light",
  })
  .use(rehypeStringify)
  .process(await fs.readFile("./input.md"));
```

By default, Shaku will be applied on all code blocks. You can set explicit trigger by pasetting `shakuTrigger` to be checked against code meta.

```ts
shakuCodeAnnotateShikiTransformer({
  shakuTrigger: /annotate/,
});
```

With above setting, we need to explicitly add `annotate` like below to trigger Shaku.

````md
```js annotate

```
````

There is also a util function `isLangSupported(lang: unknown)` to check if certain language is supported in Shaku transformer.
