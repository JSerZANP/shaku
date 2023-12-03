# shaku-code-annotate-core

The parser of comments for Shaku.

## Usage

```ts
import { parseLine } from "shaku-code-annotate-core";

const shakuLine = parseLine("@highlight");
// {
//   type: "DirectiveHighlight";
//   config: {
//       isEscaped: boolean;
//       mark: "start" | "end" | "below";
//   };
// };
```
