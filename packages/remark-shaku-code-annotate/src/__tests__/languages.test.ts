import { expect, test } from "vitest";
import html from "remark-html";
import { remark } from "remark";
import { remarkShakuCodeAnnotate } from "../index";
import fs from "fs";

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
  const dirs = fs
    .readdirSync(__dirname + "/langs", { withFileTypes: true })
    .filter((file) => file.isDirectory());
  for (const dir of dirs) {
    const input = fs.readFileSync(
      __dirname + "/langs/" + dir.name + "/input.txt",
      { encoding: "utf-8" }
    );
    const output = fs.readFileSync(
      __dirname + "/langs/" + dir.name + "/output.txt",
      { encoding: "utf-8" }
    );
    const processed = (await process(input)).value;
    const isEqual = processed == output;
    if (!isEqual) {
      throw "snapshot doesn't match for lang: " + dir.name;
    }
  }
});
