import { visit } from "unist-util-visit";
import type * as mdast from "mdast";
import { Transformer, unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { HighlighterOptions } from "shiki";
import {
  getShakuHighlighters,
  shouldApplyAnnotation,
} from "shaku-code-annotate";

export const remarkShakuCodeAnnotate = (
  options: HighlighterOptions & {
    fallbackToShiki?: boolean; // default true
  }
): Transformer => {
  return async (tree) => {
    const highlighters = await getShakuHighlighters(options);

    const unifiedProcessor = unified()
      .use(remarkParse)
      .use(remarkRehype) // this sanitize html by default
      .use(rehypeStringify);

    visit(tree, "code", (node: mdast.Code) => {
      const shouldAnnotate = shouldApplyAnnotation(node.meta ?? "");
      if (shouldAnnotate) {
        // html might contain multiple code sections
        let snippets = "";
        highlighters.forEach((highlighter) => {
          snippets += highlighter.codeToShakuHtml({
            code: node.value,
            parseBasicMd: (code) =>
              unifiedProcessor.processSync(code).toString(),
            options: {
              lang: node.lang ?? "txt",
            },
          });
        });

        node.value = snippets;
        // @ts-ignore expected error
        node.type = "html";
      } else if (options.fallbackToShiki !== false) {
        // fallback to shiki unless is configured not to.
        // html might contain multiple code sections
        let snippets = "";
        highlighters.forEach((highlighter) => {
          snippets += highlighter.codeToHtml(node.value, node.lang ?? "txt");
        });

        node.value = snippets;
        // @ts-ignore expected error
        node.type = "html";
      }
    });
  };
};

export { supportedLangs, defaultCode } from "shaku-code-annotate";
