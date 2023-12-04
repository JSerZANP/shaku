import { expect, test } from "vitest";
import { defaultCode } from "../defaultCode";
import { getShakuHighlighters } from "../getHighlighters";

test("should support popular languages", async () => {
  for (const [lang, code] of Object.entries(defaultCode)) {
    const highlighters = await getShakuHighlighters({
      // @ts-ignore
      langs: [lang],
    });

    const html = highlighters
      .map(
        (highlighter) =>
          highlighter.codeToShakuHtml({
            code,
            options: {
              lang,
            },
          }).html
      )
      .join("\n");

    console.log("checking lang:" + lang);
    await expect(html).toMatchFileSnapshot(
      __dirname + "/langs/" + lang + "/output.txt"
    );
  }
});
