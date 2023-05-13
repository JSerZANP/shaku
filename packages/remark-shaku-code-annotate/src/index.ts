import { visit } from "unist-util-visit";
import type * as mdast from "mdast";
import type * as unified from "unified";
import * as shiki from "shiki";
import { shouldApplyAnnotation, parseLine, renderComponent } from "shaku-code-annotate";

export const remarkShakuCodeAnnotate: unified.Plugin<[], mdast.Root> = () => {
  return async (tree, file) => {
    const highlighter = await shiki.getHighlighter({
      theme: "github-light", // TODO: allow config
    });

    visit(tree, "code", (node, index, parent) => {
      const shouldAnnotate = shouldApplyAnnotation(node.meta ?? "");
      if (!shouldAnnotate) return

      const lines = highlighter.codeToThemedTokens(node.value, node.lang ?? 'txt');

      // generate the html from the tokens
      let html = '<pre class="shiki">';

      html += `<div class="code-container"><code>`

      // first, parse all the lines
      const parsedLines = lines.map(line => {
        if (isCommentLine(line)) {
          // comment might have // or /*
          // meaning comment body might be in the 2nd explanation
          // or 1st one. Does this hold for all languages?
          // @ts-ignore
          const commentBody = (line[0].explanation[1] ?? line[0].explanation[0]).content
          const shakuLine = parseLine(commentBody)
          if (shakuLine != null) {
            return {
              type: 'shaku',
              line: shakuLine,
               // @ts-ignore
              commentTag: line[0].explanation[0].content
            } as const
          }
        }

        return {
          type: 'default',
          line
        } as const
      })

      let shouldHighlighNextSourceLine = false
      let isHighlightingBlock = false
      for (let i = 0; i < parsedLines.length; i++) {
        const line = parsedLines[i]
        switch (line.type) {
          case 'shaku': {
            // for a shaku line, we'll try to move a few steps foward
            // to pick up the necessry lines, including the source code lines,
            // to generate the component, and render it
            const shakuLine = line.line
            switch (shakuLine.type) {
              case 'DirectiveCallout': {
                // callout should be followed by annotationline
                const arrowOffset = shakuLine.config.offset
                let offset = arrowOffset
                const contents = []
                const commentTagLength = line.commentTag.length
              
                let j = i + 1
                while (j < parsedLines.length) {
                  const nextLine = parsedLines[j]
                  if (nextLine.type !== 'shaku' || nextLine.line.type !== 'AnnotationLine') {
                    break
                  }

                  offset = Math.min(offset, nextLine.line.config.offset)
                  contents.push(nextLine.line.config.content)
                  j += 1
                }


                html += renderComponent({
                  type: 'ShakuComponentCallout',
                  config: {
                    offset: offset + commentTagLength,
                    arrowOffset: arrowOffset - offset,
                    contents
                  }
                })

                i = j - 1
                continue
              }
              
              case 'AnnotationLine':
                break
              case 'DirectiveCollapse':
                break
              case 'DirectiveHighlight':
                console.log('DirectiveHighlight', shakuLine);
                const mark = shakuLine.config.mark
                switch (mark) {
                  case 'start':
                    isHighlightingBlock = true
                    break;
                  case 'end':
                    isHighlightingBlock = false
                    break;
                  case 'below':
                  default:
                    shouldHighlighNextSourceLine = true
                    break
                }
                break
              case 'DirectiveUnderline':
                // underline doesn't need to have annotation following
                const underlineOffset = shakuLine.config.offset
                const underlineContent = shakuLine.config.content
                let offset = underlineOffset
                const contents = []
                const commentTagLength = line.commentTag.length
              
                let j = i + 1
                while (j < parsedLines.length) {
                  const nextLine = parsedLines[j]
                  if (nextLine.type !== 'shaku' || nextLine.line.type !== 'AnnotationLine') {
                    break
                  }

                  offset = Math.min(offset, nextLine.line.config.offset)
                  contents.push(nextLine.line.config.content)
                  j += 1
                }


                html += renderComponent({
                  type: 'ShakuComponentUnderline',
                  config: {
                    offset: offset + commentTagLength,
                    underlineOffset: underlineOffset - offset,
                    underlineContent,
                    underlineStyle: shakuLine.config.style,
                    contents
                  }
                })

                i = j - 1
                continue
              default:
                assertsNever(shakuLine)
            }

            break
          }
          case 'default': {
            const shouldHighlight = isHighlightingBlock || shouldHighlighNextSourceLine
            shouldHighlighNextSourceLine = false

            const sourceLine = line.line
            const prefix = `<div class="line ${shouldHighlight ? 'highlight' : ''}">`;

            html += prefix;
            html += sourceLine.map((token) => `<span style="color: ${token.color}">${escapeHtml(
              token.content
            )}</span>`).join('')
            html += `</div>`;
            break
          }
          default:
            assertsNever(line)
        }
        // const tokens = lines[i]
        // if (tokens.length === 0) {
        //   html += `<div class='line'></div>`;
        // } else{
        //   let shakuLine: ReturnType<typeof parseLine> | null = null

        //   if (isCommentLine(tokens)) {
        //     // parse it with shaku
        //     // @ts-ignore
        //     const commentBody = tokens[0].explanation[1].content
        //     shakuLine = parseLine(commentBody)
        //   }
          
        //   if (shakuLine != null){
        //     // it is shaku line
           
        //     switch (shakuLine.type) {
        //       case 'DirectiveCallout':
        //         break
        //       case 'DirectiveCollapse':
        //       case 'DirectiveHighlight':
        //       case 'DirectiveUnderline':
        //         break
        //       case 'AnnotationLine':
        //         throw new Error('AnnotationLine is expected to be after some directive')
        //       default:
        //         assertsNever(shakuLine)
        //     }
        //       const prefix = `<div class="annotate">`;
        //       html += prefix;
        //       html += renderLine(shakuLine)
        //       html += `</div>`;
        //   } else {
        //     // not shaku line
        //     // const hiClass = hasHighlight ? (hl(i) ? " highlight" : " dim") : ""
        //     // const prefix = `<div class='line${hiClass}'>`
        //     const prefix = `<div class="line">`;
        //     html += prefix;

        //     tokens.forEach((token) => {
        //       html += `<span style="color: ${token.color}">${escapeHtml(
        //         token.content
        //       )}</span>`;
        //     });
        //     html += `</div>`;
        //   }
        // }

        // lines.forEach((l, i) => {
        // html += '<p>fuck</p>'
        // if (l.length === 0) {
        //   html += `<div class='line'></div>`;
        // } else if (isAnnotateLine(l)) {
        //   const prefix = `<div class="annotate">`;
        //   html += prefix;

        //   html += processAnnotationLine(l);
        //   html += `</div>`;
      // });
      }

      // html = html.replace(/\n*$/, "") // Get rid of final new lines
      html += `</code></div></pre>`;

      // done processing, generate html
      node.value = html;
      // @ts-ignore expected error
      node.type = "html";
    });
  };
};

function escapeHtml(html: string) {
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function isAnnotateLine(line: shiki.IThemedToken[]) {
  for (const token of line) {
    if (!/^\s+$/.test(token.content) && !/^\/\/\s+\^/.test(token.content)) {
      return false;
    }
  }
  return true;
}

function processAnnotationLine(line: shiki.IThemedToken[]) {
  let html = "";

  for (const token of line) {
    if (/^\s+$/.test(token.content)) {
      html += token.content;
      continue;
    }

    if (/^\/\/\s+\^/.test(token.content)) {
      html += renderDirectiveToken(token);
    }
  }
  return html;
}

function isCommentLine(line: shiki.IThemedToken[]) {
  return line.length === 1 && line[0].explanation?.[0].scopes.some(scope => scope.scopeName.startsWith('comment.'))
}

/**
 * Now we support following syntax
 * //       ^ This is rendered as callout
 * @param token
 * @returns
 */
function renderDirectiveToken(token: shiki.IThemedToken) {
  // //    ^ This is annotation from tech writer.
  let matches = /\/\/(?<space>\s+)\^ (?<comment>.+)$/.exec(token.content);
  if (matches) {
    const {
      // @ts-ignore
      groups: { space, comment },
    } = matches;
    return (
      space +
      " " +
      '<span class="callout"><span class="callout-arrow"></span>' +
      comment +
      "</span>"
    );
  }
  // //                         ^---------------------- This is important
  matches = /\/\/(?<space>\s+)\^(?<dashes>-+)\s+(?<comment>.+)$/.exec(
    token.content
  );
  if (matches) {
    const {
      // @ts-ignore
      groups: { space, dashes, comment },
    } = matches;
    return (
      space +
      "  " +
      '<span class="callout callout-of-dashes"><span class="callout-dashes">' +
      dashes +
      " </span>" +
      comment +
      "</span>"
    );
  }

  matches = /\/\/(?<space>\s+)\^(?<dashes>~+)\s+(?<comment>.+)$/.exec(
    token.content
  );
  if (matches) {
    const {
      // @ts-ignore
      groups: { space, dashes, comment },
    } = matches;
    return (
      space +
      "  " +
      '<span class="callout callout-of-waves"><span class="callout-waves">' +
      dashes +
      " </span>" +
      comment +
      "</span>"
    );
  }
  return (
    '<span class="callout"><span class="callout-arrow"></span>' +
    token.content +
    "</span>"
  );
}

function assertsNever(data: never) {
  throw new Error('expected never but got: ' + data)
}