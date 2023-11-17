import { test, describe, expect } from "vitest";
import { parseLine, shouldApplyAnnotation } from "../index";

describe("parseLine() can parse comment lines", () => {
  const inputs = [
    "  -------  ",
    "  ~~~~~~~~  ",
    "  ......  ",
    "   [This is annotation]  ",
    "   ^  ",
    "   @collapse start ",
    "   @collapse end ",
    "   @collapse unexpected ",
    "   @highlight start ",
    "   @highlight end ",
    "   @highlight ",
    "   @highlight below ",
    "   @highlight unexpected ",
    "   @dim start ",
    "   @dim end ",
    "   @dim ",
    "   @dim below",
    "   @focus start ",
    "   @focus end ",
    "   @focus ",
    "   @focus below ",
  ];
  for (const input of inputs) {
    test(input, () => {
      expect(parseLine(input)).toMatchSnapshot();
    });
  }

  test("   @dim unexpected ", () => {
    expect(parseLine("   @dim unexpected ")).toBeNull();
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
