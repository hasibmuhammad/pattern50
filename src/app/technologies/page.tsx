"use client";
import Sidebar from "@/components/Sidebar";
import { List } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axiosInstance from "../../../lib/axiosInstance";
import { AxiosResponse } from "axios";
import { TechnologyCategoryType } from "@/types/types";
import Loader from "@/components/Loader";
import { usePathname } from "next/navigation";
import { cn } from "../../../utils/cn";

const Technologies = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("66227d00aae1e76863377a94");

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);
  const handleSidebarVisibility = () => setIsSidebarOpen(!isSidebarOpen);
  const handleActiveTab = (id: string) => {
    setActiveTab(id);
  };

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response: AxiosResponse<TechnologyCategoryType> =
        await axiosInstance.get("technology-category/list");
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const techCategories = categories?.data || [];

  return (
    <div className="p-5 relative w-full lg:w-[78vw]">
      <div className="visible lg:invisible py-5 lg:py-0">
        <List
          onClick={handleSidebarVisibility}
          className="cursor-pointer"
          size={32}
        />
      </div>

      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        handleSidebarVisibility={handleSidebarVisibility}
      />

      {/* Technology Start */}
      <div className="space-y-2">
        <h4 className="font-bold text-blue-500">Technologies</h4>
        <h1 className="text-3xl font-bold">Available Technologies</h1>
      </div>

      {isLoading ? (
        <div className="min-h-[70vh] flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <nav className="w-full my-10">
          <div className="border-b-2 border-gray-200 relative">
            <ul className="flex justify-around">
              {techCategories.map((category) => (
                <li
                  onClick={() => handleActiveTab(category._id)}
                  className={cn(
                    "flex-1 text-center text-slate-400 font-bold pb-2 cursor-pointer relative",
                    {
                      "after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-blue-500 text-blue-500 font-bold":
                        activeTab === category._id,
                    }
                  )}
                  key={category._id}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      {/* Add company drawer */}
      {/* {isDrawerOpen && (
        <AddCompany isOpen={isDrawerOpen} onClose={handleDrawerClose} />
      )} */}
    </div>
  );
};

export default Technologies;
