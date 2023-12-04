import { Lang } from "shiki";

import { $ } from "migacss";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { getShakuHighlighters } from "shaku-code-annotate-shiki";
import { unified } from "unified";
import { BaseProps } from "./bare";

const unifiedProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype) // this sanitize html by default
  .use(rehypeStringify);

export async function CodeBlock({
  code,
  lang,
  shakuEnabled,
  ...rest
}: {
  code: string;
  lang: Lang;
  shakuEnabled?: boolean;
} & BaseProps) {
  const highlighters = await getShakuHighlighters({
    langs: [lang],
    themes: ["github-light", "github-dark"],
  });

  const html = highlighters
    .map(
      (highlighter) =>
        highlighter.codeToShakuHtml({
          code,
          meta: shakuEnabled ? "annotate" : "",
          options: {
            useDangerousRawHtml: true,
            markdownToHtmlAndSanitize: (code) =>
              unifiedProcessor.processSync(code).toString(),
            lang,
          },
        }).html
    )
    .join("\n");

  return <$.div dangerouslySetInnerHTML={{ __html: html }} {...rest}></$.div>;
}
