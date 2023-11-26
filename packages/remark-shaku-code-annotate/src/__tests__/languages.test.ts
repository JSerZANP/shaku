import { expect, test } from "vitest";
import html from "remark-html";
import { remark } from "remark";
import { remarkShakuCodeAnnotate } from "../index";
import { defaultCode } from "shaku-code-annotate";

async function process(md: string) {
  const processor = remark()
    .use(remarkShakuCodeAnnotate, {
      theme: "github-light",
    })
    .use(html, { sanitize: false });
  const result = await processor.process(md);
  return result;
}

test("should support popular languages", async () => {
  for (const [lang, code] of Object.entries(defaultCode)) {
    const processed = (
      await process(
        `
\`\`\`${lang} annotate
${code}
\`\`\`
`
      )
    ).value;
    console.log("checking lang:" + lang);
    await expect(String(processed)).toMatchFileSnapshot(
      __dirname + "/langs/" + lang + "/output.txt"
    );
  }
});
