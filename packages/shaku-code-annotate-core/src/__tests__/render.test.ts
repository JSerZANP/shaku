import { test, describe, expect } from "vitest";
import { renderComponent } from "../parser";

describe("renderComponent() can render shaku lines + raw HTML ", () => {
  test("ShakuComponentCallout", () => {
    const callout = {
      type: "ShakuComponentCallout",
      config: {
        offset: 5,
        arrowOffset: 3,
        contents:
          '<p><b>This is</b> <em>line</em> <i>1</i> <a href="https://jser.dev">jser.dev</a></p><p><strong>This</strong> <script>alert(3)</script><div>is</div>line 2</p>',
      },
    } as const;
    expect(
      renderComponent(callout, { useDangerousRawHtml: true })
    ).toMatchSnapshot();
  });

  test("ShakuComponentCallout", () => {
    const underline = {
      type: "ShakuComponentCallout",
      config: {
        offset: 5,
        arrowOffset: 3,
        contents:
          '<p><b>This is</b> <em>line</em> <i>1</i> <a href="https://jser.dev">jser.dev</a></p><p><strong>This</strong> <script>alert(3)</script><div>is</div>line 2</p>',
      },
    } as const;
    expect(
      renderComponent(underline, { useDangerousRawHtml: true })
    ).toMatchSnapshot();
  });
});

describe("renderComponent() can render shaku lines and escape HTML by default ", () => {
  test("ShakuComponentCallout", () => {
    const callout = {
      type: "ShakuComponentCallout",
      config: {
        offset: 5,
        arrowOffset: 3,
        contents:
          '<p><b>This is</b> <em>line</em> <i>1</i> <a href="https://jser.dev">jser.dev</a></p><p><strong>This</strong> <script>alert(3)</script><div>is</div>line 2</p>',
      },
    } as const;
    expect(renderComponent(callout)).toMatchSnapshot();
  });

  test("ShakuComponentCallout", () => {
    const underline = {
      type: "ShakuComponentCallout",
      config: {
        offset: 5,
        arrowOffset: 3,
        contents:
          '<p><b>This is</b> <em>line</em> <i>1</i> <a href="https://jser.dev">jser.dev</a></p><p><strong>This</strong> <script>alert(3)</script><div>is</div>line 2</p>',
      },
    } as const;
    expect(renderComponent(underline)).toMatchSnapshot();
  });
});
