"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { TechnologyCategoryType } from "@/types/types";
import axiosInstance from "../../../lib/axiosInstance";
import Button from "@/components/button/button";
import { cn } from "../../../utils/cn";
import Image from "next/image";

const Tools = ({
  searchTerm,
  activeTab,
  page,
  setPage,
}: {
  searchTerm: string;
  activeTab: string;
  page: number;
  setPage: (page: number) => void;
}) => {
  const [size, setSize] = useState(10);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const sizeParam = parseInt(searchParams.get("size") || "10", 10);
    setSize(sizeParam);
    setPage(pageParam);
  }, [searchParams, setPage]);

  useEffect(() => {
    router.push(
      `/technologies?page=${page}&size=${size}&query=${searchTerm || ""}`
    );
  }, [page, size, searchTerm, router]);

  const fetchTools = async (page: number, searchTerm: string) => {
    try {
      const accessToken = localStorage.getItem("access-token");
      const refreshToken = localStorage.getItem("refresh-token");

      if (refreshToken) {
        const res: AxiosResponse<{
          data: TechnologyCategoryType[];
          count: number;
        }> = await axiosInstance.get(
          `/technology-tool/list/category/${activeTab}?page=${page}&size=${size}&query=${
            searchTerm || ""
          }&currentTab=${activeTab}`
        );

        return res.data;
      } else {
        router.push("/login");
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        router.push("/login");
      }
      console.error(error);
    }
  };

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["technologyTools", page, searchTerm, activeTab],
    queryFn: () => fetchTools(page, searchTerm),
    refetchOnWindowFocus: false,
  });

  const technologyTools = data?.data || [];
  const totalPage = data ? Math.ceil(data.count / size) : 1;

  const onPageChange = (newPage: number) => {
    setPage(newPage);
    refetch();
  };

  const getPagination = () => {
    const pagination = [];
    const maxPagesToShow = 3;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPage, page + Math.floor(maxPagesToShow / 2));

    if (endPage - startPage + 1 < maxPagesToShow) {
      if (page < Math.ceil(maxPagesToShow / 2)) {
        endPage = Math.min(maxPagesToShow, totalPage);
      } else if (page > totalPage - Math.floor(maxPagesToShow / 2)) {
        startPage = Math.max(totalPage - maxPagesToShow + 1, 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    if (startPage > 1) {
      pagination.unshift("...");
      pagination.unshift(1);
    }

    if (endPage < totalPage) {
      pagination.push("...");
      pagination.push(totalPage);
    }

    return pagination;
  };

  if (isFetching) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <p>Error loading tools. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="relative sm:rounded-lg">
      <div className="w-full overflow-x-scroll lg:overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Tool Name
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Website
              </th>
              <th
                scope="col"
                className="sticky bg-white md:bg-gray-50 right-0 px-6 py-3 text-center"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {technologyTools.map((tool) => (
              <tr
                key={tool?._id}
                className={cn(" border-b bg-white", {
                  "bg-blue-200": tool._id === activeTab,
                })}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  <span className="flex gap-1 items-center">
                    <Image
                      className="object-cover rounded-full"
                      src={tool?.logo}
                      width={"30"}
                      height={"30"}
                      alt="Logo"
                    />
                    {tool?.name}
                  </span>
                </th>
                <td className="px-6 py-4">{tool?.type}</td>
                <td className="px-6 py-4">{tool?.website}</td>
                <td className="sticky right-0 bg-white">
                  <div className="flex items-center justify-center px-6 py-4 space-x-4">
                    <Button intent={"link"}>Edit</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="my-10 px-10 lg:px-0 flex flex-col md:flex-row gap-5 md:gap-0 items-center md:justify-between">
        <div>
          <p className="text-slate-400">
            Showing {technologyTools.length} out of {data?.count}
          </p>
        </div>
        <div className="flex items-center justify-center md:justify-end">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="mx-1 px-4 bg-white text-black disabled:opacity-50"
          >
            <ArrowLeft size={24} />
          </button>
          {getPagination().map((pageNum) =>
            pageNum === "..." ? (
              <span key={pageNum} className="mx-1 px-4 py-2">
                ...
              </span>
            ) : (
              <Link
                key={pageNum}
                href={`/technologies?page=${pageNum}&size=${size}${
                  searchTerm && `&query=${searchTerm}`
                }`}
              >
                <Button
                  onClick={() => onPageChange(+pageNum)}
                  state={pageNum === page ? "active" : "inactive"}
                >
                  {pageNum}
                </Button>
              </Link>
            )
          )}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPage}
            className="mx-1 px-4 bg-white text-black disabled:opacity-50"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tools;
