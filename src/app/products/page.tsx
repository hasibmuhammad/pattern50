"use client";
import React, { useState } from "react";
import { List, MagnifyingGlass, PlusCircle } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import Sidebar from "@/components/Sidebar";
import Button from "@/components/button/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputSelectMulti from "@/components/InputSelectMulti";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axiosInstance";
import ProductList from "./ProductList";

type SearchForm = {
  term: string;
  stateFilter: string[];
};

const ProductSearchSchema = z.object({
  term: z
    .string({ required_error: "Search term required!" })
    .min(2, { message: "Search term should be more than 2 characters." }),
  stateFilter: z.array(z.string()).optional(),
});

const Products = () => {
  const { data: states } = useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const response = await axiosInstance.get("/company/states");
      return response.data.map((state: any) => ({
        label: state.name,
        value: state.name,
      }));
    },
    refetchOnWindowFocus: false,
  });

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SearchForm>({ resolver: zodResolver(ProductSearchSchema) });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [stateFilter, setStateFilter] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarVisibility = () => setIsSidebarOpen(!isSidebarOpen);

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
      {/* Company Start */}
      <div className="space-y-2">
        <h4 className="font-bold text-blue-500">Products</h4>
        <h1 className="text-3xl font-bold">All Products</h1>
        <div>
          <form onSubmit={handleSubmit((data) => console.log(data))}>
            <div className="flex flex-col-reverse md:flex-row items-center gap-5">
              <div className="w-full flex gap-2">
                <div className="w-full relative flex justify-center items-center">
                  <MagnifyingGlass className="absolute left-2" />
                  <input
                    {...register("term")}
                    className="border outline-none w-full px-10 py-2 rounded-md"
                    placeholder="Search by product, company name"
                    defaultValue={searchTerm}
                    type="search"
                  />
                </div>
                <Button intent={"secondary"} type="submit">
                  Search
                </Button>

                {/* <InputSelectMulti
                  control={control}
                  name="stateFilter"
                  placeholder="Filter"
                  className="w-2/3 basic-multi-select"
                  options={[
                    { label: "Draft", value: "Draft" },
                    { label: "Signed", value: "Signed" },
                    { label: "Amended", value: "Amended" },
                    { label: "Terminated", value: "Terminated" },
                    { label: "Completed", value: "Completed" },
                  ]}
                  setStateFilter={setStateFilter}
                  value={stateFilter}
                /> */}
              </div>
              <Button
                className="flex items-center gap-1"
                onClick={handleDrawerOpen}
                type="button"
              >
                <PlusCircle weight="bold" size={24} />
                Add Product
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
            <ProductList searchTerm={""} />
          </div>
        )}
      </div>
      {/* Add company drawer
      {isDrawerOpen && (
        <AddCompany isOpen={isDrawerOpen} onClose={handleDrawerClose} />
      )} */}
    </div>
  );
};

export default Products;
