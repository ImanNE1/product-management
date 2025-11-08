import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "./components/theme/theme-provider";
import { Providers } from "./providers";
import { Footer } from "./components/layout/footer";

export const metadata: Metadata = {
  title: "ProductHub",
  description: "Inventory Management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Providers>
            <div className="flex-1 flex flex-col">{children}</div>
            <Footer />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}