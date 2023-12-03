import {
  ShakuHighlighterOptions,
  getShakuHighlighters,
} from "shaku-code-annotate-core";
import { MarkedExtension, Token, Tokens, marked } from "marked";

export default function markedShakuCodeAnnotate(
  options: ShakuHighlighterOptions = {}
): MarkedExtension {
  return {
    async: true,
    async walkTokens(token) {
      if (token.type !== "code") {
        return;
      }

      // @ts-ignore
      const { lang, meta } = getLangAndMeta(token);
      const code = token.text;

      const highlighters = await getShakuHighlighters({
        ...(options ?? {}),
        // @ts-ignore
        langs: [lang],
      });

      let snippets = "";
      let skipped = false;
      highlighters.forEach((highlighter) => {
        const { html, skipped: _skipped } = highlighter.codeToShakuHtml({
          code,
          meta,
          parseBasicMarkdown: (code) => marked(code),
          options: {
            lang,
          },
        });
        if (_skipped) {
          skipped = _skipped;
        }

        snippets += html;
      });

      if (!skipped) {
        token.text = snippets;
      }
    },
    renderer: {
      code(code) {
        return code;
      },
    },
  };
}

function getLangAndMeta(token: Tokens.Code): {
  lang: string;
  meta: string;
} {
  let lang = "";
  let meta = "";

  if (token.lang) {
    const words = token.lang.split(/\s+/);
    lang = words.shift() ?? "";
    meta = words.join(" ");
  } else {
    // fallback to first line of raw code
    const firstLine = token.raw.split("\n")[0];
    const words = firstLine
      .split(/[^a-zA-Z0-9]/)
      .map((word) => word.trim())
      .filter(Boolean);
    lang = words.shift() ?? "";
    meta = words.join(" ");
  }
  return { lang, meta };
}
