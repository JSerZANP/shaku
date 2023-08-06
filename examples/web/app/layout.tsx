import "../css/global.css";
export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <title>Shaku</title>
      <link rel="icon" type="image/jpg" href="/static/img/favicon.jpg"></link>
      <body>{children}</body>
    </html>
  );
}
