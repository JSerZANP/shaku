import { IThemedToken } from "shiki";
import { ShakuDirectiveHighlightInline } from "shaku-code-annotate-core";
import { escapeHtml } from "./escapeHtml";

export const renderMarkStart = (id?: number) =>
  `<mark class="shaku-inline-highlight" ${
    id != null ? `data-id="${id}"` : ""
  }>`;
const MarkEnd = `</mark>`;

type Insertion = {
  position: number;
  type: "opening" | "closing";
  id?: string;
};

export function renderInsertion(insertion: Insertion) {
  if (insertion.type === "closing") return MarkEnd;
  return renderMarkStart(insertion.id);
}

function renderToken(token: IThemedToken) {
  return `<span style="color: ${token.color}">${escapeHtml(
    token.content
  )}</span>`;
}

export function renderSourceLineWithInlineHighlight(
  sourceLine: IThemedToken[],
  shakuLine: {
    type: "shaku";
    line: ShakuDirectiveHighlightInline;
    offset: number;
  }
) {
  // we need to insert <mark class="shaku-inline-highlight"></mark>
  // to the source line

  // first calculate where we need do the insertion
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

  let html = "";
  let currentPosition = 0;

  while (true) {
    const insertion = insertions.shift();
    const token = sourceLine.shift();

    if (insertion == null && token == null) {
      break;
    }

    if (insertion == null && token != null) {
      html += renderToken(token);
      currentPosition += token.content.length;
      continue;
    }

    if (token == null && insertion != null) {
      html += renderInsertion(insertion);
      continue;
    }

    if (token != null && insertion != null) {
      // if current position is the insertion point
      if (currentPosition === insertion.position) {
        html += renderInsertion(insertion);
        sourceLine.unshift(token);
      } else {
        // if current position is outside the token
        // safely renders the token
        if (currentPosition + token.content.length <= insertion.position) {
          html += renderToken(token);
          currentPosition += token.content.length;
          insertions.unshift(insertion);
        } else {
          // insertion point is inside the token
          // need to break the token down
          const lengthToSlice = insertion.position - currentPosition;
          const head = token.content.slice(0, lengthToSlice);
          const tail = token.content.slice(lengthToSlice);

          sourceLine.unshift({
            ...token,
            content: tail,
          });
          sourceLine.unshift({
            ...token,
            content: head,
          });

          insertions.unshift(insertion);
        }
      }
    }
  }

  return html;
}

export function renderSourceLine(sourceLine: IThemedToken[]) {
  return sourceLine
    .map(
      (token) =>
        `<span style="color: ${token.color}">${escapeHtml(
          token.content
        )}</span>`
    )
    .join("");
}
