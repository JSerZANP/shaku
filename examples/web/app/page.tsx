import { $ } from "migacss";
import Head from "next/head";
import { CodeBlock } from "../components/CodeBlock";
import styles from "../components/CodePreview/CodePreview.module.css";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const codeFromParams = searchParams?.code;
  return (
    <div className={styles.preview}>
      <Head>
        <title>Shaku</title>
      </Head>
      <$.div $maxWidth={690} $margin="0 auto" $padding={"3rem 2rem"}>
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
        <$.p $lineHeight="1.5" $marginTop={"2rem"}>
          Also some demos you can refer to:
        </$.p>
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

        <$.p $lineHeight="1.5" $marginTop={"2rem"}>
          Or you can just inspect the source code of this website TODO
        </$.p>

        <$.h2 $textAlign="center">Styling</$.h2>
        <p>
          Shaku renders code into HTML with class names prefixed with{" "}
          <code>shaku</code>.
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
          you can also use your own markdown parser to support basic markdown
          syntax.
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

        <$.h3>Highlight words</$.h3>

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
          Focus means to highlight some lines and dim the others. Use{" "}
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
          <a href="https://github.com/JSerZANP/shaku">shaku@github</a>.
        </p>
      </$.div>
    </div>
  );
}
