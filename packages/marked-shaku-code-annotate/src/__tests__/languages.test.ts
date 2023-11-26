import { expect, test } from "vitest";
import html from "remark-html";
import { Marked } from "marked";
import markedShakuCodeAnnotate from "../index";
import { defaultCode } from "shaku-code-annotate";

const marked = new Marked(markedShakuCodeAnnotate());

test("should support popular languages", async () => {
  for (const [lang, code] of Object.entries(defaultCode)) {
    const processed = await marked.parse(
      `
\`\`\`${lang} annotate
${code}
\`\`\`
`
    );
    console.log("checking lang:" + lang);
    await expect(String(processed)).toMatchFileSnapshot(
      __dirname + "/langs/" + lang + "/output.txt"
    );
  }
});
