import { expect, test } from "vitest";
import html from "remark-html";
import { remark } from "remark";
import { defaultCode } from "../defaultCode";
import { getShakuHighlighters } from "../getHighlighters";
import { options } from "sanitize-html";

test("should support popular languages", async () => {
  for (const [lang, code] of Object.entries(defaultCode)) {
    const highlighters = await getShakuHighlighters({
      // @ts-ignore
      langs: [lang],
    });

    const html = highlighters
      .map((highlighter) =>
        highlighter.codeToShakuHtml({
          code,
          parseBasicMd: (code) => code,
          options: {
            lang,
          },
        })
      )
      .join("\n");

    console.log("checking lang:" + lang);
    await expect(html).toMatchFileSnapshot(
      __dirname + "/langs/" + lang + "/output.txt"
    );
  }
});
