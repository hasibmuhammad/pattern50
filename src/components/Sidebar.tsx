"use client";

import Link from "next/link";
import Logo from "../../public/logo.svg";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Buildings,
  CircleNotch,
  HouseSimple,
  SignOut,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: isLoggedIn, isLoading } = useQuery({
    queryKey: ["checkLoggedInOrNot"],
    queryFn: () => {
      const accessToken = localStorage.getItem("access-token");
      const refreshToken = localStorage.getItem("refresh-token");
      if (!refreshToken) {
        router.push("/login");
        return false;
      } else {
        return true;
      }
    },
  });

  const handleLogout = () => {
    const accessToken = localStorage.getItem("access-token");
    const refreshToken = localStorage.getItem("refresh-token");

    if (accessToken && refreshToken) {
      localStorage.removeItem("access-token");
      localStorage.removeItem("refresh-token");
      router.push("/login");
    }
  };

  return (
    <div className="w-[250px] bg-slate-100 px-4 py-2 min-h-svh">
      <nav className="space-y-12">
        <Link href={"/overview"}>
          <Image className="pt-5" src={Logo} alt="Logo" />
        </Link>
        <ul className="space-y-2">
          <li
            className={`font-medium text-sm hover:bg-blue-200 py-3 pl-2 transition-all rounded-md ${
              pathname === "/overview"
                ? "bg-blue-200 text-blue-700 py-3 pl-2 transition-colors delay-150 rounded-md"
                : ""
            }`}
          >
            <Link className="flex gap-1 items-center" href={"/overview"}>
              {" "}
              <HouseSimple /> Overview
            </Link>
          </li>
          <li
            className={`font-medium text-sm hover:bg-blue-200 py-3 pl-2 transition-all rounded-md ${
              pathname === "/dashboard"
                ? "bg-blue-200 text-blue-700 py-3 pl-2 transition-colors delay-150 rounded-md"
                : ""
            }`}
          >
            <Link className="flex gap-1 items-center" href={"/dashboard"}>
              {" "}
              <Buildings /> Dashboard
            </Link>
          </li>
          <li
            className={`font-medium text-sm hover:bg-blue-200 py-3 pl-2 transition-all rounded-md ${
              pathname === "/companies"
                ? "bg-blue-200 text-blue-700 py-3 pl-2 transition-colors delay-150 rounded-md"
                : ""
            }`}
          >
            <Link
              className="flex gap-1 items-center"
              href={"/companies?page=1"}
            >
              {" "}
              <Buildings /> Companies
            </Link>
          </li>
          {isLoading ? (
            <li
              className={`font-medium text-sm hover:bg-blue-200 py-3 pl-2 transition-all rounded-md`}
            >
              Loading...
            </li>
          ) : (
            isLoggedIn && (
              <li
                className={`font-medium text-sm hover:bg-blue-200 py-3 pl-2 transition-all rounded-md cursor-pointer`}
              >
                <button
                  onClick={handleLogout}
                  className="flex gap-1 items-center"
                >
                  {" "}
                  <SignOut /> Logout
                </button>
              </li>
            )
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
