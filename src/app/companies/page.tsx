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

type SearchForm = {
  term: string;
};

const Companies = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SearchForm>();

  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchTerm(query);
    } else {
      setSearchTerm("");
    }

    return () => setSearchTerm("");
  }, [searchParams]);

  const search: SubmitHandler<SearchForm> = (data) => {
    router.push(`/companies?page=1&query=${data.term}`);
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarVisibility = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="relative w-full lg:w-[78vw]">
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
                    {...register("term", {
                      required: "Please write something to search...",
                    })}
                    className="border outline-none w-full px-10 py-2 rounded-md"
                    placeholder="Search by name, phone, email, location"
                    defaultValue={searchTerm}
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
            <CompanyList searchTerm={searchTerm} />
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
