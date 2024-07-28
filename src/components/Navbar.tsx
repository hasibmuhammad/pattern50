"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/logo.svg";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "./Loader"; // import Loader component

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      setLoading(true);
      const localStorageAccessToken = localStorage.getItem("access-token");
      if (localStorageAccessToken) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error getting access token", error);
    }
  }, []);

  const handleLogout = () => {
    try {
      setLoading(true);
      localStorage.removeItem("access-token");
      setLoggedIn(false);
      router.push("/login");
    } catch (error) {
      console.error("Error removing access token", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {!loading && (
        <nav className="w-[70vw] mx-auto mt-10">
          {/* <div>
            <Link href={"/"}>
              <Image src={Logo} alt="Company Logo" />
            </Link>
          </div> */}
          <ul className="font-semibold">
            {loggedIn ? (
              <li key="logout">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-blue-400 text-white rounded-md"
                >
                  Log Out
                </button>
              </li>
            ) : (
              <li key="login">
                <Link href={"/login"}>Login</Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </>
  );
};

export default Navbar;
