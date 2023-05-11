export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
       <style dangerouslySetInnerHTML={{__html:`
          .callout {
            background-color: #eee;
            color: #888;
            padding: 0.5em 1em;
            position: relative;
            // font-family: Georgia;
            // font-size: 0.8em;
          }

          .annotate {
            padding: 1rem 0;
          }
          .annotate:has(.callout-of-dashes),
          .annotate:has(.callout-of-waves) {
            padding-top: 0;
            color: red;
          }
          .callout-arrow {
            width: 1em;
            height: 1em;
            display: inline-block;
            background-color: #eee;
            position: absolute;
            top: -0.5em;
            left: 0.5em;
            transform: rotate(45deg);
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
        `}}>
        </style>
      <body>{children}</body>
    </html>
  );
}