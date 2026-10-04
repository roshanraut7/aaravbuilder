import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import "./site.css";
import "./motion.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-body" });
const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
});
export const metadata: Metadata = {
  title: "Aarav Builder & IT Solution — Built for what’s next.",
  description:
    "From thoughtful spaces to powerful digital experiences. Explore civil construction, architecture, website development, and mobile app solutions with Aarav.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${display.variable}`}>
        {children}
      </body>
    </html>
  );
}
