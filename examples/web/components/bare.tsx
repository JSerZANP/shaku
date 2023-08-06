import {
  CSSProperties,
  ReactNode,
  RefObject,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from "react";

type TextType =
  | "headline1"
  | "headline2"
  | "headline3"
  | "headline4"
  | "headline5"
  | "body";

type BaseProps = {
  children?: ReactNode;
  padding?: CSSProperties["padding"];
  margin?: CSSProperties["padding"];
  marginBottom?: CSSProperties["marginBottom"];
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  flex?: CSSProperties["flex"];
  // this field seems ugly
  maxWidth?: CSSProperties["maxWidth"];
  minWidth?: CSSProperties["minWidth"];
  backgroundColor?: CSSProperties["backgroundColor"];
  color?: CSSProperties["color"];
};

export function Text({
  type,
  children,
  ...rest
}: {
  type: TextType;
} & BaseProps) {
  switch (type) {
    case "headline1":
      return <Headline1 {...rest}>{children}</Headline1>;
    case "headline2":
      return <Headline2 {...rest}>{children}</Headline2>;
    case "headline3":
      return <Headline3 {...rest}>{children}</Headline3>;
    case "headline4":
      return <Headline4 {...rest}>{children}</Headline4>;
    case "headline5":
      return <Headline5 {...rest}>{children}</Headline5>;
    case "body":
      return <Body {...rest}>{children}</Body>;
    default:
      assertNever(type);
  }
}

export function Column({
  children,
  ...rest
}: BaseProps & {
  gap?: CSSProperties["gap"];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", ...rest }}>
      {children}
    </div>
  );
}

export const Row = forwardRef(function Row(
  {
    children,
    ...rest
  }: BaseProps & {
    alignItems?: CSSProperties["alignItems"];
    justifyContent?: CSSProperties["justifyContent"];
    gap?: CSSProperties["gap"];
  },
  ref?: RefObject<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "stretch",
        ...rest,
      }}
    >
      {children}
    </div>
  );
});

export function Button({
  onClick,
  label,
  icon,
  children,
  ...rest
}: BaseProps & {
  onClick: () => void;
  label?: string;
  icon?: ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const onHover = useCallback(() => {
    setHovered(true);
  }, []);
  const onMouseOut = useCallback(() => {
    setHovered(false);
  }, []);
  const refMouseEnter = useEvent("mouseenter", onHover);
  const refMouseOut = useEvent("mouseleave", onMouseOut);
  const ref = mergeRefs(refMouseEnter, refMouseOut);
  return (
    <button
      ref={ref}
      onClick={onClick}
      style={{
        display: "inline-flex",
        gap: "5px",
        alignItems: "ceter",
        backgroundColor: "transparent",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "16px",
        border: hovered ? "1px solid #555" : "1px solid #eee",
        ...rest,
      }}
      {...rest}
    >
      {icon} {label}
    </button>
  );
}

export const View = forwardRef(function View(
  { children, ...rest }: BaseProps,
  ref?: RefObject<HTMLDivElement>
) {
  return (
    <div style={{ ...rest }} ref={ref}>
      {children}
    </div>
  );
});

function Headline1({ children, ...rest }: BaseProps) {
  return (
    <h1 style={{ fontSize: "32px", fontWeight: 700, lineHeight: 1.5, ...rest }}>
      {children}
    </h1>
  );
}

function Headline2({ children, ...rest }: BaseProps) {
  return (
    <h2 style={{ fontSize: "28px", fontWeight: 700, lineHeight: 1.5, ...rest }}>
      {children}
    </h2>
  );
}

function Headline3({ children, ...rest }: BaseProps) {
  return (
    <h3 style={{ fontSize: "24px", fontWeight: 700, lineHeight: 1.5, ...rest }}>
      {children}
    </h3>
  );
}

function Headline4({ children, ...rest }: BaseProps) {
  return (
    <h4 style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1.5, ...rest }}>
      {children}
    </h4>
  );
}

function Headline5({ children, ...rest }: BaseProps) {
  return (
    <h5 style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.5, ...rest }}>
      {children}
    </h5>
  );
}

function Body({ children, ...rest }: BaseProps) {
  return (
    <p style={{ fontSize: "16px", lineHeight: 1.5, ...rest }}>{children}</p>
  );
}

function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

// TODO: consolidate this
function useEvent(event, handler) {
  const refPrev = useRef<HTMLElement>();
  const refClean = useRef<() => void>();

  const attach = useCallback(
    (el: HTMLElement) => {
      el.addEventListener(event, handler);
      refPrev.current = el;
      refClean.current = () => {
        el.removeEventListener(event, handler);
      };
    },
    [event, handler]
  );

  const dettach = useCallback(() => {
    if (refClean.current) {
      refClean.current();
    }

    refPrev.current = null;
  }, []);

  const ref = (el: HTMLElement) => {
    if (el === null) {
      dettach();
    } else {
      attach(el);
    }
  };
  return ref;
}

function mergeRefs(...refs) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useCallback((el) => {
    for (const ref of refs) {
      if ("current" in ref) {
        ref.current = el;
      } else if (typeof ref === "function") {
        ref(el);
      } else {
        throw new Error("not ref");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}
