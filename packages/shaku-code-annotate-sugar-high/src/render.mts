import { ShakuDirectiveHighlightInline } from "shaku-code-annotate-core";
import { Token } from "./types.mjs";
import { escapeHtml } from "./escapeHtml.mjs";

export const renderMarkStart = (id?: number) =>
  `<mark class="shaku-inline-highlight" ${
    id != null ? `data-id="${id}"` : ""
  }>`;
const MarkEnd = `</mark>`;

type Insertion = {
  position: number;
  type: "opening" | "closing";
  id?: number;
};

export function renderInsertion(insertion: Insertion) {
  if (insertion.type === "closing") return MarkEnd;
  return renderMarkStart(insertion.id);
}

function renderToken(token: Token) {
  return `<span class="sh__token--${token.type}" style="color: var(--sh-${
    token.type
  })">${escapeHtml(token.content)}</span>`;
}

export function renderSourceLineWithInlineHighlight(
  sourceLine: Token[],
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

export function renderSourceLine(sourceLine: Token[]) {
  return sourceLine.map(renderToken).join("");
}
