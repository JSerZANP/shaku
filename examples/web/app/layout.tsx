export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <style
        dangerouslySetInnerHTML={{
          __html: `

          pre.shiki .line {
            min-height: 1em;
          }

          pre.shiki .line.highlight {
            background-color: #dffa83;
            display: block;
          }

          .shaku-callout {
            background-color: #0685ce;
            color: #fff;
            padding: 0.5em 1ch;
            position: relative;
            margin: 0.5em 0;
            display: inline-block;
            border-radius: 3px;
        
          }

          .shaku-callout-arrow {
            width: 1ch;
            height: 1ch;
            display: inline-block;
            background-color: #0685ce;
            position: absolute;
            top: -0.5ch;
            transform: rotate(45deg);
          }

          .shaku-underline {
            padding: 0 1ch;
            position: relative;
            display: block;
            border-radius: 3px;
            color: red;
            margin: 0.3em 0;
          }

          .shaku-underline-line {
            line-height: 0;
            top: 0.5em;
            position: absolute;
            text-decoration-line: overline;
            text-decoration-color: red;
            color: transparent;
            pointer-events: none;
            user-select: none;
            text-decoration-thickness: 2px;
          }

          .shaku-underline-wavy > .shaku-underline-line {
            text-decoration-style: wavy;
            top: 0.7em;
          }

          .shaku-underline-solid > .shaku-underline-line{
            text-decoration-style: solid;
          }

          .shaku-underline-dotted > .shaku-underline-line{
            text-decoration-style: dotted;
          }
          

          .annotate {
            padding: 1rem 0;
          }
          .annotate:has(.callout-of-dashes),
          .annotate:has(.callout-of-waves) {
            padding-top: 0;
            color: red;
          }
          .callout-dashes {
            position: absolute;
            border-top: 2px solid red;
            height: 1px;
            color: transparent;
          }
          .callout-of-dashes {
            background-color: transparent;
            color: red;
            padding-left: 0;
          }

          .callout-waves {
            position: absolute;
            border-top: 2px dotted blue;
            height: 1px;
            color: transparent;
          }
          .callout-of-waves {
            background-color: transparent;
            color: blue;
            padding-left: 0;
          }
        `,
        }}
      ></style>
      <body>{children}</body>
    </html>
  );
}
