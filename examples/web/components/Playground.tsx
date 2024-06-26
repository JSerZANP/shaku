"use client";

import { Editor } from "@monaco-editor/react";
import { $ } from "migacss";
import dynamic from "next/dynamic";
import { useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import { RiShareBoxLine } from "react-icons/ri";
import { Button, Column, Row, Text, View } from "./bare";

const CodePreviewRemark = dynamic(
  () => import("./CodePreview/CodePreviewRemark"),
  {
    ssr: false,
  }
);
const CodePreviewMarked = dynamic(
  () => import("./CodePreview/CodePreviewMarked"),
  {
    ssr: false,
  }
);

const defaultMarkdown = `

**shaku-code-annotate** allows you to annotate the code snippets,
in a different context.

## Here is a callout

\`\`\`js annotate
const blog = "https://jser.dev"
//                    ^
//       [JSer.dev is the *homepage* for JSer.]
//       [Check it out! [jser.dev](https://jser.dev)]
// This is a normal comment
\`\`\`

See how the callout is rendered separately from normal comments

## Various kinds of underlines

\`\`\`js annotate
// This is normal comments from source code.
const blog = "https://jser.dev"
//                    ~~~~~~~~
//       [JSer.dev is the **homepage** for JSer.]
//       [Check it out! [jser.dev](https://jser.dev)]

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
\`\`\`

## Easily Highlight Lines

You don't need to add code meta, just add the command where you want to highlight.

\`\`\`js annotate
// @highlight
function useSomeEffect({blog}) {

  useEffect(() => {
    //  do some stuff

// @highlight start
      return () => {
        location.href = 'https://jser.dev'
      }
// @highlight end

    }, [blog])
}
\`\`\`

## Highlight Words where they are

\`\`\`js annotate
//       (           )
function useSomeEffect({blog}) {
//( 2      )
  useEffect(() => {
      return () => {
      //( 3    )        (          3    ) 
        location.href = 'https://jser.dev'
      }
    }, [blog])
}
\`\`\`


## Easily Dim lines

Use this command to de-emphasize some lines.

\`\`\`js annotate
function useSomeEffect({blog}) {
  // @dim
  useEffect(() => {
    //  do some stuff

      return () => {
        // @dim start
        location.href = 'https://jser.dev'
        // @dim end

      }

    }, [blog])
}
\`\`\`

## Fold lines


\`\`\`js annotate
function useSomeEffect({blog}) {
  useEffect(() => {
    //  do some stuff
      // @fold start
      return () => {
        location.href = 'https://jser.dev'
      }
      // @fold end
    }, [blog])
}
\`\`\`


## Easily Focus lines

Emphasize some lines while de-emphasize the others.

\`\`\`js annotate
function useSomeEffect({blog}) {
  // @focus
  useEffect(() => {
    //  do some stuff

      return () => {
        // @focus start
        location.href = 'https://jser.dev'
        // @focus end

      }

    }, [blog])
}
\`\`\`

## Support 150+ languages, also in JSX/TSX

Try out all language demos in [Shaku Snippet](/snippet).

\`\`\`tsx annotate
function component() {
  //       ^
  //     [This is line 1]
    return <p>jser.dev
    { /*      --------       */}
       {/*   [This is line 2]       */}
       {/*   @highlight       */}
       <button>click me</button>
       {123}
    </p>
  }
\`\`\`

## Cut lines

In case you want to remove some lines from the rendered output but keep them in the source code, you can use \`@cut\` to cut one line, or append \`start\` / \`end\` (or \`v\` / \`^\`) to cut multiple lines

\`\`\`tsx annotate
// @cut v 
import Button from './Button'
import { useEffect } from 'react'
// @cut ^ 
function component() {
  return <Button
          class="button"
          disabled
        />
}
\`\`\`

## Shift position with \`<\`

Sometimes it could be annoying when you want to target the start of the line. You can use \`<\` to shift left the annotation with one unit,
repeat it(\`<<\`, \`<<<\` .etc) to shift more.

\`\`\`tsx annotate
function component() {
//^<<
//[This is very beginning ] <<
   return <Button
            class="button"
            //--------------<<
            //[Hello World!]<<<
            disabled
          />
}
\`\`\`

## Escape with \`!\`

For cases where rendering raw comments are desirable, we can
put \`!\` at the end of shaku lines to escape.

\`\`\`tsx annotate
const Hello = "World!"
//     ^!
// [Hello World!]!
//     ^
// [Above two lines are not rendered into UI elements!]
// [Because they have \`!\` at the end, ]
// [and \`!\` is removed when rendered.]
\`\`\`

## Custom class names

Sometimes you might want to add custom class names for a line, this
could be easily done by \`@class\` directive.

\`\`\`tsx annotate
// @class custom-class1 custom-class2 !
// @class custom-class1 custom-class2
// @highlight
const Hello = "World!"
//     ^
// [Open the dev console and inspect this line,]
// [you'll see this line is rendered with the custom class names!]
\`\`\`

## Custom data attributes

You can also use \`@data\` to add custom data attributes to a
  line, which could be useful if you are building something on top of
  Shaku.

\`\`\`tsx annotate
// @data hello=world jser="dev" !
// @data hello=world jser="dev"
// @highlight
const Hello = "World!"
//     ^
// [Open the dev console and inspect this line,]
// [you'll see this line is rendered with the custom data attributes!]
\`\`\`


## How to Use

Visit [shaku on github](https://github.com/JSerZANP/shaku/tree/main) to find the right plugin.
`;

export function Playground({ code: _code }: { code?: string }) {
  const [code, setCode] = useState(_code ?? defaultMarkdown);
  const [mdEngine, setMdEngine] = useState<"remark" | "marked">("remark");

  const share = () => {
    const query = "code=" + encodeURIComponent(code);
    const url = location.origin + "/playground?" + query;
    const type = "text/plain";
    const blob = new Blob([url], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    navigator.clipboard.write(data).then(
      () => alert("link copied"),
      () => alert("failed to copy link.")
    );
  };
  return (
    <Column $height={"100vh"} $padding={12} $gap={12}>
      <View>
        <Row $alignItems="center" $justifyContent="space-between" $gap={20}>
          <Text type="headline1">
            Shaku Playground
            <$.a
              href="https://github.com/JSerZANP/shaku"
              target="_blank"
              $fontSize={20}
              $marginLeft={12}
            >
              <AiFillGithub />
            </$.a>
          </Text>
          <$.a href="/" $textDecoration="none">
            <Text type="headline5" $color="#dc0bf0">
              <BsStars />
              Shaku →
            </Text>
          </$.a>
        </Row>
        <Text type="body">
          <a href="/" target="_blank">
            Shaku
          </a>{" "}
          allows you to annotate your code easily. Created by{" "}
          <a href="https://twitter.com/JSer_ZANP">JSer</a>.
        </Text>
      </View>
      <Row>
        <Button
          onClick={share}
          label="Share page with below code"
          icon={<RiShareBoxLine />}
        ></Button>
        <span>
          <label>Markdown Engine: </label>
          <select
            value={mdEngine}
            onChange={(e) => setMdEngine(e.currentTarget.value as any)}
          >
            <option value="remark">remark</option>
            <option value="marked">marked</option>
          </select>
        </span>
      </Row>
      <Row $gap={20} $flex="1 0 0 " $overflow="auto" $alignItems="stretch">
        <Column $flex="1 0 0" $maxWidth={700}>
          <Editor
            defaultLanguage="markdown"
            height="100%"
            value={code}
            theme="vs-dark"
            onChange={setCode}
          />
        </Column>
        {mdEngine === "marked" ? (
          <CodePreviewMarked code={code} />
        ) : (
          <CodePreviewRemark code={code} />
        )}
      </Row>
    </Column>
  );
}
