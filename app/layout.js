import "./globals.css";

export const metadata = {
  title: "Stock Code Finder",
  description: "Find store stock codes from item photos."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
