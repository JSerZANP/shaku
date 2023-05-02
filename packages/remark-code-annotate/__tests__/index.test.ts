import { assert, test } from 'vitest'
import codeTitle from "remark-code-title";
import html from "remark-html";
import { remark } from "remark";
import {remarkCodeAnnotate} from '../index'

test('should work', async () => {
  // Test skipped, no error
  assert.equal(Math.sqrt(4), 2)

  const processor = remark().use(remarkCodeAnnotate).use(html, { sanitize: false });
  const markdown = `\`\`\`js annotate
  // abc = 3
  const a = 1;
  //    ^ this is bad
  const a = 3;
  const b = 5;
  \`\`\`
  `
  const result = await processor.process(markdown);
  console.log(result);
  
})