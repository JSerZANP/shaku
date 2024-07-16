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

export function fetchProcessor(
  lang: string,
  useDangerousRawHtml: boolean,
  shakuTrigger?: RegExp
) {
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
          transformers: [
            shakuCodeAnnotateShikiTransformer({
              useDangerousRawHtml,
              shakuTrigger,
              markdownToHtmlAndSanitize: (code) =>
                unifiedProcessor.processSync(code).toString(),
            }),
          ],
          theme: "github-light",
        })
        .use(rehypeStringify)
    );
}
