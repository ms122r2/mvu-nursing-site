import type { Metadata } from "next";
import { MotionProvider } from "@/renderer/components/puck/MotionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "LXS Site",
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
