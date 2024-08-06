"use client";
import Sidebar from "@/components/Sidebar";
import { List, MagnifyingGlass, PlusCircle } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axiosInstance";
import { AxiosResponse } from "axios";
import { TechnologyCategoryType } from "@/types/types";
import Loader from "@/components/Loader";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/button/button";
import Tools from "./Tools";
import TechnologyTabs from "./TechnologyTabs";
import AddCompany from "../companies/AddCompany";
import AddTool from "./AddTool";

type SearchForm = {
  term: string;
};

const TechnologySearchSchema = z.object({
  term: z
    .string({ required_error: "Search term required!" })
    .min(2, { message: "Search term should be more than 2 characters." }),
  stateFilter: z.array(z.string()).optional(),
});

const Technologies = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("66227d00aae1e76863377a94");
  const [page, setPage] = useState(1); // New state to track the page

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  const handleSidebarVisibility = () => setIsSidebarOpen(!isSidebarOpen);

  const handleActiveTab = (id: string) => {
    setActiveTab(id);
    setPage(1); // Reset to page 1 when a new category is selected
  };

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response: AxiosResponse<{ data: TechnologyCategoryType[] }> =
        await axiosInstance.get("technology-category/list");
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const techCategories = categories?.data || [];

  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchParams = useSearchParams();

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SearchForm>({ resolver: zodResolver(TechnologySearchSchema) });

  useEffect(() => {
    const query = searchParams.get("query");

    if (query) {
      setSearchTerm(query);
      setValue("term", query);
    } else {
      setSearchTerm("");
    }
  }, [searchParams, setValue]);

  const search: SubmitHandler<SearchForm> = (data) => {
    setSearchTerm(data.term);
    setPage(1);
  };

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
        <div className="w-full my-10">
          <TechnologyTabs
            techCategories={techCategories}
            activeTab={activeTab}
            handleActiveTab={handleActiveTab}
          />

          <div className="my-10">
            <form onSubmit={handleSubmit(search)}>
              <div className="flex flex-col-reverse md:flex-row items-center gap-5">
                <div className="w-full flex gap-2">
                  <div className="w-full relative flex justify-center items-center">
                    <MagnifyingGlass className="absolute left-2" />
                    <input
                      {...register("term")}
                      className="border outline-none w-full px-10 py-2 rounded-md"
                      placeholder="Search by name, tool type"
                      defaultValue={searchTerm}
                      type="search"
                    />
                  </div>
                  <Button intent={"secondary"} type="submit">
                    Search
                  </Button>
                </div>
                <Button
                  className="flex items-center gap-1"
                  onClick={handleDrawerOpen}
                  type="button"
                >
                  <PlusCircle weight="bold" size={24} />
                  Add Tool
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
              <Tools
                searchTerm={searchTerm}
                activeTab={activeTab}
                page={page}
                setPage={setPage}
              />
            </div>
          )}
        </div>
      )}

      {/* Add company drawer */}
      {isDrawerOpen && (
        <AddTool isOpen={isDrawerOpen} onClose={handleDrawerClose} />
      )}
    </div>
  );
};

export default Technologies;
