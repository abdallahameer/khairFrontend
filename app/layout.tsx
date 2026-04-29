import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="ltr" lang="en" className="h-full w-full antialiased">
      <body className="min-h-full w-full flex flex-col">{children}</body>
    </html>
  );
}
