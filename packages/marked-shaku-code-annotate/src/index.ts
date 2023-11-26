import {
  getShakuHighlighters,
  shouldApplyAnnotation,
} from "shaku-code-annotate";
import { MarkedExtension, Token, Tokens, marked } from "marked";

export default function markedShakuCodeAnnotate(options = {}): MarkedExtension {
  return {
    async: true,
    async walkTokens(token) {
      if (token.type !== "code") {
        return;
      }

      // @ts-ignore
      const { lang, meta } = getLangAndMeta(token);
      const code = token.text;

      if (!shouldApplyAnnotation(meta)) {
        return;
      }

      const highlighters = await getShakuHighlighters({
        ...(options ?? {}),
        // @ts-ignore
        langs: [lang],
      });

      const html = highlighters
        .map((highlighter) =>
          highlighter.codeToShakuHtml({
            code,
            parseBasicMd: (code) => marked(code),
            options: {
              lang,
            },
          })
        )
        .join("\n");
      token.text = html;
    },
    renderer: {
      code(code, infoString, escaped) {
        return code;
        // const lang = (infoString || "").match(/\S*/)[0];
        // const classAttr = lang
        //   ? ` class="${options.langPrefix}${escape(lang)}"`
        //   : "";
        // code = code.replace(/\n$/, "");
        // return `<pre><code${classAttr}>${
        //   escaped ? code : escape(code, true)
        // }\n</code></pre>`;
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
