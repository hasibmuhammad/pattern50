"use client";
import {
  Categories,
  CompanyInfoType,
  ProductInfo,
  Resources,
  ResourceTypes,
  TechnologiesByCategory,
} from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import Button from "@/components/button/button";
import { List, MagnifyingGlass, PlusCircle } from "@phosphor-icons/react";
import Sidebar from "@/components/Sidebar";
import axiosInstance from "../../../../../lib/axiosInstance";
import Image from "next/image";
import { cn } from "../../../../../utils/cn";
import { useRouter } from "next/navigation";
import InputSelectMulti from "@/components/InputSelectMulti";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import ResourceList from "./ResourceList";

type SearchForm = {
  term: string;
  filter: string[];
};

const SearchSchema = z.object({
  term: z
    .string({ required_error: "Search term required!" })
    .min(2, { message: "Search term should be more than 2 characters." }),
});

const ControllRoom = () => {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [size, setSize] = useState(10);
  const [filter, setFilter] = useState<string[]>([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleSidebarVisibility = () => setIsSidebarOpen(!isSidebarOpen);

  const [currentCategory, setCurrentCategory] = useState<string>(
    "662b4c1a0b8e7c936cbc0f91"
  );

  const [toolId, setToolId] = useState("");

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SearchForm>({ resolver: zodResolver(SearchSchema) });

  // Synchronize currentCategory with URL on component mount
  useEffect(() => {
    const categoryIdFromUrl = searchParams.get("categoryId");
    if (categoryIdFromUrl) {
      setCurrentCategory(categoryIdFromUrl);
    } else if (currentCategory) {
      // If no categoryId in URL, set the URL to the currentCategory
      router.push(
        `/products/${id}/controll-room?page=${currentPage}&size=${size}&query=${
          searchTerm || ""
        }&categoryId=${currentCategory}&filterBy=${filter.join(",") || ""}`
      );
    }

    const query = searchParams.get("query");
    const filterBy = searchParams.get("filterBy");

    if (query) {
      setSearchTerm(query);
      setValue("term", query);
    } else {
      setSearchTerm("");
    }

    if (filterBy) {
      const filterArray = filterBy.split(",");
      setFilter(filterArray);
      setValue("filter", filterArray);
    } else {
      setFilter([]);
    }
  }, [searchParams, setValue]);

  const handleCategoryClick = (categoryId: string) => {
    setCurrentCategory(categoryId);
    router.push(
      `/products/${id}/controll-room?page=1&size=10&query=&categoryId=${categoryId}&filterBy=${
        filter.join(",") || ""
      }`
    );
  };

  const handleToolClick = (toolId: string) => {
    setToolId(toolId);
    router.push(
      `/products/${id}/controll-room?page=1&size=10&query=${
        searchTerm || ""
      }&categoryId=${currentCategory}&toolId=${toolId || ""}&filterBy=${
        filter.join(",") || ""
      }`
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
    refetchOnWindowFocus: false,
  });

  // get technologies based on category and product
  const { data: technologiesById } = useQuery({
    queryKey: ["getTechnologies", productDetail?._id, currentCategory],
    queryFn: async () => {
      const res: AxiosResponse<TechnologiesByCategory[]> =
        await axiosInstance.get(
          `resource/tools/resource-category?categoryId=${currentCategory}&productId=${productDetail?._id}`
        );

      return res.data;
    },
    enabled: !!currentCategory && !!productDetail?._id,
    refetchOnWindowFocus: false,
  });

  // get resource types based on category
  const { data: resourceTypes } = useQuery({
    queryKey: ["resourceTypes", currentCategory],
    queryFn: async () => {
      const res: AxiosResponse<{ types: ResourceTypes[] }> =
        await axiosInstance.get(
          `/resource-type/by-category?categoryId=${currentCategory}`
        );

      return res.data;
    },
    enabled: !!currentCategory,
    refetchOnWindowFocus: false,
  });

  const types = resourceTypes?.types?.map((type) => {
    return {
      label: type?.name,
      value: type?._id,
    };
  });

  console.log(types);

  const search: SubmitHandler<SearchForm> = (data) => {
    setSearchTerm(data.term);

    router.push(
      `/products?page=1&query=${data.term}&filterBy=${filter.join(",")}`
    );
  };

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

      {/* Technologies based on category and product */}
      <div className="my-12">
        <h2 className="text-2xl font-bold">Technologies</h2>
        <div className="my-5 flex gap-2">
          {technologiesById?.length === 0 && (
            <p className="text-slate-400 font-medium">No Technology Found!</p>
          )}
          {technologiesById &&
            technologiesById.length > 0 &&
            technologiesById?.map((technology, idx) => (
              <Button
                onClick={() => handleToolClick(technology?.toolId)}
                intent={"secondary"}
                key={idx}
              >
                <div className="flex gap-1 items-center justify-center">
                  <Image
                    src={technology?.logo}
                    alt={technology?.categoryName}
                    width={24}
                    height={24}
                  />
                  <p>{technology?.toolName}</p>
                </div>
              </Button>
            ))}
        </div>
      </div>

      <div>
        <form onSubmit={handleSubmit(search)}>
          <div className="flex flex-col-reverse md:flex-row items-center gap-5">
            <div className="w-full flex items-center gap-2">
              <h2 className="font-bold text-2xl">Resources</h2>
              <div className="w-full relative flex justify-center items-center">
                <MagnifyingGlass className="absolute left-2" />
                <input
                  {...register("term")}
                  className="border outline-none w-full px-10 py-2 rounded-md"
                  placeholder="Search by resource name"
                  defaultValue={searchTerm}
                  type="search"
                />
              </div>
              <Button intent={"secondary"} type="submit">
                Search
              </Button>

              <InputSelectMulti
                control={control}
                name="filterByResource"
                placeholder="Filter by"
                className="relative w-full md:w-3/12 basic-multi-select"
                options={types || []}
                setFilter={setFilter}
                value={filter}
                urlPart={`/products/${id}/controll-room?page=1&size=${size}&query=${
                  searchTerm || ""
                }&categoryId=${currentCategory}&toolId=${toolId}&filterBy`}
              />
            </div>
            <Button
              className="flex items-center gap-1"
              onClick={handleDrawerOpen}
              type="button"
            >
              <PlusCircle weight="bold" size={24} />
              Add New
            </Button>
          </div>
        </form>
      </div>

      {isSubmitting ? (
        <div>
          <Loader />
        </div>
      ) : (
        <div className="relative pt-5">
          <ResourceList
            currentCategory={currentCategory}
            productId={id}
            initialFilter={filter}
            searchTerm={searchTerm}
            toolId={toolId}
          />
        </div>
      )}
    </div>
  );
};

export default ControllRoom;
