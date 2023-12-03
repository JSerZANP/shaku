import { test, describe, expect } from "vitest";
import { renderComponent } from "../parser";

describe("renderComponent() can render shaku lines and sanitize html", () => {
  test("ShakuComponentCallout", () => {
    const result = renderComponent({
      type: "ShakuComponentCallout",
      config: {
        offset: 5,
        arrowOffset: 3,
        contents:
          '<p><b>This is</b> <em>line</em> <i>1</i> <a href="https://jser.dev">jser.dev</a></p><p><strong>This</strong> <script>alert(3)</script><div>is</div>line 2</p>',
      },
    });
    expect(result).toEqual(
      '<div class="shaku-callout" style="left:5ch"><span class="shaku-callout-arrow" style="left:3ch"></span><p><b>This is</b> <em>line</em> <i>1</i> <a href="https://jser.dev">jser.dev</a></p><p><strong>This</strong> </p>isline 2<p></p></div>'
    );
  });

  test("ShakuComponentCallout", () => {
    const result = renderComponent({
      type: "ShakuComponentUnderline",
      config: {
        offset: 5,
        underlineOffset: 3,
        underlineContent: "-----",
        underlineStyle: "dotted",
        contents:
          '<p><b>This is</b> <em>line</em> <i>1</i> <a href="https://jser.dev">jser.dev</a></p><p><strong>This</strong> <script>alert(3)</script><div>is</div>line 2</p>',
      },
    });
    expect(result).toEqual(
      '<div class="shaku-underline shaku-underline-dotted" style="left:5ch"><span class="shaku-underline-line" style="left:3ch">-----</span><p><b>This is</b> <em>line</em> <i>1</i> <a href="https://jser.dev">jser.dev</a></p><p><strong>This</strong> </p>isline 2<p></p></div>'
    );
  });
});
