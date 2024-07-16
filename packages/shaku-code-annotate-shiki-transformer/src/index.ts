import { ShikiTransformer, ThemedToken } from "shiki";
import {
  ShakuDirectiveHighlightInline,
  parseLine,
  renderComponentHast,
} from "shaku-code-annotate-core";
import { Element, ElementContent } from "hast";
import { commentPatterns } from "./commentPatterns";

declare module "shiki" {
  export interface ShikiTransformerContextMeta {
    shaku: ShakuUpdatesForLine;
    isEnabled: boolean;
    linesToHide: Set<number>;
  }
}
type ShakuUpdateAddClass = {
  type: "addClass";
  classNames: Array<string>;
};

type ShakuUpdateInsertAfter = {
  type: "insertAfter";
  node: any;
};

type ShakuUpdateFoldStart = {
  type: "foldStart";
  indent: number;
};
type ShakuUpdateFoldEnd = {
  type: "foldEnd";
};

type ShakuUpdateDataAttrs = {
  type: "dataAttrs";
  entries: Array<{ key: string; value: string }>;
};

type ShakuUpdateHighlightInline = {
  type: "highlightInline";
  shakuLine: {
    type: "shaku";
    line: ShakuDirectiveHighlightInline;
    offset: number;
  };
};

type ShakuUpdate =
  | ShakuUpdateAddClass
  | ShakuUpdateInsertAfter
  | ShakuUpdateHighlightInline
  | ShakuUpdateFoldStart
  | ShakuUpdateFoldEnd
  | ShakuUpdateDataAttrs;

type ShakuUpdatesForLine = Map<number, Array<ShakuUpdate>>;

type Options = {
  /**
   * the regexp to trigger Shaku syntax
   * it is matched against the code block meta string
   * by default Shaku syntax is enabled
   */
  shakuTrigger?: RegExp;
  /**
   * whether or not to escape the annotation
   * use it if you want to support markdown in annotation
   * @default false
   */
  useDangerousRawHtml?: boolean;
  /**
   * by default shaku doesn't parse the markdown
   * you can pass your own parser with `useDangerousRawHtml: true`
   * do remember to sanitize
   */
  markdownToHtmlAndSanitize?: (md: string) => string;
};

const shakuCodeAnnotateShikiTransformer: (
  options?: Options
) => ShikiTransformer = (options) => {
  const useDangerousRawHtml = options?.useDangerousRawHtml;
  const markdownToHtmlAndSanitize =
    options?.markdownToHtmlAndSanitize ?? ((md: string) => md);
  const shakuTrigger = options?.shakuTrigger;
  return {
    preprocess(_code, options) {
      this.meta.shaku = new Map();
      this.meta.linesToHide = new Set<number>();
      this.meta.isEnabled =
        shakuTrigger == null
          ? true
          : shakuTrigger.test(options.meta?.__raw ?? "");
    },
    tokens(lines) {
      if (!this.meta.isEnabled) {
        return;
      }
      const shaku = this.meta.shaku;
      const parsedLines = parseLines(lines, this.options.lang, true);
      const hasFocus = hasShakuDirectiveFocus(parsedLines);
      const linesToHide = new Set<number>();
      this.meta.linesToHide = linesToHide;

      let isHighlightingBlock = false;
      let shouldHighlighNextSourceLine = false;

      let isDimBlock = false;
      let shouldDimNextSourceLine = false;

      let shouldFocusNextSourceLine = false;
      let isFocusBlock = false;

      let diffNextSourceLine: false | "+" | "-" = false;
      let diffBlock: false | "+" | "-" = false;
      let classNamesForNextSourceLine = "";

      let shakuDirectiveHighlightInline: null | {
        type: "shaku";
        line: ShakuDirectiveHighlightInline;
        offset: number;
      } = null;

      let isCutBlock = false;
      let shouldCutNextSourceLine = false;

      let dataAttrsForNextSourceLine:
        | false
        | Array<{ key: string; value: string }> = false;

      for (let i = 0; i < parsedLines.length; i++) {
        const line = parsedLines[i];
        const isShakuLine =
          line.type === "shaku" && !line.line.config.isEscaped;
        if (isShakuLine) {
          linesToHide.add(i);
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
                  markdownToHtmlAndSanitize(nextLine.line.config.content).trim()
                  // String(
                  //   unifiedProcessor.processSync(nextLine.line.config.content)
                  // )
                );
                j += 1;
              }

              const callout = renderComponentHast(
                {
                  type: "ShakuComponentCallout",
                  config: {
                    offset: minOffset,
                    arrowOffset: directiveOffset - minOffset,
                    contents: contents.join(useDangerousRawHtml ? "" : "\n"),
                  },
                },
                {
                  useDangerousRawHtml,
                }
              );

              const prevLineNo = i - 1;
              const shakuUpdates = shaku.get(i - 1) ?? [];
              shakuUpdates.push({
                type: "insertAfter",
                node: callout,
              });
              shaku.set(prevLineNo, shakuUpdates);
              continue;
            }
            case "AnnotationLine":
              // annotation lines cannot exist alone
              break;
            case "DirectiveFold": {
              const mark = shakuLine.config.mark;
              const shakuUpdates = shaku.get(i - 1) ?? [];
              switch (mark) {
                case "start": {
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
                  shakuUpdates.push({
                    type: "foldStart",
                    indent,
                  });
                  break;
                }
                case "end":
                  shakuUpdates.push({
                    type: "foldEnd",
                  });
                  break;
                default:
                  assertsNever(mark);
              }
              shaku.set(i, shakuUpdates);
              break;
            }
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
                  // some engines generates \n at line end
                  markdownToHtmlAndSanitize(nextLine.line.config.content).trim()
                  // String(
                  //   unifiedProcessor.processSync(nextLine.line.config.content)
                  // )
                );
                j += 1;
              }
              const underline = renderComponentHast(
                {
                  type: "ShakuComponentUnderline",
                  config: {
                    offset: minOffset,
                    underlineOffset: directiveOffset - minOffset,
                    underlineContent,
                    underlineStyle: shakuLine.config.style,
                    contents: contents.join(""),
                  },
                },
                {
                  useDangerousRawHtml,
                }
              );
              const prevLineNo = i - 1;
              const shakuUpdates = shaku.get(i - 1) ?? [];
              shakuUpdates.push({
                type: "insertAfter",
                node: underline,
              });
              shaku.set(prevLineNo, shakuUpdates);
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
            // assertsNever(shakuLine);
          }
        } else {
          const extraClassNames = [];
          if (classNamesForNextSourceLine) {
            extraClassNames.push(classNamesForNextSourceLine);
          }

          const shouldHighlight =
            isHighlightingBlock || shouldHighlighNextSourceLine;
          const shouldFocus = isFocusBlock || shouldFocusNextSourceLine;
          const shouldDim =
            isDimBlock || shouldDimNextSourceLine || (hasFocus && !shouldFocus);
          const diff = diffBlock || diffNextSourceLine;
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
            linesToHide.add(i);
            continue;
          }

          // const sourceLine = line.type === "default" ? line.line : line.sourceLine;

          if (shouldHighlight) {
            extraClassNames.push("highlight");
          }

          if (shouldDim) {
            extraClassNames.push("dim");
          }

          if (diff === "+") {
            extraClassNames.push("diff", "diff-insert");
          }

          if (diff === "-") {
            extraClassNames.push("diff", "diff-delete");
          }

          if (dataAttrs) {
            const shakuUpdates = shaku.get(i) ?? [];
            shakuUpdates.push({
              type: "dataAttrs",
              entries: dataAttrs,
            });
            shaku.set(i, shakuUpdates);
          }

          if (extraClassNames.length > 0) {
            const shakuUpdates = shaku.get(i) ?? [];
            shakuUpdates.push({
              type: "addClass",
              classNames: extraClassNames,
            });
            shaku.set(i, shakuUpdates);
          }

          if (shakuDirectiveHighlightInline) {
            const shakuUpdates = shaku.get(i) ?? [];
            shakuUpdates.push({
              type: "highlightInline",
              shakuLine: shakuDirectiveHighlightInline,
            });
            shaku.set(i, shakuUpdates);
            shakuDirectiveHighlightInline = null;
          }
        }
      }
    },
    pre(node) {
      if (!this.meta.isEnabled) {
        return;
      }
      this.addClassToHast(node, "shaku");
    },
    code(node) {
      if (!this.meta.isEnabled) {
        return;
      }
      const shaku = this.meta.shaku;

      const linesToHide = this.meta.linesToHide;
      // remove the lines that are shaku lines
      // seems like very line has a newline in the end
      const newChildren = [];

      let details: null | Element = null;
      for (let i = 0; i < node.children.length; i++) {
        // skip the new lines
        if (i % 2 === 0) {
          let lineNo = Math.floor(i / 2);
          const line = node.children[i];
          // TODO: this is correct?
          if (!linesToHide.has(lineNo)) {
            // skip the line
            if (details) {
              // @ts-ignore
              details.children.push(line);
            } else {
              newChildren.push(line);
            }
          }

          const updates = shaku.get(lineNo);
          // insert at the end of the line
          for (const update of updates ?? []) {
            switch (update.type) {
              case "insertAfter":
                // this is handled in the code hook
                newChildren.push(update.node);
                break;
              case "addClass":
                // classes are handled in line hook
                break;
              case "highlightInline":
                // classes are handled in line hook
                break;
              case "foldStart": {
                const indent = update.indent;
                details = {
                  type: "element",
                  tagName: "details",
                  properties: {
                    className: ["shaku-expand"],
                  },
                  children: [
                    {
                      type: "element",
                      tagName: "summary",
                      properties: {
                        style: "margin-left: " + indent + "ch",
                      },
                      children: [
                        {
                          type: "element",
                          tagName: "mark",
                          properties: {},
                          children: [
                            {
                              type: "text",
                              value: "{...}",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                };
                break;
              }
              case "foldEnd": {
                if (details != null) {
                  newChildren.push(details);
                  details = null;
                }
                break;
              }
              case "dataAttrs":
                // data attrs are handled in line hook
                break;

              default:
                assertsNever(update);
            }
          }
        }
      }
      node.children = newChildren;
    },
    // line is 1-based
    line(line, i) {
      if (!this.meta.isEnabled) {
        return;
      }
      // if shaku line, we need to strip it.
      // return {
      //   type: "text",
      //   content: "",
      // };
      const lineNo = i - 1;
      const shaku = this.meta.shaku;
      const shakuUpdates = shaku.get(lineNo);
      if (shakuUpdates != null) {
        for (const update of shakuUpdates) {
          switch (update.type) {
            case "addClass":
              for (const className of update.classNames) {
                this.addClassToHast(line, className);
              }
              break;
            case "insertAfter":
              // this is handled in the code hook
              break;
            case "highlightInline":
              // @ts-ignore
              line.children = inlineHighlightChildren(
                line.children as Array<Element>,
                update.shakuLine
              );
              break;
            case "dataAttrs":
              for (const { key, value } of update.entries) {
                line.properties ??= {};
                line.properties["data-" + key] = value;
              }
              break;
            case "foldStart":
            case "foldEnd":
              // this is handled in the code hook
              break;
            default:
              assertsNever(update);
          }
        }
      }
    },
  };
};

export default shakuCodeAnnotateShikiTransformer;

/**
 * using token explanation is not performant and flaky
 * now here just use boring regexp
 */
function parseComment(
  text: string,
  lang?: null | string
): null | {
  offset: number;
  body: string;
} {
  if (lang == null) {
    return null;
  }
  const reg = commentPatterns[lang];

  if (reg == null) {
    return null;
  }

  const matches = text.match(reg);
  if (matches) {
    const body = matches.groups?.body;
    const leadingSpaces = matches.groups?.leadingSpaces;
    const markerStart = matches.groups?.markerStart;
    if (body == null || leadingSpaces == null || markerStart == null) {
      return null;
    }

    return {
      offset: leadingSpaces.length + markerStart.length,
      body,
    };
  }

  return null;
}

function parseLines(
  lines: ThemedToken[][],
  lang: string | null,
  isShakuSyntaxEnabled: boolean
) {
  return lines.map((line) => {
    if (isShakuSyntaxEnabled) {
      const parsedComment = parseComment(getTextOfElement(line), lang);
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

function getTextOfElement(line: ThemedToken[]): string {
  return line.reduce((acc, token) => {
    return acc + token.content;
  }, "");
}

function getTextSizeOfElement(token: Element): number {
  return token.children.reduce((acc, child) => {
    if (child.type === "text") {
      return acc + child.value.length;
    }
    if (child.type === "element") {
      return acc + getTextSizeOfElement(child);
    }
    return acc;
  }, 0);
}

type Insertion = {
  position: number;
  type: "opening" | "closing";
  id?: string;
};

function inlineHighlightChildren(
  children: Array<Element>,
  shakuLine: {
    type: "shaku";
    line: ShakuDirectiveHighlightInline;
    offset: number;
  }
): Array<ElementContent> {
  const prevChildren = children.slice(0);
  const nextChildren: Array<Element> = [];
  const insertions: Array<Insertion> = [];

  for (const part of shakuLine.line.config.parts) {
    insertions.push({
      position: shakuLine.offset + part.offset,
      type: "opening",
      id: part.id,
    });
    insertions.push({
      position: shakuLine.offset + part.offset + part.length,
      type: "closing",
    });
  }

  let currentPosition = 0;
  let isInGroup = false;

  while (true) {
    const insertion = insertions.shift();
    const token = prevChildren.shift();

    if (insertion == null && token == null) {
      break;
    }

    // if no inline group
    if (insertion == null && token != null) {
      nextChildren.push(token);
      currentPosition += getTextSizeOfElement(token);
      continue;
    }

    // end of the line
    if (token == null && insertion != null) {
      continue;
    }

    if (token != null && insertion != null) {
      // if current position is the insertion point
      if (currentPosition === insertion.position) {
        if (insertion.type === "opening") {
          nextChildren.push({
            type: "element",
            tagName: "mark",
            properties: {
              className: ["shaku-inline-highlight"],
              dataId: insertion.id,
            },
            children: [],
          });
          isInGroup = true;
        } else {
          isInGroup = false;
        }
        prevChildren.unshift(token);
      } else {
        // if current position is outside the token
        // safely renders the token
        if (
          currentPosition + getTextSizeOfElement(token) <=
          insertion.position
        ) {
          const lastChildren = nextChildren.at(-1) as Element;
          if (isInGroup) {
            lastChildren.children.push(token);
          } else {
            nextChildren.push(token);
          }
          currentPosition += getTextSizeOfElement(token);
          insertions.unshift(insertion);
        } else {
          // insertion point is inside the token
          // need to break the token down
          const lengthToSlice = insertion.position - currentPosition;

          // assume the token is text
          const firstChildren = token.children[0];
          if (firstChildren.type !== "text") {
            throw "unexpected token type: " + firstChildren.type;
          }
          const text = firstChildren.value;
          const headText = text.slice(0, lengthToSlice);
          const tailText = text.slice(lengthToSlice);
          prevChildren.unshift({
            ...token,
            children: [
              {
                type: "text",
                value: tailText,
              },
            ],
          });
          prevChildren.unshift({
            ...token,
            children: [
              {
                type: "text",
                value: headText,
              },
            ],
          });

          insertions.unshift(insertion);
        }
      }
    }
  }

  return nextChildren;
}
