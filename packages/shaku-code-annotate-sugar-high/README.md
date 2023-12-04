# shaku-code-annotate-sugar-high

Enables Shaku on [Sugar High](https://github.com/huozhi/sugar-high).

Try it out on [Shaku &times; Sugar High](https://shaku-web.vercel.app/sugar-high).

## Usage

```jsx
import { highlight } from "shaku-code-annotate-sugar-high";

const preview = highlight(code);
// generates HTML which has Shaku rendered
```

For styling, you can refer to

1. [sugar-high.css](https://github.com/JSerZANP/shaku/blob/main/examples/web/css/sugar-high.css) - token colors
2. [shaku-sugar-high.css](https://github.com/JSerZANP/shaku/blob/main/examples/web/css/shaku-sugar-high.css) - shaku styles

## Caveat

Markdown is not supported in Shaku &times; Sugar High, for simplicity.

If you want, [shaku-code-annotate-shiki](https://github.com/JSerZANP/shaku/tree/main/packages/shaku-code-annotate-shiki)
might be a better option.
