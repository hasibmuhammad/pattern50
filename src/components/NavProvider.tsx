"use client";

import Navbar from "./Navbar";

export const NavProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};
