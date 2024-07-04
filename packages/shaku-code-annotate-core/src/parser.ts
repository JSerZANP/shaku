import { parseDataEntries } from "./parseDataEntries";
import { fromHtml } from "hast-util-from-html";

export type ShakuDirectiveUnderline = {
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

export type ShakuAnnotationLine = {
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
      id?: string;
    }>;
  };
};

const RegShakuDirectiveHighlightInline =
  /^(\([a-zA-Z0-9]*\))+(?<shift><*)(?<escape>!?)$/;
const RegShakuDirectiveHighlightInlinePart = /\(\s*(?<id>[a-zA-Z0-9]*)\s*\)/g;
function isShakuDirectiveHighlightInline(str: string): {
  isEscaped: boolean;
  shift: number;
  isHighlightInline: boolean;
} {
  const significantLine = str.replace(/\s/g, "");
  const matches = significantLine.match(RegShakuDirectiveHighlightInline);
  return {
    isEscaped: !!matches?.groups?.escape,
    isHighlightInline: !!matches,
    shift: matches?.groups?.shift.length ?? 0,
  };
}

export type ShakuDirectiveCallout = {
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

export type ShakuDirectiveFold = {
  type: "DirectiveFold";
  config: {
    isEscaped: boolean;
    mark: "start" | "end";
  };
};
const RegShakuDirectiveFold =
  /^(?<leadingSpaces>\s*)@fold(\s+(?<mark>[a-z\^]+)?)?\s*(?<escape>!?)\s*$/;

export type ShakuDirectiveHighlight = {
  type: "DirectiveHighlight";
  config: {
    isEscaped: boolean;
    mark: "start" | "end" | "below";
  };
};

const RegShakuDirectiveHighlight =
  /^(?<leadingSpaces>\s*)@highlight(\s+(?<mark>[a-z\^]+)?)?\s*(?<escape>!?)\s*$/;

export type ShakuDirectiveDim = {
  type: "DirectiveDim";
  config: {
    isEscaped: boolean;
    mark: "start" | "end" | "below";
  };
};
const RegShakuDirectiveDim =
  /^(?<leadingSpaces>\s*)@dim(\s+(?<mark>[a-z\^]+)?)?\s*(?<escape>!?)\s*$/;

export type ShakuDirectiveFocus = {
  type: "DirectiveFocus";
  config: {
    isEscaped: boolean;
    mark: "start" | "end" | "below";
  };
};

const RegShakuDirectiveFocus =
  /^(?<leadingSpaces>\s*)@focus(\s+(?<mark>[a-z\^]+)?)?\s*(?<escape>!?)\s*$/;

export type ShakuDirectiveDiff = {
  type: "DirectiveDiff";
  config: {
    isEscaped: boolean;
    type: "+" | "-";
    mark: "start" | "end" | "below";
  };
};

const RegShakuDirectiveDiff =
  /^(?<leadingSpaces>\s*)@diff\s+(?<type>(\+|\-))\s*((?<mark>([a-z\^]+)?)\s*)?(?<escape>!?)\s*$/;

export type ShakuDirectiveClass = {
  type: "DirectiveClass";
  config: {
    isEscaped: boolean;
    classNames: string;
  };
};

const RegShakuDirectiveClass =
  /^(?<leadingSpaces>\s*)@class\s+(?<classNames>([a-zA-Z0-9 \-_]+))\s*(?<escape>!?)\s*$/;

export type ShakuDirectiveData = {
  type: "DirectiveData";
  config: {
    isEscaped: boolean;
    entries: Array<{ key: string; value: string }>;
  };
};

const RegShakuDirectiveData =
  /^(?<leadingSpaces>\s*)@data\s+(?<entries>([a-zA-Z0-9 \\"\-=_]+))\s*(?<escape>!?)\s*$/;

export type ShakuDirectiveCut = {
  type: "DirectiveCut";
  config: {
    isEscaped: boolean;
    mark: "start" | "end" | "below";
  };
};

const RegShakuDirectiveCut =
  /^(?<leadingSpaces>\s*)@cut(\s+(?<mark>[a-z\^]+)?)?\s*(?<escape>!?)\s*$/;

export type ShakuLine =
  | ShakuDirectiveUnderline
  | ShakuAnnotationLine
  | ShakuDirectiveCallout
  | ShakuDirectiveFold
  | ShakuDirectiveHighlight
  | ShakuDirectiveDim
  | ShakuDirectiveFocus
  | ShakuDirectiveHighlightInline
  | ShakuDirectiveDiff
  | ShakuDirectiveClass
  | ShakuDirectiveData
  | ShakuDirectiveCut;

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

  const matchShakuDirectiveFold = line.match(RegShakuDirectiveFold);
  if (matchShakuDirectiveFold) {
    const mark = getCanonicalMark(
      matchShakuDirectiveFold.groups?.mark ?? "below"
    );
    if (mark === "start" || mark === "end") {
      return {
        type: "DirectiveFold",
        config: {
          isEscaped: !!matchShakuDirectiveFold.groups?.escape,
          mark,
        },
      };
    }
  }

  const matchShakuDirectiveHighlight = line.match(RegShakuDirectiveHighlight);
  if (matchShakuDirectiveHighlight) {
    const mark = getCanonicalMark(
      matchShakuDirectiveHighlight.groups?.mark ?? "below"
    );
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
    const mark = getCanonicalMark(
      matchShakuDirectiveDim.groups?.mark ?? "below"
    );
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
    const mark = getCanonicalMark(
      matchShakuDirectiveFocus.groups?.mark ?? "below"
    );
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

  const matchShakuDirectiveDiff = line.match(RegShakuDirectiveDiff);
  if (matchShakuDirectiveDiff) {
    const type = matchShakuDirectiveDiff.groups?.type;
    const mark = getCanonicalMark(
      matchShakuDirectiveDiff.groups?.mark ?? "below"
    );

    if (
      (type === "+" || type === "-") &&
      (mark === "start" || mark === "end" || mark === "below")
    ) {
      return {
        type: "DirectiveDiff",
        config: {
          isEscaped: !!matchShakuDirectiveDiff.groups?.escape,
          type,
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
            id: part[1] || undefined,
          };
        }),
      },
    };
  }

  const matchShakuDirectiveClass = line.match(RegShakuDirectiveClass);
  if (matchShakuDirectiveClass) {
    const classNames = matchShakuDirectiveClass.groups?.classNames ?? "";

    return {
      type: "DirectiveClass",
      config: {
        isEscaped: !!matchShakuDirectiveClass.groups?.escape,
        classNames: classNames.trim(),
      },
    };
  }

  const matchShakuDirectiveData = line.match(RegShakuDirectiveData);
  if (matchShakuDirectiveData) {
    const entriesStr = matchShakuDirectiveData.groups?.entries ?? "";

    const entries = parseDataEntries(entriesStr);
    return {
      type: "DirectiveData",
      config: {
        isEscaped: !!matchShakuDirectiveData.groups?.escape,
        entries,
      },
    };
  }

  const matchShakuDirectiveCut = line.match(RegShakuDirectiveCut);
  if (matchShakuDirectiveCut) {
    const mark = getCanonicalMark(
      matchShakuDirectiveCut.groups?.mark ?? "below"
    );
    if (mark === "start" || mark === "end" || mark === "below") {
      return {
        type: "DirectiveCut",
        config: {
          isEscaped: !!matchShakuDirectiveCut.groups?.escape,
          mark,
        },
      };
    }
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
 * DirectiveFold also render a few lines of source code
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

export type ShakuComponent = ShakuComponentCallout | ShakuComponentUnderline;

export function renderComponent(
  component: ShakuComponent,
  options?: {
    useDangerousRawHtml?: boolean;
  }
) {
  const useDangerousRawHtml = options?.useDangerousRawHtml;
  switch (component.type) {
    case "ShakuComponentCallout":
      return `<div class="shaku-callout" style="left:${
        component.config.offset
      }ch"><span class="shaku-callout-arrow" style="left:${
        component.config.arrowOffset
      }ch"></span>${
        useDangerousRawHtml
          ? component.config.contents
          : escapeHtml(component.config.contents)
      }</div>`;
    case "ShakuComponentUnderline":
      return `<div class="shaku-underline shaku-underline-${
        component.config.underlineStyle
      }" style="left:${
        component.config.offset
      }ch"><span class="shaku-underline-line" style="left:${
        component.config.underlineOffset
      }ch">${component.config.underlineContent}</span>${
        useDangerousRawHtml
          ? component.config.contents
          : escapeHtml(component.config.contents)
      }</div>`;
    default:
      assertsNever(component);
  }
}

export function renderComponentHast(
  component: ShakuComponent,
  options?: {
    useDangerousRawHtml?: boolean;
  }
) {
  const useDangerousRawHtml = options?.useDangerousRawHtml;
  switch (component.type) {
    case "ShakuComponentCallout":
      return {
        type: "element",
        tagName: "div",
        properties: {
          className: "shaku-callout",
          style: `left:${component.config.offset}ch`,
        },
        children: [
          {
            type: "element",
            tagName: "span",
            properties: {
              className: "shaku-callout-arrow",
              style: `left:${component.config.arrowOffset}ch`,
            },
          },
          useDangerousRawHtml
            ? fromHtml(component.config.contents, { fragment: true })
            : {
                type: "text",
                value: escapeHtml(component.config.contents),
              },
        ],
      };
    case "ShakuComponentUnderline":
      return {
        type: "element",
        tagName: "div",
        properties: {
          className: `shaku-underline shaku-underline-${component.config.underlineStyle}`,
          style: `left:${component.config.offset}ch`,
        },
        children: [
          {
            type: "element",
            tagName: "span",
            properties: {
              className: "shaku-underline-line",
              style: `left:${component.config.underlineOffset}ch`,
            },
            children: [
              {
                type: "text",
                value: component.config.underlineContent,
              },
            ],
          },
          useDangerousRawHtml
            ? fromHtml(component.config.contents, { fragment: true })
            : {
                type: "text",
                value: escapeHtml(component.config.contents),
              },
        ],
      };
    default:
      assertsNever(component);
  }
}

function assertsNever(data: never) {
  throw new Error("expected never but got: " + data);
}

function escapeHtml(html: string) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getCanonicalMark(mark: string) {
  if (mark === "v") return "start";
  if (mark === "^") return "end";
  return mark;
}
