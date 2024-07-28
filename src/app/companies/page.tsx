"use client";
import React, { useEffect, useState } from "react";
import CompanyList from "./CompanyList";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";

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

  return (
    <div className="w-[78vw]">
      <div className="space-y-2">
        <h4 className="font-bold text-blue-500">Companies</h4>
        <h1 className="text-3xl font-bold">All Companies</h1>
        <div>
          <form onSubmit={handleSubmit(search)}>
            <div className="flex gap-2">
              <div className="w-full relative flex justify-center items-center">
                <MagnifyingGlass className="absolute left-2" />
                <input
                  {...register("term", {
                    required: "Please write something to search...",
                  })}
                  className="border outline-none w-full px-10 py-2"
                  placeholder="Search by name, phone, email, location"
                  defaultValue={searchTerm}
                />
              </div>
              <button
                type="submit"
                className="bg-slate-100 font-normal rounded-md px-4"
              >
                Search
              </button>
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
    </div>
  );
};

export default Companies;
