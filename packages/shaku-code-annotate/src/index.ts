import { visit } from "unist-util-visit";
import type * as mdast from "mdast";
import type * as unified from "unified";
import * as shiki from "shiki";

type ShakuDirectiveUnderline = {
  type: "DirectiveUnderline";
  config: {
    style: "solid" | "dotted" | "wavy";
    content: string;
    offset: number;
  };
};
const RegShakuDirectiveUnderlineSolid =
  /^(?<leadingSpaces>\s*)(?<content>-+)\s*$/;
const RegShakuDirectiveUnderlineWavy =
  /^(?<leadingSpaces>\s*)(?<content>~+)\s*$/;
const RegShakuDirectiveUnderlineDotted =
  /^(?<leadingSpaces>\s*)(?<content>\.+)\s*$/;

type ShakuAnnotationLine = {
  type: "AnnotationLine";
  config: {
    offset: number;
    content: string;
  };
};

const RegShakuAnnotationLine = /^(?<leadingSpaces>\s*)\[(?<content>.+)\]\s*$/;

type ShakuDirectiveCallout = {
  type: "DirectiveCallout";
  config: {
    offset: number;
  };
};

const RegShakuDirectiveCallout = /^(?<leadingSpaces>\s*)\^\s*$/;

// type ShakuDirectiveFloatCallout = {
//   type: 'DirectiveFloatCallout',
//   config: {
//     offset: number
//     position: 'left' | 'right'
//   }
// }

// const RegShakuDirectiveFloatCallout = /^(?<leadingSpaces>\s*)(\<~|~>)\s*$/

type ShakuDirectiveCollapse = {
  type: "DirectiveCollapse";
  config: {
    offset: number;
    mark: "start" | "end";
  };
};
const RegShakuDirectiveCollapse =
  /^(?<leadingSpaces>\s*)@collapse\s+(?<mark>\S+)\s*$/;

type ShakuDirectiveHighlight = {
  type: "DirectiveHighlight";
  config: {
    mark: "start" | "end" | "below";
  };
};

const RegShakuDirectiveHighlight =
  /^(?<leadingSpaces>\s*)@highlight(\s+(?<mark>(\S+)?)\s*)?$/;

type ShakuLine =
  | ShakuDirectiveUnderline
  | ShakuAnnotationLine
  | ShakuDirectiveCallout
  | ShakuDirectiveCollapse
  | ShakuDirectiveHighlight;

export const parseLine = (line: string): ShakuLine | null => {
  const matchShakuDirectiveUnderlineSolid = line.match(
    RegShakuDirectiveUnderlineSolid
  );
  if (matchShakuDirectiveUnderlineSolid) {
    return {
      type: "DirectiveUnderline",
      config: {
        offset:
          matchShakuDirectiveUnderlineSolid.groups?.leadingSpaces.length ?? 0,
        content: matchShakuDirectiveUnderlineSolid.groups?.content ?? "",
        style: "solid",
      },
    };
  }

  const matchShakuDirectiveUnderlineWavy = line.match(
    RegShakuDirectiveUnderlineWavy
  );
  if (matchShakuDirectiveUnderlineWavy) {
    return {
      type: "DirectiveUnderline",
      config: {
        offset:
          matchShakuDirectiveUnderlineWavy.groups?.leadingSpaces.length ?? 0,
        content: matchShakuDirectiveUnderlineWavy.groups?.content ?? "",
        style: "wavy",
      },
    };
  }
  const matchShakuDirectiveUnderlineDotted = line.match(
    RegShakuDirectiveUnderlineDotted
  );
  if (matchShakuDirectiveUnderlineDotted) {
    return {
      type: "DirectiveUnderline",
      config: {
        offset:
          matchShakuDirectiveUnderlineDotted.groups?.leadingSpaces.length ?? 0,
        content: matchShakuDirectiveUnderlineDotted.groups?.content ?? "",
        style: "dotted",
      },
    };
  }

  const matchShakuAnnotationLine = line.match(RegShakuAnnotationLine);
  if (matchShakuAnnotationLine) {
    return {
      type: "AnnotationLine",
      config: {
        offset: matchShakuAnnotationLine.groups?.leadingSpaces.length ?? 0,
        content: matchShakuAnnotationLine.groups?.content ?? "",
      },
    };
  }

  const matchShakuDirectiveCallout = line.match(RegShakuDirectiveCallout);
  if (matchShakuDirectiveCallout) {
    return {
      type: "DirectiveCallout",
      config: {
        offset: matchShakuDirectiveCallout.groups?.leadingSpaces.length ?? 0,
      },
    };
  }

  const matchShakuDirectiveCollapse = line.match(RegShakuDirectiveCollapse);
  if (matchShakuDirectiveCollapse) {
    const mark = matchShakuDirectiveCollapse.groups?.mark;
    if (mark !== "start" && mark !== "end") {
      throw new Error(`mark: ${mark} is not supported under @collapose`);
    }

    return {
      type: "DirectiveCollapse",
      config: {
        offset: matchShakuDirectiveCollapse.groups?.leadingSpaces.length ?? 0,
        mark,
      },
    };
  }

  const matchShakuDirectiveHighlight = line.match(RegShakuDirectiveHighlight);
  if (matchShakuDirectiveHighlight) {
    const mark = matchShakuDirectiveHighlight.groups?.mark ?? 'below'
    if (
      mark !== "start" &&
      mark !== "end" &&
      mark !== "below"
    ) {
      throw new Error(`mark: ${mark} is not supported under @highlight`);
    }

    return {
      type: "DirectiveHighlight",
      config: {
        mark,
      },
    };
  }

  return null;
};

export function shouldApplyAnnotation(meta: string): boolean {
  return /\bannotate\b/.test(meta);
}

/**
 * Thought we process by lines, but we need to render in blocks, for instance:
 * A full callout normally contains:
 * 1. DirectiveCallout
 * 2. one or more AnnotationLine
 * 
 * An underline annotation contains:
 * 1. DirectiveUnderline
 * 2. one ore more AnnotationLine
 * 
 * DirectiveCollapse also render a few lines of source code 
 * 
 * So this function should render component
 */

type ShakuComponentCallout = {
  type: 'ShakuComponentCallout',
  config: {
    offset: number
    arrowOffset: number
    contents: string[]
  }
}

type ShakuComponentUnderline = {
  type: 'ShakuComponentUnderline'
  config: {
    offset: number
    underlineOffset: number
    underlineContent: string
    underlineStyle: 'solid' | 'dotted' | 'wavy'
    contents: string[]
  }
}

type ShakuComponent = 
  | ShakuComponentCallout
  | ShakuComponentUnderline
export function renderComponent(component: ShakuComponent) {
  switch (component.type) {
    case 'ShakuComponentCallout':
      return `<div class="shaku-callout" style="left:${component.config.offset}ch"><span class="shaku-callout-arrow" style="left:${component.config.arrowOffset}ch"></span>${component.config.contents.map(escapeHtml).join('\n')}</div>`;
    case 'ShakuComponentUnderline':
      return `<div class="shaku-underline shaku-underline-${component.config.underlineStyle}" style="left:${component.config.offset}ch"><span class="shaku-underline-line" style="left:${component.config.underlineOffset}ch">${component.config.underlineContent}</span>${component.config.contents.map(escapeHtml).join('\n')}</div>`
    default:
      assertsNever(component)
  }
}

function assertsNever(data: never) {
  throw new Error('expected never but got: ' + data)
}

function escapeHtml(html: string) {
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}