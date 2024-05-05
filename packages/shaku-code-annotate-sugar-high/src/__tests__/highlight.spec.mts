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
  `
  // @highlight
  // @class abc e123
  function hello() {
    return <div>
    Hello world!
  </div>
  }
    `,
  `
    // @fold start
    function hello() {
    // @fold end
    // @fold v
      const blog = "https://jser.dev"
      return blog
      // @fold ^
    
    }
      `,
  `
    function hello() {
      // @data a-1=a-1 b-2=hello
      const blog = "https://jser.dev"
      return blog
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

test("highlight()", async () => {
  snippets.forEach((code) => {
    const html = highlight(code);
    expect(html).toMatchSnapshot();
  });
});
