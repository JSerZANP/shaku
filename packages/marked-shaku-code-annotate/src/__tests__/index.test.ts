import { describe, expect, test } from "vitest";
import { marked } from "marked";
import markedShakuCodeAnnotate from "../index";

describe("marked-shaku-code-annotate", async () => {
  const markdown = `
\`\`\`javascript annotate
  const highlight = "code";
\`\`\`
  `;
  marked.use(markedShakuCodeAnnotate());
  console.log("hello", await marked(markdown));
  test("should work", () => {
    expect(1).toBe(1);
  });
});
