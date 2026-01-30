import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "EJM Services Email Form",
  description: "Send Email using Resend API",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
