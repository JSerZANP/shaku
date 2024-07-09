import { $ } from "migacss";
import Head from "next/head";
import { FaDiscord } from "react-icons/fa";
import { CodeBlock } from "../components/CodeBlock";
import styles from "../components/CodePreview/CodePreview.module.css";
import { Heading } from "../components/Heading";
import { TOC } from "../components/TOC";
export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className={`article ${styles.preview}`}>
      <Head>
        <title>Shaku</title>
      </Head>
      <$.div $maxWidth={690} $margin="0 auto" $padding={"0 2rem 2rem"}>
        <$.nav
          $display="flex"
          $alignItems="center"
          $justifyContent="center"
          $padding="1rem"
          $gap="1rem"
          $fontSize={"14px"}
          $borderBottom={"1px solid var(--color-line-3rd)"}
        >
          <a href="/playground">Playground</a>
          <a href="/snippet">Snippet</a>
          <a href="/sugar-high">Shaku &times; Sugar High</a>
          <$.a
            href="https://discord.com/invite/bFh8EzW7kv"
            $display="inline-flex"
            title="discord"
          >
            <FaDiscord size="20"></FaDiscord>
          </$.a>
        </$.nav>
        <$.h1 $textAlign="center">Shaku - code annotation made easy</$.h1>
        <p>
          <a href="https://github.com/JSerZANP/shaku">Shaku</a> makes it super
          easy to annotate code with special directives in comments.
        </p>
        <TOC>
          <ul>
            <li>
              <a href="#a-very-basic-example">1. A very basic example</a>
            </li>

            <li>
              <a href="#usage">2. Usage</a>
            </li>
            <li>
              <a href="#supported-languages">3. Supported Languages</a>
            </li>
            <li>
              <a href="#styling">4. Styling</a>
              <ul>
                <li>
                  <a href="#dark-mode-support">Dark mode support</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#syntax">5. Syntax</a>
              <ul>
                <li>
                  <a href="#callout">Callout</a>
                </li>
                <li>
                  <a href="#underlines">Underlines</a>
                </li>
                <li>
                  <a href="#highlight-lines">Highlight Lines</a>
                </li>
                <li>
                  <a href="#highlight-words(inline)">Highlight Words(inline)</a>
                </li>
                <li>
                  <a href="#diff-lines">Diff lines</a>
                </li>
                <li>
                  <a href="#dim-lines">Dim lines</a>
                </li>
                <li>
                  <a href="#focus-lines">Focus lines</a>
                </li>
                <li>
                  <a href="#fold-lines">Fold lines</a>
                </li>
                <li>
                  <a href="#cut-lines">Cut lines</a>
                </li>
                <li>
                  <a href="#position-shift">Position Shift</a>
                </li>
                <li>
                  <a href="#escape">Escape</a>
                </li>
                <li>
                  <a href="#custom-class-names-for-lines">
                    Custom class names for lines
                  </a>
                </li>
                <li>
                  <a href="#custom-data-attributes">Custom data attributes</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#dev-tools">6. Dev Tools</a>
            </li>
            <li>
              <a href="#showcases">7. Showcases</a>
            </li>
          </ul>
        </TOC>
        <Heading title="A very basic example" level="h2"></Heading>
        <CodeBlock
          code={`const Hello = "World!"
//     ^
// [Hello World!]`}
          lang="js"
        />
        <$.p $lineHeight="1.5" $margin="1rem 0">
          Above code is already self-explanatory, but with Shaku it is rendered
          into sth even better.
        </$.p>
        <CodeBlock
          code={`const Hello = "World!"
//     ^
// [Hello World!]`}
          lang="js"
          shakuEnabled
        />
        <$.p $lineHeight="1.5" $margin="1rem 0">
          Now code and annotation are visually separated, super cool to explain
          code, right?
        </$.p>
        <Heading title="Usage" level="h2"></Heading>
        <$.p $lineHeight="1.5">Choose the right tool for your use case.</$.p>
        <$.ol $listStyle="disc" $lineHeight="1.5">
          <$.li $margin="8px 0">
            <a href="https://github.com/JSerZANP/shaku/tree/main/packages/shaku-code-annotate-core">
              shaku-code-annotate-core
            </a>{" "}
            - Shaku parser that parses the syntax in the comments. Tokenizer not
            included.
          </$.li>
          <$.li $margin="8px 0">
            <a href="https://github.com/JSerZANP/shaku/tree/main/packages/shaku-code-annotate-shiki">
              shaku-code-annotate-shiki
            </a>{" "}
            - Shaku code annotation based on the tokenizer from{" "}
            <a href="https://github.com/shikijs/shiki">shiki</a>. You can use
            this package directly in node.js or browser.
          </$.li>
          <$.li $margin="8px 0">
            <a href="https://github.com/JSerZANP/shaku/tree/main/packages/shaku-code-annotate-sugar-high">
              shaku-code-annotate-sugar-high
            </a>{" "}
            - Enable Shaku on the lightweight syntax highlighter -{" "}
            <a href="https://github.com/huozhi/sugar-high">Sugar High</a>.
          </$.li>
          <$.li $margin="8px 0">
            <a href="https://github.com/JSerZANP/shaku/tree/main/packages/remark-shaku-code-annotate">
              remark-shaku-code-annotate
            </a>{" "}
            - plugin for <a href="https://github.com/remarkjs/remark">remark</a>{" "}
            to easily integrate Shaku in Markdown/MDX(Astro .etc)
          </$.li>
          <$.li $margin="8px 0">
            <a href="https://github.com/JSerZANP/shaku/tree/main/packages/marked-shaku-code-annotate">
              marked-shaku-code-annotate
            </a>{" "}
            - a plugin for another markdown engine:{" "}
            <a href="https://github.com/markedjs/marked">marked</a>
          </$.li>
        </$.ol>
        <$.p>Also some demos you can refer to:</$.p>
        <$.ol $listStyle="disc" $lineHeight="1.5">
          <$.li $margin="8px 0">
            <a href="https://stackblitz.com/edit/github-yunziv?file=src%2Fcontent%2Fblog%2Fshaku.mdx">
              Shaku + MDX + Astro
            </a>{" "}
          </$.li>
          <$.li $margin="8px 0">
            <a href="https://stackblitz.com/edit/github-hrpoqm-zfq1kt?file=pages%2Findex.mdx">
              Shaku + MDX + Next.js
            </a>{" "}
          </$.li>
        </$.ol>
        <$.p>
          Or you can just inspect the source code of this website -{" "}
          <a href="https://github.com/JSerZANP/shaku/blob/main/examples/web/components/CodeBlock.tsx">
            <code>CodeBlock.tsx</code>
          </a>
          ,{" "}
          <a href="https://github.com/JSerZANP/shaku/blob/main/examples/web/components/CodePreview/CodePreviewRemark.tsx">
            <code>CodePreviewRemark.tsx</code>
          </a>{" "}
          or{" "}
          <a href="https://github.com/JSerZANP/shaku/blob/main/examples/web/components/CodePreview/CodePreviewMarked.tsx">
            <code>CodePreviewMarked.tsx</code>
          </a>
        </$.p>
        <Heading title="Supported Languages" level="h2"></Heading>
        <$.p>
          Shaku on Shiki supports most languages that are supported by Shiki.
          You can find the +150 languages from{" "}
          <a href="/snippet">Shaku Snippet</a>.
        </$.p>
        <Heading title="Styling" level="h2"></Heading>
        <p>
          Shaku renders code into a <code>&lt;pre /&gt;</code> with class
          <code>.shaku</code>, and shaku elements have class names prefixed with{" "}
          <code>.shaku</code>, you can use the{" "}
          <a href="https://github.com/JSerZANP/shaku/blob/main/examples/web/css/shaku.css">
            {" "}
            CSS from this website
          </a>{" "}
          and adapt to your needs.
        </p>
        <p>
          The class names for each Shaku element will be explained in Syntax
          section.
        </p>
        <Heading
          title="Dark mode support"
          level="h3"
          justify="flex-start"
        ></Heading>
        <p>
          You can render multiple themes by setting <code>themes</code> in the
          Shaku plugins, the theme lang is put on the <code>&lt;pre&gt;</code>{" "}
          tag. Thus we can control the visibility by CSS
        </p>
        <CodeBlock
          code={`const marked = new Marked();

marked.use(
  markedShakuCodeAnnotate({
    // @highlight
    themes: ["github-light", "github-dark"],
    langs: ["javascript", "css", "jsx", "html", "typescript", "tsx"],
  })
);`}
          lang="js"
          shakuEnabled
        />
        <CodeBlock
          code={`pre.shaku.github-dark {
  display: none;
}

@media (prefers-color-scheme: dark) {
  pre.shaku.github-dark {
    display: block;
  }

  pre.shaku.github-light {
    display: none;
  }
}
`}
          lang="css"
          shakuEnabled
        />
        <Heading title="Syntax" level="h2"></Heading>
        <blockquote>
          You can also try out the syntax on{" "}
          <a href="/playground">Shaku Playground</a> or{" "}
          <a href="/snippet">Shaku Snippet</a>.
        </blockquote>
        <Heading title="Callout" level="h3" justify="flex-start"></Heading>
        <CodeBlock
          code={`const blog = "https://jser.dev"
//                    ^
//       [JSer.dev is the *homepage* for JSer.]
//       [Check it out! [jser.dev](https://jser.dev)]
// This is a normal comment`}
          lang="js"
          shakuEnabled
        />
        <$.p>
          Place <code>^</code> for the arrow, and <code>[]</code> for the text,
          you can also enable basic markdown support.
        </$.p>
        <CodeBlock
          $marginTop={"1rem"}
          code={`const blog = "https://jser.dev"
//                    ^
//       [JSer.dev is the *homepage* for JSer.]
//       [Check it out! [jser.dev](https://jser.dev)]
// This is a normal comment`}
          lang="js"
        />
        <$.p>
          <code>.shaku-callout</code> and <code>.shaku-callout-arrow</code> are
          used to style callout.
        </$.p>
        <CodeBlock
          $marginTop={"1rem"}
          code={`.shaku-callout {
  background-color: var(--color-shaku-callout-light, #0685ce);
  color: #fff;
  padding: 0.5em 1ch;
  position: relative;
  margin: 0.5em 0 0 -0.2ch;
  display: inline-block;
  border-radius: 2px;
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
}`}
          lang="css"
        />
        <Heading title="Underlines" level="h3" justify="flex-start"></Heading>
        <CodeBlock
          code={`// This is normal comments from source code.
const blog = "https://jser.dev"
//            ----------------
//       [JSer.dev is the **homepage** for JSer.]
//       [Check it out! [jser.dev](https://jser.dev)]

const blog = "jser.dev"
//            --------

const blog = "jser.dev"
//            ~~~~~~~~

const blog = "jser.dev"
//            ........`}
          lang="js"
          shakuEnabled
        />
        <$.p>
          Simply use <code>-----</code>, <code>....</code>, <code>~~~~~</code>{" "}
          for underlines.
        </$.p>
        <CodeBlock
          $marginTop={"1rem"}
          code={`// This is normal comments from source code.
const blog = "https://jser.dev"
//            ----------------
//       [JSer.dev is the **homepage** for JSer.]
//       [Check it out! [jser.dev](https://jser.dev)]

const blog = "jser.dev"
//            --------

const blog = "jser.dev"
//            ~~~~~~~~

const blog = "jser.dev"
//            ........`}
          lang="js"
        />
        <$.p>
          <code>.shaku-underline</code> is the base style,{" "}
          <code>.shaku-underline-wavy</code>,{" "}
          <code>.shaku-underline-solid</code>
          and <code>.shaku-underline-dotted</code> are for the variations.
        </$.p>
        <CodeBlock
          $marginTop={"1rem"}
          code={`.shaku-underline {
  padding: 0 1ch;
  position: relative;
  display: block;
  border-radius: 3px;
  color: var(--color-shaku-underline-light, red);
  margin: 0;
  width: min-content;
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

.shaku-underline-wavy > .shaku-underline-line {
  text-decoration-style: wavy;
  top: 0.7em;
}

.shaku-underline-solid > .shaku-underline-line {
  text-decoration-style: solid;
}

.shaku-underline-dotted > .shaku-underline-line {
  text-decoration-style: dotted;
}`}
          lang="css"
        />
        <Heading
          title="Highlight Lines"
          level="h3"
          justify="flex-start"
        ></Heading>
        <CodeBlock
          code={`// @highlight
function useSomeEffect({blog}) {
  useEffect(() => {
    //  do some stuff
// @highlight start
      return () => {
        location.href = 'https://jser.dev'
      }
// @highlight end
    }, [blog])
}`}
          lang="js"
          shakuEnabled
        />
        <$.p>
          Use <code>@highlight</code> to highlight next line, append{" "}
          <code>start</code> /<code>end</code>(or <code>v</code> /{" "}
          <code>^</code>) to mark multiple lines.
        </$.p>
        <CodeBlock
          code={`// @highlight
function useSomeEffect({blog}) {
  useEffect(() => {
    //  do some stuff
// @highlight start
      return () => {
        location.href = 'https://jser.dev'
      }
// @highlight end
    }, [blog])
}`}
          lang="js"
        />
        <$.p>
          <code>.shaku .line.highlight</code> could be used to set highlight
          style.
        </$.p>
        <CodeBlock
          $marginTop={"1rem"}
          code={`pre.shaku .line.highlight {
  background-color: var(
    --color-shaku-highlight-light,
    color-mix(in srgb, rgb(5, 118, 149) 15%, #fff)
  );
  display: block;
}`}
          lang="css"
        />
        <Heading
          title="Highlight Words(inline)"
          level="h3"
          justify="flex-start"
        ></Heading>
        <CodeBlock
          code={`//       (           )
function useSomeEffect({blog}) {
//( r      )
  useEffect(() => {
      return () => {
      //( g    )        (          b     ) 
        location.href = 'https://jser.dev'
      }
    }, [blog])
}`}
          lang="js"
          shakuEnabled
        />
        <$.p>
          <code>(</code> and <code>)</code> are used to mark the selection of
          next line. optional id inside could be used to map to different color.
        </$.p>
        <CodeBlock
          code={`//       (           )
function useSomeEffect({blog}) {
//( r      )
  useEffect(() => {
      return () => {
      //( g    )        (          b     ) 
        location.href = 'https://jser.dev'
      }
    }, [blog])
}`}
          lang="js"
        />
        <$.p>
          <code>.shaku-inline-highlight</code> is used to style the inline
          blocks, target specific blocks with the id you set -{" "}
          <code>[data-id=*]</code>.
        </$.p>
        <CodeBlock
          $marginTop={"1rem"}
          code={`.shaku-inline-highlight {
  background-color: #fa05f230;
  border-bottom: 2px solid rgb(235, 4, 158);
  margin: 0 1px;
  border-radius: 3px;
  padding: 0 3px;
}

.shaku-inline-highlight[data-id="r"] {
  background-color: #fa05f230;
  border-bottom: 2px solid rgb(235, 4, 158);
}

.shaku-inline-highlight[data-id="g"] {
  background-color: #05faa930;
  border-bottom: 2px solid green;
}

.shaku-inline-highlight[data-id="b"] {
  background-color: #05a4fa30;
  border-bottom: 2px solid rgb(9, 113, 239);
}

`}
          lang="css"
        />
        <Heading title="Diff lines" level="h3" justify="flex-start"></Heading>
        <CodeBlock
          code={`function useSomeEffect({blog}) {
  useEffect(() => {
      // @diff + start
      return () => {
        location.href = 'https://jser.dev'
      }
      // @diff + end

      // @diff - 
      console.log('remove this')
    }, [blog])
}`}
          lang="js"
          shakuEnabled
        />
        <$.p>
          Use <code>@diff +</code> and <code>@diff -</code> to mark next line as
          diff, append <code>start</code> /<code>end</code>(or <code>v</code> /{" "}
          <code>^</code>) to diff multiple lines.
        </$.p>
        <CodeBlock
          code={`function useSomeEffect({blog}) {
  useEffect(() => {
      // @diff + start
      return () => {
        location.href = 'https://jser.dev'
      }
      // @diff + end

      // @diff - 
      console.log('remove this')
    }, [blog])
}`}
          lang="js"
        />
        <$.p>
          <code>.diff</code>, <code>.diff-insert</code> and{" "}
          <code>.diff-delete</code> are used to style the diff lines.
        </$.p>
        <CodeBlock
          $marginTop={"1rem"}
          code={`pre.shaku .line.diff::before {
  position: absolute;
  margin-left: -1ch;
}

pre.shaku .line.diff-insert {
  background-color: rgba(46, 160, 67, 0.2);
}

pre.shaku .line.diff-insert::before {
  content: "+";
}

pre.shaku .line.diff-delete {
  background-color: rgba(248, 81, 73, 0.2);
}
pre.shaku .line.diff-delete::before {
  content: "-";
}`}
          lang="css"
        />
        <Heading title="Dim lines" level="h3" justify="flex-start"></Heading>
        <CodeBlock
          code={`function useSomeEffect({blog}) {
  // @dim
  useEffect(() => {
    //  do some stuff
    return () => {
      // @dim start
      location.href = 'https://jser.dev'
      // @dim end
    }

  }, [blog])
}`}
          lang="js"
          shakuEnabled
        />
        <$.p>
          Similar to highlighting, use <code>@dim</code> to dim next line,
          append <code>start</code> /<code>end</code>(or <code>v</code> /{" "}
          <code>^</code>) to dim multiple lines.
        </$.p>
        <CodeBlock
          code={`function useSomeEffect({blog}) {
  // @dim
  useEffect(() => {
    //  do some stuff
    // @dim start
    return () => {
      location.href = 'https://jser.dev'
    }
    // @dim end

  }, [blog])
}`}
          lang="js"
        />
        <$.p>
          Use <code>.dim</code> to style dimmed lines.
        </$.p>
        <CodeBlock
          $marginTop={"1rem"}
          code={`.shaku .line.dim {
  filter: blur(2px) brightness(0.5);
}`}
          lang="css"
        />
        <Heading title="Focus lines" level="h3" justify="flex-start"></Heading>
        <CodeBlock
          code={`function useSomeEffect({blog}) {
  // @focus
  useEffect(() => {
    // do some stuff
    return () => {
      // @focus start
      location.href = 'https://jser.dev'
      // @focus end
    }
  }, [blog])
}`}
          lang="js"
          shakuEnabled
        />
        <$.p>
          Focus means to highlight some by dimming the other lines. Use{" "}
          <code>@focus</code> to focus next line, append <code>start</code> /
          <code>end</code>(or <code>v</code> / <code>^</code>) to focus multiple
          lines.{" "}
        </$.p>
        <CodeBlock
          code={`function useSomeEffect({blog}) {
  // @focus
  useEffect(() => {
    // do some stuff
    return () => {
      // @focus start
      location.href = 'https://jser.dev'
      // @focus end
    }
  }, [blog])
}`}
          lang="js"
        />
        <$.p>
          Since it is actually <code>@dim</code>, there is no special class for
          it.
        </$.p>
        <Heading title="Fold lines" level="h3" justify="flex-start"></Heading>
        <CodeBlock
          code={`function useSomeEffect({blog}) {
  useEffect(() => {
    // @fold start
    // do some stuff
    return () => {
      location.href = 'https://jser.dev'
    }
    // @fold end
  }, [blog])
}`}
          lang="js"
          shakuEnabled
        />
        <$.p>
          <code>@fold</code> is to collapse lines, append <code>start</code> /{" "}
          <code>end</code> (or <code>v</code> / <code>^</code>) to mark the
          lines.
        </$.p>
        <CodeBlock
          code={`function useSomeEffect({blog}) {
  useEffect(() => {
    // @fold start
    // do some stuff
    return () => {
      location.href = 'https://jser.dev'
    }
    // @fold end
  }, [blog])
}`}
          lang="js"
        />
        <$.p>
          <code>@fold</code> renders{" "}
          <code>
            &lt;details&gt;&lt;summary&gt;&lt;mark&gt;&lt;/mark&gt;&lt;/summary&gt;&lt;/details&gt;
          </code>
          , class <code>.shaku-expand</code>
          could be used to style.
        </$.p>
        <CodeBlock
          $marginTop={"1rem"}
          code={`.shaku-expand summary mark {
  color: var(--color-text-sub);
  cursor: pointer;
  border-radius: 3px;
}

.shaku-expand summary::-webkit-details-marker,
.shaku-expand summary::marker {
  display: none;
  content: "";
}

.shaku-expand[open] summary {
  display: none;
}`}
          lang="css"
        />
        <Heading title="Cut lines" level="h3" justify="flex-start"></Heading>
        <$.p>
          In case you want to remove some lines from the rendered output but
          keep them in the source code, you can use <code>@cut</code> to cut one
          line, or append <code>start</code> / <code>end</code> (or{" "}
          <code>v</code> / <code>^</code>) to cut multiple lines.
        </$.p>
        <CodeBlock
          code={`// @cut v 
import Button from './Button'
import { useEffect } from 'react'
// @cut ^ 
function component() {
  return <Button
          class="button"
          disabled
        />
}`}
          lang="js"
        />
        Above annotation will be rendered as below.
        <CodeBlock
          code={`// @cut v 
import Button from './Button'
import { useEffect } from 'react'
// @cut ^ 
function component() {
  return <Button
          class="button"
          disabled
        />
}`}
          lang="js"
          shakuEnabled
        />
        <Heading
          title="Position Shift"
          level="h3"
          justify="flex-start"
        ></Heading>
        <CodeBlock
          code={`function component() {
//^<<
//[This is very beginning ] <<
    return <Button
            class="button"
            //--------------<<
            //[Hello World!]<<<
            disabled
          />
}`}
          lang="js"
          shakuEnabled
        />
        <$.p>
          Sometimes it is hard to position it right(with formatter .etc), you
          can use position shift <code>&lt;</code> to move shaku elements toward
          left
        </$.p>
        <CodeBlock
          code={`function component() {
//^<<
//[This is very beginning ] <<
    return <Button
            class="button"
            //--------------<<
            //[Hello World!]<<<
            disabled
          />
}`}
          lang="js"
        />
        <Heading title="Escape" level="h3" justify="flex-start"></Heading>
        <p>
          For cases where rendering raw comments are desirable, we can put{" "}
          <code>!</code>
          at the end of shaku lines to escape.{" "}
        </p>
        <CodeBlock
          code={`const Hello = "World!"
//     ^!
// [Hello World!]!
//     ^
// [Above two lines are not rendered into UI elements!]
// [Since they have \`!\` at the end and \`!\` is removed when rendered]`}
          lang="js"
          shakuEnabled
        />
        <Heading
          title="Custom class names for lines"
          level="h3"
          justify="flex-start"
        ></Heading>
        <p>
          Sometimes you might want to add custom class names for a line, this
          could be easily done by <code>@class</code> directive.
        </p>
        <CodeBlock
          code={`// @class custom-class1 custom-class2 !
// @class custom-class1 custom-class2
// @highlight
const Hello = "World!"
//     ^
// [Open the dev console and inspect this line,]
// [you'll see this line is rendered with the custom class names!]`}
          lang="js"
          shakuEnabled
        />
        <Heading
          title="Custom data attributes"
          level="h3"
          justify="flex-start"
        ></Heading>
        <p>
          You can also use <code>@data</code> to add custom data attributes to a
          line, which could be useful if you are building something on top of
          Shaku.
        </p>
        <CodeBlock
          code={`// @data hello=world jser="dev" !
// @data hello=world jser="dev"
// @highlight
const Hello = "World!"
//     ^
// [Open the dev console and inspect this line,]
// [you'll see this line is rendered with the custom data attributes!]`}
          lang="js"
          shakuEnabled
        />
        <Heading title="Dev Tools" level="h2"></Heading>
        <p>
          We got some tools to understand how Shaku works, such as{" "}
          <a href="/shiki-token-inspector">Shiki Token Inspector</a> and{" "}
          <a href="/sugar-high-token-inspector">Sugar High Token Inspector</a>
        </p>
        <Heading title="Showcases" level="h2"></Heading>
        <p>Check out some examples built with Shaku.</p>
        <ul>
          <li>
            <a
              href="https://jser.dev/2024-03-20-how-does-useoptimisticwork-internally-in-react/"
              target="_blank"
            >
              jser.dev blog
            </a>{" "}
            is using Shaku heavily to annotate code snippets.
          </li>
          <li>
            <a href="https://jser.pro/ddir/quiz" target="_blank">
              jser.pro
            </a>{" "}
            has interactive React quizzes on top of Shaku.
          </li>
        </ul>
        <$.hr $margin="2rem auto" $width={"50%"} />
        <$.p $textAlign="center">
          Got a bug or have better ideas? Raise an issue on{" "}
          <a href="https://github.com/JSerZANP/shaku">shaku repo</a>.
        </$.p>
      </$.div>
    </div>
  );
}
