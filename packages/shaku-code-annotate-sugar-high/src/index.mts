import {
  ShakuDirectiveHighlightInline,
  parseLine,
  renderComponent,
} from "shaku-code-annotate-core";
import * as sh from "sugar-high";
import {
  renderSourceLine,
  renderSourceLineWithInlineHighlight,
} from "./render.mjs";
import { Token } from "./types.mjs";
import { escapeHtml } from "./escapeHtml.mjs";

// @ts-ignore
// this type is missing from sugar-high
const TokenTypes = sh.SugarHigh.TokenTypes;

export function highlight(code: string) {
  const lines = getShakuTokenLines(code);
  const parsedLines = parseLines(lines, "javascript", true);
  let html = `<pre class="shaku"><code>`;

  const hasFocus = hasShakuDirectiveFocus(parsedLines);

  let shouldHighlighNextSourceLine = false;
  let shouldDimNextSourceLine = false;
  let shouldFocusNextSourceLine = false;
  let isHighlightingBlock = false;
  let isDimBlock = false;
  let isFocusBlock = false;
  let shakuDirectiveHighlightInline: null | {
    type: "shaku";
    line: ShakuDirectiveHighlightInline;
    offset: number;
  } = null;
  let diffNextSourceLine: false | "+" | "-" = false;
  let diffBlock: false | "+" | "-" = false;
  let isFoldBlock = false;
  let classNamesForNextSourceLine = "";
  let dataAttrsForNextSourceLine:
    | false
    | Array<{ key: string; value: string }> = false;
  let isCutBlock = false;
  let shouldCutNextSourceLine = false;

  for (let i = 0; i < parsedLines.length; i++) {
    const line = parsedLines[i];

    const isShakuLine = line.type === "shaku" && !line.line.config.isEscaped;
    if (isShakuLine) {
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
              // in sugar-high, we don't need md parsing
              nextLine.line.config.content
            );
            j += 1;
          }
          html += renderComponent({
            type: "ShakuComponentCallout",
            config: {
              offset: minOffset,
              arrowOffset: directiveOffset - minOffset,
              contents: contents.join("\n"),
            },
          });

          i = j - 1;
          continue;
        }
        case "AnnotationLine":
          // TODO
          break;
        case "DirectiveFold":
          const mark = shakuLine.config.mark;
          switch (mark) {
            case "start": {
              isFoldBlock = true;
              // find the next non-shaku-line to determine the indent
              let j = i + 1;
              let indent = 0;
              while (j < parsedLines.length) {
                const parsedLine = parsedLines[j];
                if (parsedLine.type !== "shaku") {
                  indent = getLeadingSpaceCount(
                    parsedLine.line.map((token) => token.content).join("")
                  );
                  break;
                }
                j += 1;
              }
              html += `<details class="shaku-expand"><summary style="margin-left:${indent}ch"><mark>{...}</mark></summary>`;
              break;
            }
            case "end":
              if (isFoldBlock) {
                isFocusBlock = false;
                html += "</details>";
              }
              break;
            default:
              assertsNever(mark);
          }
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
              // in sugar-high, we don't need md parsing
              nextLine.line.config.content
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
        case "DirectiveHighlightInline": {
          // only treat it as shaku line if next line is default line
          if (parsedLines[i + 1].type === "default") {
            shakuDirectiveHighlightInline = {
              type: "shaku",
              line: shakuLine,
              offset: line.offset,
            };
          }
          continue;
        }
        case "DirectiveDiff": {
          const mark = shakuLine.config.mark;
          switch (mark) {
            case "start":
              diffBlock = shakuLine.config.type;
              break;
            case "end":
              diffBlock = false;
              break;
            case "below":
            default:
              diffNextSourceLine = shakuLine.config.type;
              break;
          }
          break;
        }
        case "DirectiveClass": {
          classNamesForNextSourceLine = shakuLine.config.classNames;
          break;
        }
        case "DirectiveData": {
          dataAttrsForNextSourceLine = shakuLine.config.entries;
          break;
        }
        case "DirectiveCut": {
          const mark = shakuLine.config.mark;
          switch (mark) {
            case "start":
              isCutBlock = true;
              break;
            case "end":
              isCutBlock = false;
              break;
            case "below":
            default:
              shouldCutNextSourceLine = true;
              break;
          }
          break;
        }
        default:
          assertsNever(shakuLine);
      }
    } else {
      const shouldHighlight =
        isHighlightingBlock || shouldHighlighNextSourceLine;
      const shouldFocus = isFocusBlock || shouldFocusNextSourceLine;
      const shouldDim =
        isDimBlock || shouldDimNextSourceLine || (hasFocus && !shouldFocus);
      const diff = diffBlock || diffNextSourceLine;
      const classNames = classNamesForNextSourceLine
        ? " " + classNamesForNextSourceLine
        : "";
      const dataAttrs = dataAttrsForNextSourceLine;
      const shouldCut = isCutBlock || shouldCutNextSourceLine;
      shouldHighlighNextSourceLine = false;
      shouldFocusNextSourceLine = false;
      shouldDimNextSourceLine = false;
      diffNextSourceLine = false;
      classNamesForNextSourceLine = "";
      dataAttrsForNextSourceLine = false;
      shouldCutNextSourceLine = false;

      if (shouldCut) {
        continue;
      }
      const sourceLine = line.type === "default" ? line.line : line.sourceLine;

      const highlightClass = shouldHighlight ? " highlight" : "";
      const dimClass = shouldDim ? " dim" : "";
      const diffClass =
        diff === "+"
          ? " diff diff-insert"
          : diff === "-"
          ? " diff diff-delete"
          : "";
      const classString = `sh__line${highlightClass}${dimClass}${diffClass}${classNames}`;
      const dataString = dataAttrs
        ? " " +
          dataAttrs
            .map(
              ({ key, value }) =>
                `${escapeHtml(`data-${key}`)}="${escapeHtml(value)}"`
            )
            .join(" ")
        : "";
      const prefix = `<div class="${escapeHtml(classString)}"${dataString}>`;
      html += prefix;

      if (shakuDirectiveHighlightInline) {
        html += renderSourceLineWithInlineHighlight(
          sourceLine,
          shakuDirectiveHighlightInline
        );
        shakuDirectiveHighlightInline = null;
      } else {
        html += renderSourceLine(sourceLine);
      }

      html += `</div>`;
    }
  }

  html += "</code></pre>";
  return html;
}

// sugar-high gens a flat list of tokens
// while Shaku has the concept of lines
// this function groups tokens into lines by
// searching for line break
export function getShakuTokenLines(code: string): Array<Array<Token>> {
  const tokens = sh.tokenize(code);
  const result: Array<Array<Token>> = [];
  let buffer: Array<Token> = [];

  for (const token of tokens) {
    buffer.push({
      type: TokenTypes[token[0]],
      content: token[1],
    });
    if (/\n/.test(token[1])) {
      // the last token of a line
      // push it to the buffer and form a line
      result.push(buffer);
      buffer = [];
    }
  }

  if (buffer.length > 0) {
    result.push(buffer);
  }

  return result;
}

function parseLines(
  lines: Array<Array<Token>>,
  lang: "javascript",
  shouldAnnotate: boolean
) {
  return lines.map((line) => {
    if (shouldAnnotate) {
      const parsedComment = parseComment(line, lang);
      if (parsedComment != null) {
        const { body, offset } = parsedComment;
        const shakuLine = parseLine(body);
        if (shakuLine != null) {
          // for escaped shaku lines, we need to remove the trailing!
          if (shakuLine.config.isEscaped) {
            for (let i = line.length - 1; i >= 0; i--) {
              if (/!\s*$/.test(line[i].content)) {
                line[i].content = line[i].content.replace(/!(\s*)$/, "$1");
                break;
              }
            }
          }

          return {
            type: "shaku",
            line: shakuLine,
            sourceLine: line,
            offset,
          } as const;
        }
      }
    }
    return {
      type: "default",
      line,
    } as const;
  });
}

// in Sugar Hight
// multi-line comment block is in one token of type: comment, so is the comment line
// so we only need to consider
// 1. 'comment' => which might contains line break
// 2. 'space' => white space
// 3. 'break' => line break

// For JSX we need to handle `{/*  ... */}`
// 1. 'jsxliterals' => space in jsx
// 2. 'sign' => `{` or `}`
// 3. 'comment' => comment in between

function parseComment(
  line: Token[],
  lang: "javascript"
): null | {
  offset: number;
  body: string;
} {
  if (line.length === 0) return null;

  let countOfWhiteSpaceToken = 0;
  let countOfCommentToken = 0;
  let countOfOpenBrace = 0;

  // comments start from the beginning
  for (const token of line) {
    if (shouldBeTreatedAsWhitespace(token, lang)) {
      countOfWhiteSpaceToken += 1;
    } else if (token.type === "comment") {
      countOfCommentToken += 1;
    } else if (token.type === "sign" && token.content === "{") {
      countOfOpenBrace += 1;
    } else if (token.type === "sign" && token.content === "}") {
      countOfOpenBrace -= 1;
    } else {
      return null;
    }
  }
  const isCommentLine = countOfCommentToken > 0 && countOfOpenBrace === 0;
  if (!isCommentLine) return null;

  // need to find the first token with comment
  // all other treated as offset
  let offset = 0;
  let body = "";

  for (const token of line) {
    if (token.type === "comment") {
      body = token.content;
    } else {
      offset += token.content.length;
    }
  }
  const { trimmedBody, offset: extraOffset } = trimCommentBody(body, lang);
  return {
    offset: offset + extraOffset,
    body: trimmedBody,
  };
}

function shouldBeTreatedAsWhitespace(token: Token, _lang: "javascript") {
  if (isWhitespace(token.content)) return true;
  return false;
}

function isWhitespace(str: string) {
  return /^\s+$/.test(str);
}

// body might contains `//` or `/*`
function trimCommentBody(body: string, lang: "javascript") {
  let trimmedBody = body;
  let offset = 0;

  if (/^(\/\/|\/\*)/.test(body)) {
    trimmedBody = body.slice(2);
    offset += 2;
  }

  trimmedBody = trimmedBody.replace(/\*\/$/, "");
  return {
    trimmedBody,
    offset,
  };
}

function hasShakuDirectiveFocus(lines: ReturnType<typeof parseLines>) {
  return lines.some(
    (line) => line.type === "shaku" && line.line.type === "DirectiveFocus"
  );
}

function assertsNever(data: never) {
  throw new Error("expected never but got: " + data);
}

function getLeadingSpaceCount(str: string) {
  for (let i = 0; i < str.length; i++) {
    if (!/\s/.test(str[i])) {
      return i;
    }
  }
  return 0;
}
