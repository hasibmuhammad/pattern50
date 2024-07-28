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
          <div className="min-h-screen flex">
            <aside className="fixed top-0 left-0 w-64 h-full">
              <Sidebar />
            </aside>
            <div className="ml-64 flex-1 p-4 overflow-y-auto">{children}</div>
          </div>
        </QueryClientWrapperProvider>
      </body>
    </html>
  );
}
