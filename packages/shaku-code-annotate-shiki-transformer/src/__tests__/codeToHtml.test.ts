import { expect, test } from "vitest";
import { fetchProcessor } from "./util";

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
  `
function useSomeEffect({blog}) {
  useEffect(() => {
    //  do some stuff
      // @fold start
      return () => {
        // @highlight
        location.href = 'https://jser.dev'
      }
      // @fold ^
    }, [blog])
}
  `,

  `
// @class abc h123
// @highlight
function useSomeEffect({blog}) {
  useEffect(() => {
      return () => {
        location.href = 'https://jser.dev'
      }
    }, [blog])
}
  `,
  `
function useSomeEffect({blog}) {
  useEffect(() => {
    // @data a=1
      return () => {
        // @data a-b-c=1-2-3 beg-1=hello-2
        location.href = 'https://jser.dev'
      }
    }, [blog])
}
  `,
  `
  function useSomeEffect({blog}) {
    // @cut v
    useEffect(() => {
        return () => {
          // @cut ^
          location.href = 'https://jser.dev'
          // @cut start
        }
      }, [blog])
      // @cut end
    // @cut
    // a comment to cut
  }
    `,
];

test("codeToHtml()", async () => {
  const processor = await fetchProcessor(
    "javascript",
    false /* useDangerousRawHtml */
  );

  for (const snippet of snippets) {
    const html = await processor
      .process(`\`\`\`js annotate\n${snippet}\n\`\`\``)
      .then((result) => result.toString());

    expect(html).toMatchSnapshot();
  }
});

test("codeToHtml() + raw HTML", async () => {
  const processor = await fetchProcessor(
    "javascript",
    true /* useDangerousRawHtml */
  );

  for (const snippet of snippets) {
    const html = await processor
      .process(`\`\`\`js annotate\n${snippet}\n\`\`\``)
      .then((result) => result.toString());

    expect(html).toMatchSnapshot();
  }
});

test("codeToHtml() + raw HTML + explicit trigger", async () => {
  const processor = await fetchProcessor(
    "javascript",
    true /* useDangerousRawHtml */,
    /shaku/
  );

  for (const snippet of snippets) {
    const html = await processor
      .process(`\`\`\`js \n${snippet}\n\`\`\``)
      .then((result) => result.toString());

    expect(html).toMatchSnapshot();
  }
});

test("unknown lang should fallback to text", async () => {
  const processor = await fetchProcessor(
    "javascript",
    true /* useDangerousRawHtml */
  );

  for (const snippet of snippets) {
    const html = await processor
      .process(`\`\`\`unknown \n${snippet}\n\`\`\``)
      .then((result) => result.toString());

    expect(html).toMatchSnapshot();
  }
});
