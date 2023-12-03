export const defaultCode = `
// @highlight
import { useState } from 'react';

//     (     ) (2     ) (   3 )
export default function Counter() {
  // @highlight
  const [count, setCount] = useState(0);
              //~~~~~~~~
  
  function handleClick() {
    setCount(count + 1);
  //-------------------
  //     ^
  //[Underline and callout!]
  }

  return (
    <button onClick={handleClick}>
    {/*       ^           */}
    {/* [Supports JSX] */}
    {/* [Awesome,right?] */}
      You pressed me {count} times
    </button>
  );
}`;
