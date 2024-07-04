import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import shakuCodeAnnotateShikiTransformer from "..";
import * as shiki from "shiki";

export const unifiedProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype) // this sanitize html by default
  .use(rehypeStringify);

export function fetchProcessor(lang, useDangerousRawHtml: boolean) {
  return shiki
    .createHighlighter({
      themes: ["github-light"],
      langs: [lang],
    })
    .then((highlighter) =>
      unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeShiki, {
          includeExplanation: true,
          transformers: [
            shakuCodeAnnotateShikiTransformer({
              useDangerousRawHtml,
              markdownToHtmlAndSanitize: (code) =>
                unifiedProcessor.processSync(code).toString(),
            }),
          ],
          // TODO: patch shiki to support multiple themes
          // currently shiki doesn't return explanations if `themes` is used
          theme: "github-light",
        })
        .use(rehypeStringify)
    );
}
