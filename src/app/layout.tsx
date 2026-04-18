import type { Metadata } from "next";
import { MotionProvider } from "@ms122r2/puck-renderer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "LXS Site", template: "%s" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>
          <main>{children}</main>
        </MotionProvider>
      </body>
    </html>
  );
}
