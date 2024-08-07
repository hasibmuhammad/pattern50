"use client";
import { Categories, CompanyInfoType, ProductInfo } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import Button from "@/components/button/button";
import { List, PencilSimpleLine } from "@phosphor-icons/react";
import EditCompany from "@/app/companies/EditCompany";
import Sidebar from "@/components/Sidebar";
import axiosInstance from "../../../../../lib/axiosInstance";
import Image from "next/image";
import { cn } from "../../../../../utils/cn";
import { useRouter } from "next/navigation";

const ControllRoom = () => {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  const [currentCategory, setCurrentCategory] = useState<string>(
    "662b4c1a0b8e7c936cbc0f91"
  );

  // Synchronize currentCategory with URL on component mount
  useEffect(() => {
    const categoryIdFromUrl = searchParams.get("categoryId");
    if (categoryIdFromUrl) {
      setCurrentCategory(categoryIdFromUrl);
    } else if (currentCategory) {
      // If no categoryId in URL, set the URL to the currentCategory
      router.push(
        `/products/${id}/controll-room?page=1&size=10&query=&categoryId=${currentCategory}&filterBy=`
      );
    }
  }, [searchParams]);

  const handleCategoryClick = (categoryId: string) => {
    setCurrentCategory(categoryId);
    router.push(
      `/products/${id}/controll-room?page=1&size=10&query=&categoryId=${categoryId}&filterBy=`
    );
  };

  // get product details
  const {
    data: productDetail,
    isFetching,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: ["productDetail", id],
    queryFn: async () => {
      if (id) {
        try {
          const response: AxiosResponse<ProductInfo> = await axiosInstance(
            `/product/${id}`
          );

          return response.data;
        } catch (error) {
          console.error("Error fetching product info", error);
          throw new Error("Error fetching product info");
        }
      }
      return null;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  // get the categories
  const { data: categories, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["getCategories"],
    queryFn: async () => {
      const response: AxiosResponse<Categories[]> = await axiosInstance.get(
        "/resource-category"
      );

      return response.data;
    },
  });

  const formatDate = (isoString: string) => {
    if (!isoString) return "Invalid Date";

    const date = new Date(isoString);
    const day = date.getDate();
    const year = date.getFullYear();

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];

    return `${day} ${month} ${year}`;
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarVisibility = () => setIsSidebarOpen(!isSidebarOpen);

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  return (
    <div className="p-5 relative w-full">
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

      {/* Controll room start */}
      <div className="space-y-2">
        <h4 className="font-bold text-blue-500">Controll Room</h4>
        <h1 className="text-3xl font-bold">
          {productDetail?.name} Controll Room
        </h1>
      </div>

      {/* Categories */}
      <div className="my-12">
        <h2 className="text-2xl font-bold">Categories</h2>
        <div className="my-5 flex gap-2">
          {categories?.map((category) => (
            <div
              key={category._id} // Adding a unique key to each category item
              className={cn(
                "bg-slate-100 min-w-24 w-full rounded-md flex items-center justify-center px-8 py-4 cursor-pointer",
                {
                  "bg-blue-600 text-white": currentCategory === category?._id,
                }
              )}
              onClick={() => handleCategoryClick(category._id)}
            >
              <div className="flex gap-1 items-center justify-center">
                <Image
                  src={category?.image}
                  alt={category?.name}
                  width={24}
                  height={24}
                  className={cn({
                    svgColor: currentCategory === category?._id,
                  })}
                />
                <p>{category?.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControllRoom;
