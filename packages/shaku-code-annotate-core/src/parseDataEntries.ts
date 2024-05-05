/**
 * Be careful with the input, value might contain space and wrapped in quotes
 * a="b c" d=ef
 * @param entriesStr
 * @returns
 */
export function parseDataEntries(entriesStr: string) {
  const result: Array<{ key: string; value: string }> = [];
  const tokens = [...tokenizeDataEntries(entriesStr)];
  // tokens should follow literal=literal or literal="literal" pattern
  // if not match, we just ignore them and start with next literal
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const first3Tokens = tokens.slice(i, i + 3);
    if (isPattern1(first3Tokens)) {
      const [key, equal, value] = first3Tokens;
      result.push({
        key: key.value!,
        value: value.value!,
      });
      continue;
    }

    const first5Tokens = tokens.slice(i, i + 5);
    if (isPattern2(first5Tokens)) {
      const [key, equal, quote1, value, quote2] = first5Tokens;
      result.push({
        key: key.value!,
        value: value.value!,
      });
      continue;
    }
  }
  return result;
}

type Token = {
  type: "literal" | "equal" | "quote";
  value?: string;
};

type Pattern1 = [
  { type: "literal"; value: string },
  { type: "equal" },
  { type: "literal"; value: string }
];

type Pattern2 = [
  { type: "literal"; value: string },
  { type: "equal" },
  { type: "quote" },
  { type: "literal"; value: string },
  { type: "quote" }
];

function isPattern1(arr: Token[]): arr is Pattern1 {
  return (
    arr.length === 3 &&
    arr[0].type === "literal" &&
    arr[1].type === "equal" &&
    arr[2].type === "literal"
  );
}
function isPattern2(arr: Token[]): arr is Pattern2 {
  return (
    arr.length === 5 &&
    arr[0].type === "literal" &&
    arr[1].type === "equal" &&
    arr[2].type === "quote" &&
    arr[3].type === "literal" &&
    arr[4].type === "quote"
  );
}

export function* tokenizeDataEntries(entriesStr: string) {
  let currentValue = "";
  let currentType: "literal" | null = null;
  let isWithinQuote = false;
  let isEscapeNext = false;

  for (const char of entriesStr) {
    switch (char) {
      case " ": {
        // for space we only want to care about if it is within a quote
        if (isWithinQuote) {
          currentValue += char;
        } else {
          if (currentType) {
            yield {
              type: currentType,
              value: currentValue,
            };
            currentValue = "";
            currentType = null;
          }
        }
        break;
      }
      case '"': {
        if (currentType) {
          yield {
            type: currentType,
            value: currentValue,
          };
          currentValue = "";
          currentType = null;
        }

        isWithinQuote = !isWithinQuote;
        yield {
          type: "quote" as const,
        };

        break;
      }
      case "=": {
        if (currentType) {
          yield {
            type: currentType,
            value: currentValue,
          };
          currentValue = "";
          currentType = null;
        }
        yield {
          type: "equal" as const,
        };
        break;
      }
      default: {
        if (currentType) {
          currentValue += char;
        } else {
          currentType = "literal";
          currentValue += char;
        }
      }
    }
  }
  if (currentType) {
    yield {
      type: currentType,
      value: currentValue,
    };
    currentValue = "";
    currentType = null;
  }
}

function filterNonNull<T>(arr: (T | null)[]): T[] {
  return arr.filter((item): item is T => item !== null);
}
