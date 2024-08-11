"use client";

type Props = {
  isOpen?: boolean;
  handleSidebarVisibility?: () => void;
};

import Link from "next/link";
import Logo from "../../public/logo.svg";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Buildings,
  CircleNotch,
  Link as LinkIcon,
  HouseSimple,
  SignOut,
  X,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";

const Sidebar = ({ isOpen, handleSidebarVisibility }: Props) => {
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

  const isActive = (route: string) => pathname.startsWith(route);

  return (
    <aside
      className={`fixed top-0 left-0 min-h-screen w-64 z-50 bg-slate-100  px-4 py-2 transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div>
        <nav className="space-y-12">
          <div
            className={`${isOpen ? "flex items-center justify-between" : ""}`}
          >
            <Link href={"/overview"}>
              <Image className="pt-5" src={Logo} alt="Logo" />
            </Link>
            {isOpen && (
              <X
                onClick={handleSidebarVisibility}
                weight="bold"
                className="text-blue-400 mt-5 cursor-pointer"
                size={28}
              />
            )}
          </div>
          <ul className="space-y-2">
            <li
              className={`font-medium text-sm hover:bg-blue-200 py-3 pl-2 transition-all rounded-md ${
                isActive("/overview")
                  ? "bg-blue-200 text-blue-700 py-3 pl-2 transition-colors delay-150 rounded-md"
                  : ""
              }`}
            >
              <Link className="flex gap-1 items-center" href={"/overview"}>
                <HouseSimple /> Overview
              </Link>
            </li>
            <li
              className={`font-medium text-sm hover:bg-blue-200 py-3 pl-2 transition-all rounded-md ${
                isActive("/dashboard")
                  ? "bg-blue-200 text-blue-700 py-3 pl-2 transition-colors delay-150 rounded-md"
                  : ""
              }`}
            >
              <Link className="flex gap-1 items-center" href={"/dashboard"}>
                <Buildings /> Dashboard
              </Link>
            </li>
            <li
              className={`font-medium text-sm hover:bg-blue-200 py-3 pl-2 transition-all rounded-md ${
                isActive("/companies")
                  ? "bg-blue-200 text-blue-700 py-3 pl-2 transition-colors delay-150 rounded-md"
                  : ""
              }`}
            >
              <Link
                className="flex gap-1 items-center"
                href={"/companies?page=1&size=10"}
              >
                <Buildings /> Companies
              </Link>
            </li>
            <li
              className={`font-medium text-sm hover:bg-blue-200 py-3 pl-2 transition-all rounded-md ${
                isActive("/products")
                  ? "bg-blue-200 text-blue-700 py-3 pl-2 transition-colors delay-150 rounded-md"
                  : ""
              }`}
            >
              <Link
                className="flex gap-1 items-center"
                href={"/products?page=1&size=10&query=&filterBy="}
              >
                <Buildings /> Products
              </Link>
            </li>
            <li
              className={`font-medium text-sm hover:bg-blue-200 py-3 pl-2 transition-all rounded-md ${
                isActive("/technologies")
                  ? "bg-blue-200 text-blue-700 py-3 pl-2 transition-colors delay-150 rounded-md"
                  : ""
              }`}
            >
              <Link className="flex gap-1 items-center" href={"/technologies"}>
                <LinkIcon /> Technologies
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
                    <SignOut /> Logout
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
