import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import UserContextProvider from "@/providers/UserContextProvider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Retire Safely | Safe Retirement Planner",
  description: "Plan your path to safe retirement with clear scenario tools.",
  icons: {
    icon: "/CoinfusedLogo.png",
    shortcut: "/CoinfusedLogo.png",
    apple: "/CoinfusedLogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <UserContextProvider>{children}</UserContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
