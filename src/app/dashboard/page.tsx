"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const router = useRouter();

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
        <div className="flex justify-between gap-10">
          <div>Welcome to dashboard</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
