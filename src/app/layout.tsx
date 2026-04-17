import type { Metadata } from "next";
import { MotionProvider } from "@lxs/puck-renderer";

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
