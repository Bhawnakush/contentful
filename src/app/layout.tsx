import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Blog - Share Your Thoughts",
  description: "A platform to share insightful articles on various topics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-gray-100 text-gray-900 ${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
       <header className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-6 shadow-lg">
  <div className="max-w-7xl mx-auto px-6 text-center">
    {/* Header Title */}
    <h1 className="text-4xl font-extrabold leading-tight mb-4">
      My Blog
    </h1>

    {/* Subtitle with a touch of lightness for readability */}
    <p className="text-lg font-medium opacity-80 mb-6">
      Thoughts, stories, and ideas from around the world
    </p>

    {/* Optional: Add a call-to-action button */}
    <div>
    
    </div>
  </div>
</header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-6 mt-12">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm">© 2024 My Blog. All rights reserved.</p>
            <p className="text-sm mt-2">Built with Next.js and Tailwind CSS</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
