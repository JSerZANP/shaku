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
            font-family: Georgia;
            font-size: 0.8em;
          }

          .annotate {
            padding: 1rem 0;
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
        `}}>
        </style>
      <body>{children}</body>
    </html>
  );
}