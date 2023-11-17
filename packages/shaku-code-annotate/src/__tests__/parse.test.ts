import { test, describe, expect } from "vitest";
import { parseLine, shouldApplyAnnotation } from "../index";

describe("parseLine() can parse comment lines", () => {
  test("  -------  ", () => {
    const result = parseLine("  -------");
    expect(result).toMatchSnapshot();
  });

  test("  ~~~~~~~~  ", () => {
    const result = parseLine("  ~~~~~~~~");
    expect(result).toMatchSnapshot();
  });

  test("  ......  ", () => {
    const result = parseLine("  ......");
    expect(result).toMatchSnapshot();
  });

  test("   [This is annotation]  ", () => {
    const result = parseLine("   [This is annotation]");
    expect(result).toMatchSnapshot();
  });

  test("   ^  ", () => {
    const result = parseLine("   ^  ");
    expect(result).toMatchSnapshot();
  });

  test("   ^  ", () => {
    const result = parseLine("   ^  ");
    expect(result).toMatchSnapshot();
  });

  test("   @collapse start ", () => {
    const result = parseLine("   @collapse start ");
    expect(result).toMatchSnapshot();
  });

  test("   @collapse end ", () => {
    const result = parseLine("   @collapse end ");
    expect(result).toMatchSnapshot();
  });

  test("   @collapse unexpected ", () => {
    expect(parseLine("   @collapse unexpected ")).toBeNull();
  });

  test("   @highlight start ", () => {
    const result = parseLine("   @highlight start ");
    expect(result).toMatchSnapshot();
  });

  test("   @highlight end ", () => {
    const result = parseLine("   @highlight end ");
    expect(result).toMatchSnapshot();
  });

  test("   @highlight ", () => {
    const result = parseLine("   @highlight ");
    expect(result).toMatchSnapshot();
  });

  test("   @highlight below ", () => {
    const result = parseLine("   @highlight below ");
    expect(result).toMatchSnapshot();
  });

  test("   @highlight unexpected ", () => {
    expect(parseLine("   @highlight unexpected ")).toBeNull();
  });
  test("   @dim start ", () => {
    const result = parseLine("   @dim start ");
    expect(result).toMatchSnapshot();
  });

  test("   @dim end ", () => {
    const result = parseLine("   @dim end ");
    expect(result).toMatchSnapshot();
  });

  test("   @dim ", () => {
    const result = parseLine("   @dim ");
    expect(result).toMatchSnapshot();
  });

  test("   @dim below ", () => {
    const result = parseLine("   @dim below ");
    expect(result).toMatchSnapshot();
  });

  test("   @dim unexpected ", () => {
    expect(parseLine("   @dim unexpected ")).toBeNull();
  });
  test("   @focus start ", () => {
    const result = parseLine("   @focus start ");
    expect(result).toMatchSnapshot();
  });

  test("   @focus end ", () => {
    const result = parseLine("   @focus end ");
    expect(result).toMatchSnapshot();
  });

  test("   @focus ", () => {
    const result = parseLine("   @focus ");
    expect(result).toMatchSnapshot();
  });

  test("   @focus below ", () => {
    const result = parseLine("   @focus below ");
    expect(result).toMatchSnapshot();
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
