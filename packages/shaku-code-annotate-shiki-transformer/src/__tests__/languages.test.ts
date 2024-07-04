import { expect, test } from "vitest";
import { defaultCode } from "../defaultCode";
import { fetchProcessor } from "./util";

test("should support popular languages", async () => {
  for (const [lang, code] of Object.entries(defaultCode)) {
    const processor = await fetchProcessor(
      lang,
      true /* useDangerousRawHtml */
    );

    const html = await processor
      .process(`\`\`\`${lang} annotate\n${code}\n\`\`\``)
      .then((result) => result.toString());

    console.log("checking lang:" + lang);
    await expect(html).toMatchFileSnapshot(
      __dirname + "/langs/" + lang + "/output.txt"
    );
  }
});
