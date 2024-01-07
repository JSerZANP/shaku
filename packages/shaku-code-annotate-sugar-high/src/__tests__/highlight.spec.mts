import { expect, test } from "vitest";
import { highlight } from "../index.mjs";

const snippets = [
  `
// @highlight
function ChatRoom({ roomId }) {
         --------
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  //      ^
  // [Hello]
  
  // @diff + start
  // Welcome
  // To
  // JSer!
  // @diff - start

  // @diff -
  console.log('hello')

  // @dim
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
  //    [Shaku Shaku]
  const blog = "https://jser.dev"
}
  `,
  `
  function hello() {
    return <div
    //       ^
    // [Hello!]
    >
    Hello world!
  {/*    ^     */}
  {/* [Hello!] */}
  </div>
  }
    `,
];

test("highlight()", async () => {
  snippets.forEach((code) => {
    const html = highlight(code);
    expect(html).toMatchSnapshot();
  });
});
