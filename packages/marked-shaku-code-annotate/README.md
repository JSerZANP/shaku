# marked-shaku-code-annotate

This is a plugin of [marked](https://github.com/markedjs/marked) for [shaku-code-annotate](../shaku-code-annotate/)

Take a look at the demos on:

1. [Shaku playground](https://shaku-web.vercel.app) (set the engine to `marked`)

# How to use

```js

import { Marked } from "marked";
import markedShakuCodeAnnotate from "marked-shaku-code-annotate";

const marked = new Marked();
marked.use(
  markedShakuCodeAnnotate({
    langs: ["javascript", "css", "jsx", "html", "typescript", "tsx"],

    // You can render multiple themes
    // themes: ["github-light", "github-dark"],
    theme: "github-light",

    // Use following flag if you don't want to fall back to shiki when `annotate` is not set
    // fallbackToShiki: false

    // Following paths are for client-side, example is for next.js
    // paths: {
    //   themes: "/_next/static/shiki/themes",
    //   wasm: "/_next/static/shiki/dist",
    //   languages: "/_next/static/shiki/languages",
    // },
  })
);

// You should be responsible for the sanitization!!!!

  const markdown = `
\`\`\`js annotate

const blog = "https://jser.dev"
//                    ^
//       [JSer.dev is the **homepage** for JSer.]
//       [Check it out! [jser.dev](https://jser.dev)]

const blog = "https://jser.dev"
//                    ~~~~~~~~
//       [JSer.dev is the homepage for JSer.]
//       [Check it out!]

const blog = "jser.dev"
//            --------
//          [Check it out!]

const blog = "jser.dev"
//            ........
//          [Check it out!]


const blog = "jser.dev"
//            ........

const blog = "jser.dev"
//            --------
const blog = "jser.dev"
//            ~~~~~~~~

// @highlight
function useSomeEffect({blog}) {
//       ~~~~~~~~~~~~~
  useEffect(() => {
    // do some stuff

// @highlight start
      return () => {
        location.href = 'https://jser.dev'
      }
//    ^
// [This cleanup function is super important]
// @highlight end

    }, [blog])
}

// @dim
function foo() {
  console.log("Hello!")
// @dim start
  setTimeout(() => {
    console.log("World!")
  },1000)
// @dim end

// @focus
function foo(){
  console.log("Hello!")
// @focus start
  setTimeout(() => {
    console.log('World!')
  },1000)
// @focus end

}

\`\`\`
`;

const html = await marked.parse(markdownShaku);
...

```

Also you need CSS code to get it rendered nicely, surely you can alter it and adapt to your needs.

> Check out the [CSS code used on Shaku homepage](https://github.com/JSerZANP/shaku/blob/main/examples/web/css/shaku.css)

```css
pre.shaku {
  padding: 1rem;
  border: 1px solid #eee;
}

pre.shaku .line {
  min-height: 1em;
  line-height: 1.5;
}

pre.shaku.github-light .line.highlight {
  background-color: var(
    --color-shaku-highlight-light,
    color-mix(in srgb, rgb(5, 118, 149) 15%, #fff)
  );
  display: block;
}

pre.shaku.github-dark .line.highlight {
  background-color: var(--color-shaku-highlight-dark, #2b4a70);
  display: block;
}

pre.shaku .line.dim {
  opacity: 0.3;
}

.shaku-callout {
  background-color: var(--color-shaku-callout-light, #0685ce);
  color: #fff;
  padding: 0.5em 1ch;
  position: relative;
  margin: 0.5em 0 0 -0.2ch;
  display: inline-block;
  border-radius: 2px;
}

pre.shaku.github-dark .shaku-callout {
  background-color: var(--color-shaku-callout-dark, #0685ce);
}

.shaku-callout p {
  margin: 0;
}

.shaku-callout p a {
  color: #fff;
}

.shaku-callout-arrow {
  width: 1ch;
  height: 1ch;
  display: inline-block;
  background-color: var(--color-shaku-callout-light, #0685ce);
  position: absolute;
  top: -0.5ch;
  transform: rotate(45deg);
  margin-left: 0.2ch;
}
pre.shaku.github-dark .shaku-callout-arrow {
  background-color: var(--color-shaku-callout-dark, #0685ce);
}

.shaku-underline {
  padding: 0 1ch;
  position: relative;
  display: block;
  border-radius: 3px;
  color: var(--color-shaku-underline-light, red);
  margin: 0;
  width: min-content;
}
pre.shaku.github-dark .shaku-underline {
  color: var(--color-shaku-underline-dark, red);
}

.shaku-underline p {
  margin: 0;
}

.shaku-underline a {
  color: var(--color-shaku-underline-light, red);
}
pre.shaku.github-dark .shaku-underline a {
  color: var(--color-shaku-underline-dark, red);
}

.shaku-underline-line {
  line-height: 0;
  top: 0.5em;
  position: absolute;
  text-decoration-line: overline;
  text-decoration-color: var(--color-shaku-underline-light, red);
  color: transparent;
  pointer-events: none;
  user-select: none;
  text-decoration-thickness: 2px;
}

pre.shaku.github-dark .shaku-underline-line {
  text-decoration-color: var(--color-shaku-underline-dark, red);
}

.shaku-underline-wavy > .shaku-underline-line {
  text-decoration-style: wavy;
  top: 0.7em;
}

.shaku-underline-solid > .shaku-underline-line {
  text-decoration-style: solid;
}

.shaku-underline-dotted > .shaku-underline-line {
  text-decoration-style: dotted;
}

.shaku-inline-highlight {
  background-color: #05a4fa30;
  border-bottom: 2px solid rgb(9, 113, 239);
  margin: 0 1px;
  border-radius: 3px;
  padding: 0 3px;
}

.shaku-inline-highlight[data-id="1"] {
  background-color: #05a4fa30;
  border-bottom: 2px solid rgb(9, 113, 239);
}

.shaku-inline-highlight[data-id="2"] {
  background-color: #fa05f230;
  border-bottom: 2px solid rgb(235, 4, 158);
}

.shaku-inline-highlight[data-id="3"] {
  background-color: #05faa930;
  border-bottom: 2px solid green;
}
```

# Dark Mode support.

Multiple code blocks are rendered if you pass `themes` rather than `theme`.
Each code block is marked with its theme name as class name, then you can
easily support dark mode by hiding one or another.

For example.

```js
marked.use(markedShakuCodeAnnotate, {
  themes: ["github-dark", "github-light"],
});
```
