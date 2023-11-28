import { visit } from "unist-util-visit";
import type * as mdast from "mdast";
import { Transformer, unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { HighlighterOptions } from "shiki";
import {
  ShakuHighlighterOptions,
  getShakuHighlighters,
} from "shaku-code-annotate";

export const remarkShakuCodeAnnotate = (
  options: ShakuHighlighterOptions
): Transformer => {
  return async (tree) => {
    const highlighters = await getShakuHighlighters(options);

    const unifiedProcessor = unified()
      .use(remarkParse)
      .use(remarkRehype) // this sanitize html by default
      .use(rehypeStringify);

    visit(tree, "code", (node: mdast.Code) => {
      // html might contain multiple code sections
      let snippets = "";
      let skipped = false;
      highlighters.forEach((highlighter) => {
        const { html, skipped: _skipped } = highlighter.codeToShakuHtml({
          code: node.value,
          meta: node.meta ?? "",
          parseBasicMarkdown: (code) =>
            unifiedProcessor.processSync(code).toString(),
          options: {
            lang: node.lang ?? "txt",
          },
        });

        if (_skipped) {
          skipped = _skipped;
        }
        snippets += html.trim();
      });

      if (!skipped) {
        node.value = snippets;
        // @ts-ignore expected error
        node.type = "html";
      }
    });
  };
};

export { supportedLangs, defaultCode } from "shaku-code-annotate";
