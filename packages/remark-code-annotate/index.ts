import { visit } from "unist-util-visit";
import type * as mdast from "mdast";
import type * as unified from "unified";
import * as shiki from 'shiki'

export const remarkCodeAnnotate: unified.Plugin<[], mdast.Root> = () => {
  return async (tree, file) => {
    // create a shiki highlighter
    const highlighter = await shiki.getHighlighter({
      theme: 'github-light',
      langs: ['javascript'],
    });

    visit(tree, "code", (node, index, parent) => {
      console.log('found code', node)
      const lang = node.lang
      const meta = node.meta ?? ''
      // simply check if meta has the word "annotate"
      const isAnnotate = /\bannotate\b/.test(meta)
      console.log('isAnnotate', isAnnotate)
      // TODO load line

      // TODO: load the lang
      const lines = highlighter.codeToThemedTokens(node.value, 'javascript')

      // generate the html from the tokens
      let html = ""

      // const hasHighlight = meta.highlight && shouldBeHighlightable(meta.highlight)
      // const hl = shouldHighlightLine(meta.highlight)

      // html += preOpenerFromRenderingOptsWithExtras(options, meta, [])

      html += '<pre class="shiki">'

      // if (meta.title) {
      //   html += `<div class='code-title'>${meta.title}</div>`
      // }

      // if (options.langId) {
      //   html += `<div class="language-id">${options.langId}</div>`
      // }

      // html += `<div class='code-container'><code>`
      html += '<code>'

      lines.forEach((l, i) => {
        if (l.length === 0) {
          html += `<div class='line'></div>`
        } else if (isAnnotateLine(l)){
          const prefix = `<div class="annotate">`
          html += prefix
          
          html += processAnnotationLine(l)
          html += `</div>`

        } else {
          // const hiClass = hasHighlight ? (hl(i) ? " highlight" : " dim") : ""
          // const prefix = `<div class='line${hiClass}'>`
          const prefix = `<div class="line">`
          html += prefix
          
          l.forEach(token => {
            html += `<span style="color: ${token.color}">${escapeHtml(token.content)}</span>`
          })
          html += `</div>`
        }
      })

      // html = html.replace(/\n*$/, "") // Get rid of final new lines
      html += `</code></div></pre>`
      console.log('html', html)
      
      // done processing, generate html
      node.value = html
      node.type = 'html'

      
      // we'll go through the HTML string lines
      // process each line 

      // syntax proposal

      // //^ This line is hahahah  => callout 
      // //        ^ This is bizzar => leading space is respected
      // //^hide
      // //^highlight
      // // 

      // node.type = 'html'
      // node.value = highlighted

      // const [title] = metaString.match(/(?<=title=("|'))(.*?)(?=("|'))/) ?? [""];
      // if (!title && metaString.includes("title=")) {
      //   file.message("Invalid title", node, "remark-code-title");
      //   return;
      // }
      // if (!title) return;

      // const titleNode: mdast.Paragraph = {
      //   type: "paragraph",
      //   data: {
      //     hName: "div",
      //     hProperties: {
      //       "data-remark-code-title": true,
      //       "data-language": node.lang,
      //     },
      //   },
      //   children: [{ type: "text", value: title }],
      // };

      // parent.children.splice(index, 0, titleNode);
      // /* Skips this node (title) and the next node (code) */
      // return index + 2;
    });
  }
}

function escapeHtml(html: string) {
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function isAnnotateLine(line: shiki.IThemedToken[]) {
  for (const token of line) {
    if (!/^\s+$/.test(token.content) && !/^\/\/\s+\^/.test(token.content)) {
      return false   
    }
  }
  return true
}

function processAnnotationLine(line:  shiki.IThemedToken[]) {
  let html = ''

  for (const token of line) {
    if (/^\s+$/.test(token.content)) {
      html += token.content
      continue;
    }
    
    if (/^\/\/\s+\^/.test(token.content)) {
      html += renderDirectiveToken(token)
    }
  }
  return html
}



/**
 * Now we support following syntax
 * //       ^ This is rendered as callout
 * @param token 
 * @returns 
 */
function renderDirectiveToken(token: shiki.IThemedToken) {  
  // //    ^ This is annotation from tech writer.
  let matches = /\/\/(?<space>\s+)\^ (?<comment>.+)$/.exec(token.content)
  if (matches) {
    const {groups: {space, comment}} = matches
    return space + ' ' + '<span class="callout"><span class="callout-arrow"></span>' + comment + '</span>';
  }
  // //                         ^---------------------- This is important 
  matches = /\/\/(?<space>\s+)\^(?<dashes>-+)\s+(?<comment>.+)$/.exec(token.content)
  if (matches) {
    const {groups: {space, dashes, comment}} = matches
    return space + '  ' + '<span class="callout callout-of-dashes"><span class="callout-dashes">' + dashes + ' </span>' + comment + '</span>';
  }

  matches = /\/\/(?<space>\s+)\^(?<dashes>~+)\s+(?<comment>.+)$/.exec(token.content)
  if (matches) {
    const {groups: {space, dashes, comment}} = matches
    return space + '  ' + '<span class="callout callout-of-waves"><span class="callout-waves">' + dashes + ' </span>' + comment + '</span>';
  }
  return '<span class="callout"><span class="callout-arrow"></span>' + token.content + '</span>';
}