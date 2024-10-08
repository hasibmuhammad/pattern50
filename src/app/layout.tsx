import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";
import QueryClientWrapperProvider from "@/providers/QueryClientWrapperProvider";
import { headers } from "next/headers";

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
          <div className="h-full flex">
            <Sidebar />
            <div className={`md:ml-64 flex-1 overflow-y-auto`}>{children}</div>
          </div>
        </QueryClientWrapperProvider>
      </body>
    </html>
  );
}
