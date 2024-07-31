"use client";
import Sidebar from "@/components/Sidebar";
import { List } from "@phosphor-icons/react";
import React, { useState } from "react";

const Overview = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarVisibility = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <div className="flex gap-5">
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

      <div className="pt-5">
        <h1>Overview</h1>
      </div>
    </div>
  );
};

export default Overview;
