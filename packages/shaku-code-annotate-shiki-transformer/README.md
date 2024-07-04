# shaku-code-annotate-shiki-transformer

This is a [Shiki Transformer](https://shiki.matsu.io/guide/transformers) to support Shaku syntax.

You can use this transformer anywhere shiki is supported with simple integration.

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
  includeExplanation: true,
  transformers: [
    shakuCodeAnnotateShikiTransformer({
      useDangerousRawHtml: true,
      markdownToHtmlAndSanitize: (code) =>
        unifiedProcessor.processSync(code).toString(),
    }),
  ],
});
```

Or in a rehype plugin

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
    includeExplanation: true,
    transformers: [
      shakuCodeAnnotateShikiTransformer({
        useDangerousRawHtml: true,
        markdownToHtmlAndSanitize: (code) =>
          unifiedProcessor.processSync(code).toString(),
      }),
    ],
    theme: "vitesse-light",
  })
  .use(rehypeStringify)
  .process(await fs.readFile("./input.md"));
```

## Demos

## Caveat

1. `includeExplanation` is required in transformer setup.
2. `includeExplanation` doesn't work well if `themes` is set, I'm looking to patch Shiki for this.
