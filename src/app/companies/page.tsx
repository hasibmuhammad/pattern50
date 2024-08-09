"use client";
import React, { useEffect, useState } from "react";
import CompanyList from "./CompanyList";
import { List, MagnifyingGlass, PlusCircle } from "@phosphor-icons/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import AddCompany from "./AddCompany";
import Sidebar from "@/components/Sidebar";
import Button from "@/components/button/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputSelectMulti from "@/components/InputSelectMulti";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axiosInstance";
import { AxiosResponse } from "axios";

type SearchForm = {
  term: string;
  filter: string[];
};

const CompanySearchSchema = z.object({
  term: z
    .string({ required_error: "Search term required!" })
    .min(2, { message: "Search term should be more than 2 characters." }),
  filter: z.array(z.string()).optional(),
});

const Companies = () => {
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
  } = useForm<SearchForm>({ resolver: zodResolver(CompanySearchSchema) });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("query");
    const stateQuery = searchParams.get("state");

    if (query) {
      setSearchTerm(query);
      setValue("term", query);
    } else {
      setSearchTerm("");
    }

    if (stateQuery) {
      const stateArray = stateQuery.split(",");
      setFilter(stateArray);
      setValue("filter", stateArray);
    } else {
      setFilter([]);
    }
  }, [searchParams, setValue]);

  const search: SubmitHandler<SearchForm> = (data) => {
    setSearchTerm(data.term);

    router.push(
      `/companies?page=1&query=${data.term}&state=${filter.join(",")}`
    );
  };

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
        <h4 className="font-bold text-blue-500">Companies</h4>
        <h1 className="text-3xl font-bold">All Companies</h1>
        <div>
          <form onSubmit={handleSubmit(search)}>
            <div className="flex flex-col-reverse md:flex-row items-center gap-5">
              <div className="w-full flex gap-2">
                <div className="w-full relative flex justify-center items-center">
                  <MagnifyingGlass className="absolute left-2" />
                  <input
                    {...register("term")}
                    className="border outline-none w-full px-10 py-2 rounded-md"
                    placeholder="Search by name, phone, email, location"
                    defaultValue={searchTerm}
                    type="search"
                  />
                </div>
                <Button intent={"secondary"} type="submit">
                  Search
                </Button>

                <InputSelectMulti
                  control={control}
                  name="filterByState"
                  placeholder="State"
                  className="w-full md:w-3/12 basic-multi-select"
                  options={states}
                  setFilter={setFilter}
                  value={filter}
                  urlPart="/companies?state"
                />
              </div>
              <Button
                className="flex items-center gap-1"
                onClick={handleDrawerOpen}
                type="button"
              >
                <PlusCircle weight="bold" size={24} />
                Add Company
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
            <CompanyList initialFilter={filter} searchTerm={searchTerm} />
          </div>
        )}
      </div>

      {/* Add company drawer */}
      {isDrawerOpen && (
        <AddCompany isOpen={isDrawerOpen} onClose={handleDrawerClose} />
      )}
    </div>
  );
};

export default Companies;
