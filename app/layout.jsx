import { Geist, Geist_Mono } from "next/font/google";
import "@/style/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Backend CHH",
  description: "All Backend For CHH",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex items-center justify-center w-full h-screen p-2 gap-2 border-2 border-dark-background">
          {children}
        </div>
      </body>
    </html>
  );
}
