import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";
import QueryClientWrapperProvider from "@/providers/QueryClientWrapperProvider";
// import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pattern50",
  description: "An AI Assistant application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Navbar /> */}
        <QueryClientWrapperProvider>
          <div className="max-w-full mx-auto flex gap-10">
            <div>
              <Sidebar />
            </div>
            <div className="mt-10">{children}</div>
          </div>
        </QueryClientWrapperProvider>
      </body>
    </html>
  );
}
