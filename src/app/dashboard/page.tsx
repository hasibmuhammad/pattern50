"use client";

import Sidebar from "@/components/Sidebar";
import { List } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarVisibility = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const localStorageAccessToken = localStorage.getItem("access-token");
    const localStorageRefreshToken = localStorage.getItem("refresh-token");
    if (!localStorageRefreshToken) {
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      <div className="flex min-h-screen">
        <div className="flex justify-between gap-5">
          <div className="visible lg:invisible py-5 lg:py-0">
            <List
              onClick={handleSidebarVisibility}
              className="cursor-pointer"
              size={32}
            />
          </div>

          <Sidebar
            isOpen={isSidebarOpen}
            handleSidebarVisibility={handleSidebarVisibility}
          />
          <div className="pt-5">Welcome to dashboard</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
