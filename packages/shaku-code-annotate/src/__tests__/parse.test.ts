import { test, describe, expect } from "vitest";
import { parseLine, shouldApplyAnnotation } from "../index";

describe("parseLine() can parse comment lines", () => {
  test("  -------  ", () => {
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

  test("  ~~~~~~~~  ", () => {
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

  test("  ......  ", () => {
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

  test("   [This is annotation]  ", () => {
    const result = parseLine("   [This is annotation]");
    expect(result).toEqual({
      type: "AnnotationLine",
      config: {
        content: "This is annotation",
        offset: 3,
      },
    });
  });

  test("   ^  ", () => {
    const result = parseLine("   ^  ");
    expect(result).toEqual({
      type: "DirectiveCallout",
      config: {
        offset: 3,
      },
    });
  });

  test("   @collapse start ", () => {
    const result = parseLine("   @collapse start ");
    expect(result).toEqual({
      type: "DirectiveCollapse",
      config: {
        offset: 3,
        mark: "start",
      },
    });
  });

  test("   @collapse end ", () => {
    const result = parseLine("   @collapse end ");
    expect(result).toEqual({
      type: "DirectiveCollapse",
      config: {
        offset: 3,
        mark: "end",
      },
    });
  });

  test("   @collapse unexpected ", () => {
    expect(parseLine("   @collapse unexpected ")).toBeNull();
  });

  test("   @highlight start ", () => {
    const result = parseLine("   @highlight start ");
    expect(result).toEqual({
      type: "DirectiveHighlight",
      config: {
        mark: "start",
      },
    });
  });

  test("   @highlight end ", () => {
    const result = parseLine("   @highlight end ");
    expect(result).toEqual({
      type: "DirectiveHighlight",
      config: {
        mark: "end",
      },
    });
  });

  test("   @highlight ", () => {
    const result = parseLine("   @highlight ");
    expect(result).toEqual({
      type: "DirectiveHighlight",
      config: {
        mark: "below",
      },
    });
  });

  test("   @highlight below ", () => {
    const result = parseLine("   @highlight below ");
    expect(result).toEqual({
      type: "DirectiveHighlight",
      config: {
        mark: "below",
      },
    });
  });

  test("   @highlight unexpected ", () => {
    expect(parseLine("   @highlight unexpected ")).toBeNull();
  });
  test("   @dim start ", () => {
    const result = parseLine("   @dim start ");
    expect(result).toEqual({
      type: "DirectiveDim",
      config: {
        mark: "start",
      },
    });
  });

  test("   @dim end ", () => {
    const result = parseLine("   @dim end ");
    expect(result).toEqual({
      type: "DirectiveDim",
      config: {
        mark: "end",
      },
    });
  });

  test("   @dim ", () => {
    const result = parseLine("   @dim ");
    expect(result).toEqual({
      type: "DirectiveDim",
      config: {
        mark: "below",
      },
    });
  });

  test("   @dim below ", () => {
    const result = parseLine("   @dim below ");
    expect(result).toEqual({
      type: "DirectiveDim",
      config: {
        mark: "below",
      },
    });
  });

  test("   @dim unexpected ", () => {
    expect(parseLine("   @dim unexpected ")).toBeNull();
  });
  test("   @focus start ", () => {
    const result = parseLine("   @focus start ");
    expect(result).toEqual({
      type: "DirectiveFocus",
      config: {
        mark: "start",
      },
    });
  });

  test("   @focus end ", () => {
    const result = parseLine("   @focus end ");
    expect(result).toEqual({
      type: "DirectiveFocus",
      config: {
        mark: "end",
      },
    });
  });

  test("   @focus ", () => {
    const result = parseLine("   @focus ");
    expect(result).toEqual({
      type: "DirectiveFocus",
      config: {
        mark: "below",
      },
    });
  });

  test("   @focus below ", () => {
    const result = parseLine("   @focus below ");
    expect(result).toEqual({
      type: "DirectiveFocus",
      config: {
        mark: "below",
      },
    });
  });

  test("   @focus unexpected ", () => {
    expect(parseLine("   @focus unexpected ")).toBeNull();
  });

  test("This is some comments from source code ", () => {
    const result = parseLine("This is some comments from source code");
    expect(result).toBeNull();
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
