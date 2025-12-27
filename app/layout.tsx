import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ConvexClientProvider } from "@/components/web/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GymDay | The Ultimate Gym Day Pass",
    template: "%s | GymDay",
  },
  description: "Access the highest-rated gyms in your city with a single day pass. No contracts, no hassle, just fitness. Your premium gym booking companion.",
  keywords: ["gym", "fitness", "workout", "day pass", "gym membership", "GymDay", "flexible fitness"],
  authors: [{ name: "GymDay Team" }],
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1 w-full">
              <ConvexClientProvider>{children}</ConvexClientProvider>
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
