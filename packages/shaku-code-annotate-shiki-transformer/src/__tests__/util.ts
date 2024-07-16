import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import shakuCodeAnnotateShikiTransformer from "..";
import * as shiki from "shiki";
import { visit } from "unist-util-visit";
import { commentPatterns } from "../commentPatterns";

export const unifiedProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype) // this sanitize html by default
  .use(rehypeStringify);

function remarkFallbackLang() {
  return (tree) => {
    visit(tree, "code", (node) => {
      if (node.lang) {
        node.lang = node.lang.toLowerCase();
        if (!(node.lang in commentPatterns)) {
          node.lang = "text";
        }
      }
    });
  };
}

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
        .use(remarkFallbackLang)
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
