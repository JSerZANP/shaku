import { expect, test } from "vitest";
import { getShakuHighlighters } from "../getHighlighters";

const snippets = [
  `
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  //       ^
  // [<a href="https:jser.dev">jser.dev</a>]

  useEffect(() => {
     // (                                                     )
        const connection = createConnection(serverUrl, roomId);
     // (1                )
        connection.connect();
    
  	return () => {
           //(2                    )
             connection.disconnect();
  	};
   //(3                 )
  }, [serverUrl, roomId]);
}
`,
  `
function hello() {
  //        ^!
  //    [Hello world!]!
  //        ^
  //    [Shaku <b>Shaku</b>]
  const blog = "https://jser.dev"
}
  `,
];

test("codeToHtml()", async () => {
  const highlighters = await getShakuHighlighters({
    // @ts-ignore
    langs: ["js"],
  });

  snippets.forEach((code) => {
    const html = highlighters[0].codeToShakuHtml({
      code,
      meta: "annotate",
      options: {
        lang: "js",
      },
    });

    expect(html).toMatchSnapshot();
  });
});

test("codeToHtml() + raw HTML", async () => {
  const highlighters = await getShakuHighlighters({
    // @ts-ignore
    langs: ["js"],
  });

  snippets.forEach((code) => {
    const html = highlighters[0].codeToShakuHtml({
      code,
      meta: "annotate",
      options: {
        lang: "js",
        useDangerousRawHTML: true,
      },
    });

    expect(html).toMatchSnapshot();
  });
});
