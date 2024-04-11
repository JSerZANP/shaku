import { test, describe, expect } from "vitest";
import { parseLine, shouldApplyAnnotation } from "../parser";

describe("parseLine() can parse comment lines", () => {
  const inputs = [
    "  -------  ",
    "  -------!",
    "  ------- !",
    "  -------<  ",
    "  -------<! ",
    "  ------- <<  ",
    "  ------- <<  ",
    "  ------- << !  ",
    "  ~~~~~~~~<  ",
    "  ~~~~~~~~ << ",
    "  ......  ",
    "  ......! ",
    "  ......!! ",
    "  ......<  ",
    "  ......<!  ",
    "  ...... <<  ",
    "  ...... <<!  ",
    "   [This is annotation]  ",
    "   [This is annotation]!  ",
    "   [This is annotation]<  ",
    "   [This is annotation]< !",
    "   [This is annotation] <<<  ",
    "   [This is annotation] <<< !  ",
    "   ^  ",
    "   ^!  ",
    "   ^ !  ",
    "   ^<  ",
    "   ^<!  ",
    "   ^<!!  ",
    "   ^ <<< ",
    "   ^ <<<! ",
    "   ^ <<< ! ",
    "   @fold start ",
    "   @fold start! ",
    "   @fold start ! ",
    "   @fold end ",
    "   @fold end !",
    "   @fold unexpected ",
    "   @fold unexpected !",
    "   @highlight start ",
    "   @highlight start! ",
    "   @highlight end ",
    "   @highlight end ! ",
    "   @highlight ",
    "   @highlight !",
    "   @highlight below ",
    "   @highlight below !",
    "   @highlight unexpected ",
    "   @highlight unexpected !",
    "   @dim start ",
    "   @dim start !",
    "   @dim end ",
    "   @dim end !",
    "   @dim ",
    "   @dim !",
    "   @dim below",
    "   @dim below !",
    "   @focus start ",
    "   @focus start!",
    "   @focus end ",
    "   @focus end ! ",
    "   @focus ",
    "   @focus !",
    "   @focus below ",
    "   @focus below! ",
    "   @focus below ",
    "()",
    "() !",
    "()()()",
    "()()() !",
    "()()() !\n",
    " ( )  ( )   ()   ",
    " ( )  ( )   () !  ",
    "(1)",
    "(1)!",
    "(1)(1)(10)",
    "(1)(1)(10)\n",
    "(1)(1)(10) !",
    " (0)  (2 )   (0)   ",
    " (0)  (2 )   (0)   !",
    " ((",
    " ((!",
    " (0)  (2 )   0",
    " (0)  (2 )   0!",
    " (0)  (2 )<",
    " (0)  (2 )<!",
    "   (0)  (2 ) <<<",
    "   (0)  (2 ) <<<  !",
    "@diff ",
    " @diff !",
    "   @diff + ",
    "   @diff  -  ",
    "   @diff - !",
    "   @diff + below",
    "   @diff + start",
    "   @diff  -  end   ",
    "   @diff unexpected ",
    "@diff unexpected !",
    " @diff + unexpected ",
    "    @highlight v   ",
    "    @highlight ^",
    " @dim v",
    " @dim ^ ",
    "   @focus v  ",
    " @focus ^",
    " @diff   +   v   ",
    "   @diff   +   ^   ",
    "@diff - v",
    "@diff -   ^  ",
    "   (r)(g)(b) ",
    " (red) (green) (blue) ",
    "@class a",
    "@class a!  ",
    "@class abc efg h123   ",
    "@class abc efg h123!",
    "@class abc-1 efg-2 h123!",
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
