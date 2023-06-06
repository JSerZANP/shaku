import { visit } from "unist-util-visit";
import type * as mdast from "mdast";
import { Transformer, unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { getHighlighter, HighlighterOptions, IThemedToken } from "shiki";
import {
  shouldApplyAnnotation,
  parseLine,
  renderComponent,
} from "shaku-code-annotate";

export const remarkShakuCodeAnnotate = (
  options: HighlighterOptions
): Transformer => {
  return async (tree) => {
    const highlighter = await getHighlighter({
      ...(options ?? {}),
      theme: options?.theme ?? "github-light",
    });

    const unifiedProcessor = unified()
      .use(remarkParse)
      .use(remarkRehype) // this sanitize html by default
      .use(rehypeStringify);

    visit(tree, "code", (node: mdast.Code) => {
      const shouldAnnotate = shouldApplyAnnotation(node.meta ?? "");
      if (!shouldAnnotate) return;

      const lines = highlighter.codeToThemedTokens(
        node.value,
        node.lang ?? "txt"
      );
      const foregroundColor = highlighter.getForegroundColor();
      const backgroundColor = highlighter.getBackgroundColor();
      // generate the html from the tokens
      let html = `<pre class="shiki" style="color:${foregroundColor};background-color:${backgroundColor}">`;
      html += `<div class="code-container"><code>`;
      const parsedLines = parseLines(lines);
      const hasFocus = hasShakuDirectiveFocus(parsedLines);
      let shouldHighlighNextSourceLine = false;
      let shouldDimNextSourceLine = false;
      let shouldFocusNextSourceLine = false;
      let isHighlightingBlock = false;
      let isDimBlock = false;
      let isFocusBlock = false;
      for (let i = 0; i < parsedLines.length; i++) {
        const line = parsedLines[i];
        switch (line.type) {
          case "shaku": {
            const shakuLine = line.line;
            switch (shakuLine.type) {
              case "DirectiveCallout": {
                const arrowOffset = shakuLine.config.offset;
                const directiveOffset = arrowOffset + line.offset;
                let minOffset = directiveOffset;
                const contents = [];

                let j = i + 1;
                while (j < parsedLines.length) {
                  const nextLine = parsedLines[j];
                  if (
                    nextLine.type !== "shaku" ||
                    nextLine.line.type !== "AnnotationLine"
                  ) {
                    break;
                  }

                  minOffset = Math.min(
                    minOffset,
                    nextLine.line.config.offset + nextLine.offset
                  );
                  contents.push(
                    String(
                      unifiedProcessor.processSync(nextLine.line.config.content)
                    )
                  );
                  j += 1;
                }

                html += renderComponent({
                  type: "ShakuComponentCallout",
                  config: {
                    offset: minOffset,
                    arrowOffset: directiveOffset - minOffset,
                    contents: contents.join(""),
                  },
                });

                i = j - 1;
                continue;
              }
              case "AnnotationLine":
                // TODO
                break;
              case "DirectiveCollapse":
                // TODO
                break;
              case "DirectiveHighlight": {
                const mark = shakuLine.config.mark;
                switch (mark) {
                  case "start":
                    isHighlightingBlock = true;
                    break;
                  case "end":
                    isHighlightingBlock = false;
                    break;
                  case "below":
                  default:
                    shouldHighlighNextSourceLine = true;
                    break;
                }
                break;
              }
              case "DirectiveDim": {
                const mark = shakuLine.config.mark;
                switch (mark) {
                  case "start":
                    isDimBlock = true;
                    break;
                  case "end":
                    isDimBlock = false;
                    break;
                  case "below":
                  default:
                    shouldDimNextSourceLine = true;
                    break;
                }
                break;
              }
              case "DirectiveFocus": {
                const mark = shakuLine.config.mark;
                switch (mark) {
                  case "start":
                    isFocusBlock = true;
                    break;
                  case "end":
                    isFocusBlock = false;
                    break;
                  case "below":
                  default:
                    shouldFocusNextSourceLine = true;
                    break;
                }
                break;
              }
              case "DirectiveUnderline": {
                const underlineOffset = shakuLine.config.offset;
                const underlineContent = shakuLine.config.content;
                const directiveOffset = underlineOffset + line.offset;
                let minOffset = directiveOffset;
                const contents = [];

                let j = i + 1;
                while (j < parsedLines.length) {
                  const nextLine = parsedLines[j];
                  if (
                    nextLine.type !== "shaku" ||
                    nextLine.line.type !== "AnnotationLine"
                  ) {
                    break;
                  }

                  minOffset = Math.min(
                    minOffset,
                    nextLine.line.config.offset + nextLine.offset
                  );
                  contents.push(
                    String(
                      unifiedProcessor.processSync(nextLine.line.config.content)
                    )
                  );

                  j += 1;
                }

                html += renderComponent({
                  type: "ShakuComponentUnderline",
                  config: {
                    offset: minOffset,
                    underlineOffset: directiveOffset - minOffset,
                    underlineContent,
                    underlineStyle: shakuLine.config.style,
                    contents: contents.join(""),
                  },
                });

                i = j - 1;
                continue;
              }
              default:
                assertsNever(shakuLine);
            }

            break;
          }
          case "default": {
            const shouldHighlight =
              isHighlightingBlock || shouldHighlighNextSourceLine;
            const shouldFocus = isFocusBlock || shouldFocusNextSourceLine;
            const shouldDim =
              isDimBlock ||
              shouldDimNextSourceLine ||
              (hasFocus && !shouldFocus);
            shouldHighlighNextSourceLine = false;
            shouldFocusNextSourceLine = false;
            shouldDimNextSourceLine = false;
            const sourceLine = line.line;
            const highlightClass = shouldHighlight ? " highlight" : "";
            const dimClass = shouldDim ? " dim" : "";
            const prefix = `<div class="line${highlightClass}${dimClass}">`;
            html += prefix;
            html += sourceLine
              .map(
                (token) =>
                  `<span style="color: ${token.color}">${escapeHtml(
                    token.content
                  )}</span>`
              )
              .join("");
            html += `</div>`;
            break;
          }
          default:
            assertsNever(line);
        }
      }

      html += `</code></div></pre>`;

      node.value = html;
      // @ts-ignore expected error
      node.type = "html";
    });
  };
};

function escapeHtml(html: string) {
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * different kinds of comments have different interpretations
 * Below are some common examples, these are not exaustive
 * I'm not sure if there are other cases for different languages
 *
 * "// aaa" => [{content: "// aaa", explanation: [{content: '//'}, {content: ' aaa'}]}]
 * "/* aaa *\/" =>  [{content: "/* aaa *\/", explanation: [{content: '/*'}, {content: ' aaa '}, content: '*\/'}]}]
 * "  // aaa" => [{content: "  "}, {content: "// aaa", explanation: [{content: '//'}, {content: ' aaa'}]}]
 * "  /* aaa" => [{content: "  "}, {content: "/* aaa", explanation: [{content: '/*'}, {content: ' aaa'}]}]
 * "  aaa" => [{content: "  aaa"}]
 * "  *\/" => [{content: "   *\/", explanation: [{content: '   '}, {content: '*\/'}]}]
 *
 * So the idea is
 * 1. if all tokens has explanation of comment, then it is comment line
 * 2. if the first token is white space, then it should be treated as offset
 * 3. the first meaningful token has the comment body
 *   - find the first explanation that is not `punctuation.definition`.
 */
function parseComment(line: IThemedToken[]): null | {
  offset: number;
  body: string;
} {
  if (line.length === 0) return null;
  // comments start from the begining
  const isCommentLine = line.every(
    (token) =>
      isWhitespace(token.content) ||
      token.explanation?.some((exp) =>
        exp.scopes.some((scope) => scope.scopeName.startsWith("comment"))
      )
  );
  if (!isCommentLine) return null;

  const isFirstTokenWhitespace = isWhitespace(line[0].content);
  let offset = isFirstTokenWhitespace ? line[0].content.length : 0;
  let body = "";
  const tokenWithBody = isFirstTokenWhitespace ? line[1] : line[0];
  if (tokenWithBody != null) {
    const explanations = tokenWithBody.explanation ?? [];

    for (let i = 0; i < explanations.length; i++) {
      const explanation = explanations[i];
      // find the first explanation that is not element tag
      if (
        explanation.scopes.every(
          (scope) => !scope.scopeName.startsWith("punctuation.definition")
        )
      ) {
        body = explanation.content;
        break;
      }
      // for other none tokens, treat them as offset
      offset += explanation.content.length;
    }
  }
  return {
    offset,
    body,
  };
}
function parseLines(lines: IThemedToken[][]) {
  return lines.map((line) => {
    const parsedComment = parseComment(line);
    if (parsedComment != null) {
      const { body, offset } = parsedComment;
      const shakuLine = parseLine(body);
      if (shakuLine != null) {
        return {
          type: "shaku",
          line: shakuLine,
          offset,
        } as const;
      }
    }
    return {
      type: "default",
      line,
    } as const;
  });
}
function hasShakuDirectiveFocus(lines: ReturnType<typeof parseLines>) {
  return lines.some(
    (line) => line.type === "shaku" && line.line.type === "DirectiveFocus"
  );
}

function isWhitespace(str: string) {
  return /^\s+$/.test(str);
}
function assertsNever(data: never) {
  throw new Error("expected never but got: " + data);
}
