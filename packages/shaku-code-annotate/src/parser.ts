import sanitizeHtml from "sanitize-html";

type ShakuDirectiveUnderline = {
  type: "DirectiveUnderline";
  config: {
    style: "solid" | "dotted" | "wavy";
    content: string;
    offset: number;
    isEscaped: boolean;
  };
};
const RegShakuDirectiveUnderlineSolid =
  /^(?<leadingSpaces>\s*)(?<content>(-|_)+)\s*(?<shift><*)\s*(?<escape>!?)\s*$/;
const RegShakuDirectiveUnderlineWavy =
  /^(?<leadingSpaces>\s*)(?<content>~+)\s*(?<shift><*)\s*(?<escape>!?)\s*$/;
const RegShakuDirectiveUnderlineDotted =
  /^(?<leadingSpaces>\s*)(?<content>\.+)\s*(?<shift><*)\s*(?<escape>!?)\s*$/;

type ShakuAnnotationLine = {
  type: "AnnotationLine";
  config: {
    offset: number;
    content: string;
    isEscaped: boolean;
  };
};

const RegShakuAnnotationLine =
  /^(?<leadingSpaces>\s*)\[(?<content>.+)\]\s*(?<shift><*)\s*(?<escape>!?)\s*$/;

export type ShakuDirectiveHighlightInline = {
  type: "DirectiveHighlightInline";
  config: {
    isEscaped: boolean;
    parts: Array<{
      offset: number;
      length: number;
      id?: number;
    }>;
  };
};

const RegShakuDirectiveHighlightInline =
  /^(\(\d*\))+(?<shift><*)(?<escape>!?)$/;
const RegShakuDirectiveHighlightInlinePart = /\(\s*(?<id>\d*)\s*\)/g;
function isShakuDirectiveHighlightInline(str: string): {
  isEscaped: boolean;
  shift: number;
  isHighlightInline: boolean;
} {
  const significantLine = str.replace(/ /g, "");
  const matches = significantLine.match(RegShakuDirectiveHighlightInline);
  return {
    isEscaped: !!matches?.groups?.escape,
    isHighlightInline: !!matches,
    shift: matches?.groups?.shift.length ?? 0,
  };
}

type ShakuDirectiveCallout = {
  type: "DirectiveCallout";
  config: {
    isEscaped: boolean;
    offset: number;
  };
};

const RegShakuDirectiveCallout =
  /^(?<leadingSpaces>\s*)\^\s*(?<shift><*)\s*(?<escape>!?)\s*$/;

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
    isEscaped: boolean;
    offset: number;
    mark: "start" | "end";
  };
};
const RegShakuDirectiveCollapse =
  /^(?<leadingSpaces>\s*)@collapse\s+(?<mark>\S+)\s*(?<escape>!?)\s*$/;

type ShakuDirectiveHighlight = {
  type: "DirectiveHighlight";
  config: {
    isEscaped: boolean;
    mark: "start" | "end" | "below";
  };
};

const RegShakuDirectiveHighlight =
  /^(?<leadingSpaces>\s*)@highlight(\s+(?<mark>(\S+)?)\s*)?\s*(?<escape>!?)\s*$/;

type ShakuDirectiveDim = {
  type: "DirectiveDim";
  config: {
    isEscaped: boolean;
    mark: "start" | "end" | "below";
  };
};
const RegShakuDirectiveDim =
  /^(?<leadingSpaces>\s*)@dim(\s+(?<mark>(\S+)?)\s*)?\s*(?<escape>!?)\s*$/;

type ShakuDirectiveFocus = {
  type: "DirectiveFocus";
  config: {
    isEscaped: boolean;
    mark: "start" | "end" | "below";
  };
};

const RegShakuDirectiveFocus =
  /^(?<leadingSpaces>\s*)@focus(\s+(?<mark>(\S+)?)\s*)?\s*(?<escape>!?)\s*$/;

type ShakuLine =
  | ShakuDirectiveUnderline
  | ShakuAnnotationLine
  | ShakuDirectiveCallout
  | ShakuDirectiveCollapse
  | ShakuDirectiveHighlight
  | ShakuDirectiveDim
  | ShakuDirectiveFocus
  | ShakuDirectiveHighlightInline;

export const parseLine = (line: string): ShakuLine | null => {
  const matchShakuDirectiveUnderlineSolid = line.match(
    RegShakuDirectiveUnderlineSolid
  );
  if (matchShakuDirectiveUnderlineSolid) {
    return {
      type: "DirectiveUnderline",
      config: {
        isEscaped: !!matchShakuDirectiveUnderlineSolid.groups?.escape,
        offset:
          (matchShakuDirectiveUnderlineSolid.groups?.leadingSpaces.length ??
            0) - (matchShakuDirectiveUnderlineSolid.groups?.shift.length ?? 0),
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
        isEscaped: !!matchShakuDirectiveUnderlineWavy.groups?.escape,
        offset:
          (matchShakuDirectiveUnderlineWavy.groups?.leadingSpaces.length ?? 0) -
          (matchShakuDirectiveUnderlineWavy.groups?.shift.length ?? 0),
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
        isEscaped: !!matchShakuDirectiveUnderlineDotted.groups?.escape,
        offset:
          (matchShakuDirectiveUnderlineDotted.groups?.leadingSpaces.length ??
            0) - (matchShakuDirectiveUnderlineDotted.groups?.shift.length ?? 0),
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
        isEscaped: !!matchShakuAnnotationLine.groups?.escape,
        offset:
          (matchShakuAnnotationLine.groups?.leadingSpaces.length ?? 0) -
          (matchShakuAnnotationLine.groups?.shift.length ?? 0),
        content: matchShakuAnnotationLine.groups?.content ?? "",
      },
    };
  }

  const matchShakuDirectiveCallout = line.match(RegShakuDirectiveCallout);
  if (matchShakuDirectiveCallout) {
    return {
      type: "DirectiveCallout",
      config: {
        isEscaped: !!matchShakuDirectiveCallout.groups?.escape,
        offset:
          (matchShakuDirectiveCallout.groups?.leadingSpaces.length ?? 0) -
          (matchShakuDirectiveCallout.groups?.shift.length ?? 0),
      },
    };
  }

  const matchShakuDirectiveCollapse = line.match(RegShakuDirectiveCollapse);
  if (matchShakuDirectiveCollapse) {
    const mark = matchShakuDirectiveCollapse.groups?.mark;
    if (mark === "start" || mark === "end") {
      return {
        type: "DirectiveCollapse",
        config: {
          isEscaped: !!matchShakuDirectiveCollapse.groups?.escape,
          offset: matchShakuDirectiveCollapse.groups?.leadingSpaces.length ?? 0,
          mark,
        },
      };
    }
  }

  const matchShakuDirectiveHighlight = line.match(RegShakuDirectiveHighlight);
  if (matchShakuDirectiveHighlight) {
    const mark = matchShakuDirectiveHighlight.groups?.mark || "below";
    if (mark === "start" || mark === "end" || mark === "below") {
      return {
        type: "DirectiveHighlight",
        config: {
          isEscaped: !!matchShakuDirectiveHighlight.groups?.escape,
          mark,
        },
      };
    }
  }
  const matchShakuDirectiveDim = line.match(RegShakuDirectiveDim);
  if (matchShakuDirectiveDim) {
    const mark = matchShakuDirectiveDim.groups?.mark || "below";
    if (mark === "start" || mark === "end" || mark === "below") {
      return {
        type: "DirectiveDim",
        config: {
          isEscaped: !!matchShakuDirectiveDim.groups?.escape,
          mark,
        },
      };
    }
  }
  const matchShakuDirectiveFocus = line.match(RegShakuDirectiveFocus);
  if (matchShakuDirectiveFocus) {
    const mark = matchShakuDirectiveFocus.groups?.mark || "below";
    if (mark === "start" || mark === "end" || mark === "below") {
      return {
        type: "DirectiveFocus",
        config: {
          isEscaped: !!matchShakuDirectiveFocus.groups?.escape,
          mark,
        },
      };
    }
  }

  const { isHighlightInline, shift, isEscaped } =
    isShakuDirectiveHighlightInline(line);
  if (isHighlightInline) {
    const parts = [...line.matchAll(RegShakuDirectiveHighlightInlinePart)];
    return {
      type: "DirectiveHighlightInline",
      config: {
        isEscaped,
        parts: parts.map((part) => {
          return {
            offset: part.index! - shift,
            length: part[0].length,
            id: part[1] ? Number(part[1]) : undefined,
          };
        }),
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
 * So this function should render component
 */

type ShakuComponentCallout = {
  type: "ShakuComponentCallout";
  config: {
    offset: number;
    arrowOffset: number;
    /** restricted raw html */
    contents: string;
  };
};

type ShakuComponentUnderline = {
  type: "ShakuComponentUnderline";
  config: {
    offset: number;
    underlineOffset: number;
    underlineContent: string;
    underlineStyle: "solid" | "dotted" | "wavy";
    /** restricted raw html */
    contents: string;
  };
};

type ShakuComponent = ShakuComponentCallout | ShakuComponentUnderline;
export function renderComponent(component: ShakuComponent) {
  switch (component.type) {
    case "ShakuComponentCallout":
      return `<div class="shaku-callout" style="left:${
        component.config.offset
      }ch"><span class="shaku-callout-arrow" style="left:${
        component.config.arrowOffset
      }ch"></span>${sanitize(component.config.contents)}</div>`;
    case "ShakuComponentUnderline":
      return `<div class="shaku-underline shaku-underline-${
        component.config.underlineStyle
      }" style="left:${
        component.config.offset
      }ch"><span class="shaku-underline-line" style="left:${
        component.config.underlineOffset
      }ch">${component.config.underlineContent}</span>${sanitize(
        component.config.contents
      )}</div>`;
    default:
      assertsNever(component);
  }
}

function assertsNever(data: never) {
  throw new Error("expected never but got: " + data);
}

/* only allow restricted html in shaku annotation */
function sanitize(html: string = "") {
  const result = sanitizeHtml(html, {
    allowedTags: ["b", "i", "em", "strong", "a", "p"],
    allowedAttributes: {
      a: ["href", "target"],
    },
  });
  return result;
}
