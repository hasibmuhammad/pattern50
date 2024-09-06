"use client";
import Sidebar from "@/components/Sidebar";
import { List } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("@/components/Chart/Chart"), { ssr: false });

import React, { useState } from "react";

const Overview = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarVisibility = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <>
      <div className="flex">
        <div className="block md:hidden py-5 md:py-0">
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

        <div className="px-8 pt-5">
          <h4 className="font-bold text-blue-500">Overview</h4>
          <h1 className="text-3xl font-bold">Overview</h1>
        </div>
      </div>
      {/* Reveneue section start */}

      <div className="px-8 my-5">
        <div className="my-5">
          <Chart />
        </div>
      </div>
    </>
  );
};

export default Overview;
