import { $ } from "migacss";
import Head from "next/head";
import { CodeBlock } from "../components/CodeBlock";
import styles from "../components/CodePreview/CodePreview.module.css";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className={styles.preview}>
      <Head>
        <title>Shaku</title>
      </Head>
      <$.div $maxWidth={690} $margin="0 auto" $padding={"0 2rem 2rem"}>
        <$.nav
          $display="flex"
          $justifyContent="center"
          $padding="1rem"
          $gap="1rem"
          $fontSize={"14px"}
          $borderBottom={"1px solid var(--color-line-3rd)"}
        >
          <a href="/playground">Shaku Playground</a>
          <a href="/snippet">Shaku Snippet</a>
        </$.nav>
        <$.h1 $textAlign="center">Shaku - code annotation made easy</$.h1>

        <p>
          <a href="https://github.com/JSerZANP/shaku">Shaku</a> makes it super
          easy to annotate code with special directives in comments.
        </p>

        <$.h2 $textAlign="center">A very basic example</$.h2>
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

        <$.h2 $textAlign="center">Usage</$.h2>
        <$.p $lineHeight="1.5">Choose the right tool for your use case.</$.p>
        <$.ol $listStyle="disc" $lineHeight="1.5">
          <$.li $margin="8px 0">
            <a href="https://github.com/JSerZANP/shaku/tree/main/packages/shaku-code-annotate">
              shaku-code-annotate
            </a>{" "}
            - the core of Shaku that you can use directly in node.js or browser.
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

        <$.p>Or you can just inspect the source code of this website TODO</$.p>
        <$.h2 $textAlign="center">Supported Languages</$.h2>
        <$.p>
          Shaku supports most languages that are supported by Shiki. You can
          find the +150 languages from <a href="/snippet">Shaku Snippet</a>.
        </$.p>
        <$.h2 $textAlign="center">Styling</$.h2>
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

        <$.h2 $textAlign="center">Syntax</$.h2>
        <blockquote>
          You can also try out the syntax on{" "}
          <a href="/playground">Shaku Playground</a> or{" "}
          <a href="/snippet">Shaku Snippet</a>.
        </blockquote>
        <$.h3>Callout</$.h3>

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
        <$.h3>Underlines</$.h3>

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

        <$.h3>Highlight Lines</$.h3>

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
          Use <code>@highlight</code> to highlight next line,{" "}
          <code>@highlight start</code> and
          <code>@highlight end</code> for multiple lines.
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

        <$.h3>Highlight words(inline)</$.h3>

        <CodeBlock
          code={`//       (           )
function useSomeEffect({blog}) {
//( 2      )
  useEffect(() => {
      return () => {
      //( 3    )        (          3     ) 
        location.href = 'https://jser.dev'
      }
    }, [blog])
}`}
          lang="js"
          shakuEnabled
        />
        <$.p>
          <code>(</code> and <code>)</code> are used to mark the selection of
          next line. optional id inside could be used to set different color.
        </$.p>
        <CodeBlock
          code={`//       (           )
function useSomeEffect({blog}) {
//( 2      )
  useEffect(() => {
      return () => {
      //( 3    )        (          3     ) 
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
`}
          lang="css"
        />

        <$.h3>Dim lines</$.h3>

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
          Similar to highlighting, use <code>@dim</code> to dim next line,{" "}
          <code>@dim start</code> and
          <code>@dim end</code> for multiple lines.
        </$.p>
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
        />
        <$.p>
          Use <code>.dim</code> to style dimmed lines.
        </$.p>
        <CodeBlock
          $marginTop={"1rem"}
          code={`.shaku .line.dim {
  opacity: 0.3;
}`}
          lang="css"
        />

        <$.h3>Focus lines</$.h3>

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
          Focus means to highlight some lines and dim the others, it is a
          shorthand of <code>@highlight</code> and <code>@dim</code>. Use{" "}
          <code>@focus</code> to focus next line, <code>@focus start</code> and
          <code>@focus end</code> for multiple lines.
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
          Since it is a shorthand syntax, there is no special class for it.
        </$.p>
        <$.h3>Position Shift</$.h3>

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
          Sometimes it is hard to position it right, you can use position shift{" "}
          <code>&lt;</code> to move shaku elements toward left
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
        <$.hr $margin="2rem auto" $width={"50%"} />
        <p>
          Got an issue or have better ideas? Raise an issue on{" "}
          <a href="https://github.com/JSerZANP/shaku">shaku repo</a>.
        </p>
      </$.div>
    </div>
  );
}
