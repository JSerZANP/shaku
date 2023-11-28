import { expect, test } from "vitest";
import { getShakuHighlighters } from "../getHighlighters";

const snippets = [
  `
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

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
      parseBasicMarkdown: (code) => code,
      options: {},
    });

    expect(html).toMatchSnapshot();
  });
});
