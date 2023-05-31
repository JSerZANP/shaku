import { test, describe, expect } from "vitest";
import { parseLine, shouldApplyAnnotation } from "../index";

describe("parseLine() can parse comment lines", () => {
  test("  -------  ", async () => {
    const result = parseLine("  -------");
    expect(result).toEqual({
      type: "DirectiveUnderline",
      config: {
        content: "-------",
        offset: 2,
        style: "solid",
      },
    });
  });

  test("  ~~~~~~~~  ", async () => {
    const result = parseLine("  ~~~~~~~~");
    expect(result).toEqual({
      type: "DirectiveUnderline",
      config: {
        content: "~~~~~~~~",
        offset: 2,
        style: "wavy",
      },
    });
  });

  test("  ......  ", async () => {
    const result = parseLine("  ......");
    expect(result).toEqual({
      type: "DirectiveUnderline",
      config: {
        content: "......",
        offset: 2,
        style: "dotted",
      },
    });
  });

  test("   [This is annotation]  ", async () => {
    const result = parseLine("   [This is annotation]");
    expect(result).toEqual({
      type: "AnnotationLine",
      config: {
        content: "This is annotation",
        offset: 3,
      },
    });
  });

  test("   [This is annotation]  ", async () => {
    const result = parseLine("   [This is annotation]");
    expect(result).toEqual({
      type: "AnnotationLine",
      config: {
        content: "This is annotation",
        offset: 3,
      },
    });
  });

  test("   ^  ", async () => {
    const result = parseLine("   ^  ");
    expect(result).toEqual({
      type: "DirectiveCallout",
      config: {
        offset: 3,
      },
    });
  });

  test("   @collapse start ", async () => {
    const result = parseLine("   @collapse start ");
    expect(result).toEqual({
      type: "DirectiveCollapse",
      config: {
        offset: 3,
        mark: "start",
      },
    });
  });

  test("   @collapse end ", async () => {
    const result = parseLine("   @collapse end ");
    expect(result).toEqual({
      type: "DirectiveCollapse",
      config: {
        offset: 3,
        mark: "end",
      },
    });
  });

  test("   @collapse unexpected ", async () => {
    expect(parseLine("   @collapse unexpected ")).toBeNull();
  });

  test("   @highlight start ", async () => {
    const result = parseLine("   @highlight start ");
    expect(result).toEqual({
      type: "DirectiveHighlight",
      config: {
        mark: "start",
      },
    });
  });

  test("   @highlight end ", async () => {
    const result = parseLine("   @highlight end ");
    expect(result).toEqual({
      type: "DirectiveHighlight",
      config: {
        mark: "end",
      },
    });
  });

  test("   @highlight ", async () => {
    const result = parseLine("   @highlight ");
    expect(result).toEqual({
      type: "DirectiveHighlight",
      config: {
        mark: "below",
      },
    });
  });

  test("   @highlight below ", async () => {
    const result = parseLine("   @highlight below ");
    expect(result).toEqual({
      type: "DirectiveHighlight",
      config: {
        mark: "below",
      },
    });
  });

  test("   @highlight unexpected ", async () => {
    expect(parseLine("   @highlight unexpected ")).toBeNull();
  });
  test("   @dim start ", async () => {
    const result = parseLine("   @dim start ");
    expect(result).toEqual({
      type: "DirectiveDim",
      config: {
        mark: "start",
      },
    });
  });

  test("   @dim end ", async () => {
    const result = parseLine("   @dim end ");
    expect(result).toEqual({
      type: "DirectiveDim",
      config: {
        mark: "end",
      },
    });
  });

  test("   @dim ", async () => {
    const result = parseLine("   @dim ");
    expect(result).toEqual({
      type: "DirectiveDim",
      config: {
        mark: "below",
      },
    });
  });

  test("   @dim below ", async () => {
    const result = parseLine("   @dim below ");
    expect(result).toEqual({
      type: "DirectiveDim",
      config: {
        mark: "below",
      },
    });
  });

  test("   @dim unexpected ", async () => {
    expect(parseLine("   @dim unexpected ")).toBeNull();
  });
  test("   @focus start ", async () => {
    const result = parseLine("   @focus start ");
    expect(result).toEqual({
      type: "DirectiveFocus",
      config: {
        mark: "start",
      },
    });
  });

  test("   @focus end ", async () => {
    const result = parseLine("   @focus end ");
    expect(result).toEqual({
      type: "DirectiveFocus",
      config: {
        mark: "end",
      },
    });
  });

  test("   @focus ", async () => {
    const result = parseLine("   @focus ");
    expect(result).toEqual({
      type: "DirectiveFocus",
      config: {
        mark: "below",
      },
    });
  });

  test("   @focus below ", async () => {
    const result = parseLine("   @focus below ");
    expect(result).toEqual({
      type: "DirectiveFocus",
      config: {
        mark: "below",
      },
    });
  });

  test("   @focus unexpected ", async () => {
    expect(parseLine("   @focus unexpected ")).toBeNull();
  });

  test("This is some comments from source code ", async () => {
    const result = parseLine("This is some comments from source code");
    expect(result).toBeNull();
  });

  test("  */", async () => {
    const result = parseLine("  */");
    expect(result).toEqual({
      type: "CommentEnd",
    });
  });
});

describe("shouldApplyAnnotation() should work", () => {
  test(" annotate ", () => {
    expect(shouldApplyAnnotation(" annotate ")).toBeTruthy();
  });

  test(" ", () => {
    expect(shouldApplyAnnotation("  ")).toBeFalsy();
  });
});
