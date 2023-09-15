import { $ } from "migacss";
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
  style?: CSSProperties;
} & {
  [P in keyof React.CSSProperties as P extends string
    ? `$${P}`
    : never]: React.CSSProperties[P];
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

export function Column({ children, ...rest }) {
  return (
    <$.div $display="flex" $flexDirection="column" {...rest}>
      {children}
    </$.div>
  );
}

export const Row = forwardRef(function Row(
  { children, ...rest }: BaseProps,
  ref?: RefObject<HTMLDivElement>
) {
  return (
    <$.div
      ref={ref}
      $display="flex"
      $flexDirection="row"
      $justifyContent="space-between"
      $alignItems="stretch"
      {...rest}
    >
      {children}
    </$.div>
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
    <$.button
      ref={ref}
      onClick={onClick}
      $display="inline-flex"
      $gap="5px"
      $alignItems="center"
      $backgroundColor="transparent"
      $padding="6px 10px"
      $borderRadius="5px"
      $fontSize="16px"
      $border={hovered ? "1px solid #555" : "1px solid #eee"}
      {...rest}
    >
      {icon} {label}
    </$.button>
  );
}

export const View = forwardRef(function View(
  { children, ...rest }: BaseProps,
  ref?: RefObject<HTMLDivElement>
) {
  return (
    <$.div {...rest} ref={ref}>
      {children}
    </$.div>
  );
});

function Headline1({ children, ...rest }: BaseProps) {
  return (
    <$.h1 $fontSize={"32px"} $fontWeight={700} $lineHeight={1.5} {...rest}>
      {children}
    </$.h1>
  );
}

function Headline2({ children, ...rest }: BaseProps) {
  return (
    <$.h2 $fontSize={"28px"} $fontWeight={700} $lineHeight={1.5} {...rest}>
      {children}
    </$.h2>
  );
}

function Headline3({ children, ...rest }: BaseProps) {
  return (
    <$.h3 $fontSize={"24px"} $fontWeight={700} $lineHeight={1.5} {...rest}>
      {children}
    </$.h3>
  );
}

function Headline4({ children, ...rest }: BaseProps) {
  return (
    <$.h4 $fontSize={"20px"} $fontWeight={700} $lineHeight={1.5} {...rest}>
      {children}
    </$.h4>
  );
}

function Headline5({ children, ...rest }: BaseProps) {
  return (
    <$.h5 $fontSize={"16px"} $fontWeight={700} $lineHeight={1.5} {...rest}>
      {children}
    </$.h5>
  );
}

function Body({ children, ...rest }: BaseProps) {
  return (
    <$.p $fontSize={"16px"} $lineHeight={1.5} {...rest}>
      {children}
    </$.p>
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

  const detach = useCallback(() => {
    if (refClean.current) {
      refClean.current();
    }

    refPrev.current = null;
  }, []);

  const ref = (el: HTMLElement) => {
    if (el === null) {
      detach();
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
