import { describe, expect, test } from "vitest";
import { parseDataEntries, tokenizeDataEntries } from "../parseDataEntries";

describe("parseDataEntries()", () => {
  const inputs = [
    "key1=value1",
    " key1=value1 ",
    " key1=value1 key2=value2",
    " key1=value1    key2=value2   ",
    "  key1=value1 key2=value2 key3=value3   ",
    '  key1="value1" key2="value 2 2 " key3=value3   ',
  ];
  for (const input of inputs) {
    test(input, () => {
      expect(parseDataEntries(input)).toMatchSnapshot();
    });
  }
});
