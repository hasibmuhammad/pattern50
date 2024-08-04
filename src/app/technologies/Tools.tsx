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
}: {
  searchTerm: string;
  activeTab: string;
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [size, setSize] = useState(10);

  // Edit company things
  //   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  //   const [editItemId, setEditItemId] = useState("");
  //   const handleDrawerOpen = () => setIsDrawerOpen(true);

  //   const handleDrawerClose = () => {
  //     setIsDrawerOpen(false);
  //     setEditItemId("");
  //   };

  //   // handleEdit Click
  //   const handleEditClick = (companyId: string) => {
  //     setEditItemId(companyId);
  //     handleDrawerOpen();
  //   };

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const state = searchParams.get("state") || "";
    setCurrentPage(page);
    setSize(size);
  }, [searchParams]);

  useEffect(() => {
    router.push(
      `/technologies?page=${currentPage}&size=${size}&query=${searchTerm || ""}`
    );
  }, [currentPage, size, searchTerm]);

  // fetchTools function
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
    queryKey: [
      "technologyTools",
      currentPage ? currentPage : 1,
      searchTerm ? searchTerm : "",
      activeTab,
    ],
    queryFn: () => fetchTools(currentPage, searchTerm),
    refetchOnWindowFocus: false,
  });

  const handleRefetchOnUpdate = () => refetch();

  const technologyTools = data?.data || [];

  const totalPage = data ? Math.ceil(data.count / size) : 1;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };

  const getPagination = () => {
    const pagination = [];
    const maxPagesToShow = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(
      totalPage,
      currentPage + Math.floor(maxPagesToShow / 2)
    );

    if (endPage - startPage + 1 < maxPagesToShow) {
      if (currentPage < Math.ceil(maxPagesToShow / 2)) {
        endPage = Math.min(maxPagesToShow, totalPage);
      } else if (currentPage > totalPage - Math.floor(maxPagesToShow / 2)) {
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
      <div className="flex items-center justify-center md:justify-end my-10 px-10 lg:px-0">
        <button
          onClick={() => {
            onPageChange(currentPage - 1);
            router.push(
              `/technologies?page=${currentPage - 1}&size=${size}${
                searchTerm && `&query=${searchTerm}`
              }`
            );
          }}
          disabled={currentPage <= 1}
          className="mx-1 px-4 bg-white text-black disabled:opacity-50"
        >
          <ArrowLeft size={24} />
        </button>
        {getPagination().map((page) =>
          page === "..." ? (
            <span key={page} className="mx-1 px-4 py-2">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={`/technologies?page=${page}&size=${size}${
                searchTerm && `&query=${searchTerm}`
              }`}
            >
              <Button
                onClick={() => onPageChange(currentPage)}
                state={page === currentPage ? "active" : "inactive"}
              >
                {page}
              </Button>
            </Link>
          )
        )}
        <button
          onClick={() => {
            onPageChange(currentPage + 1);
            router.push(
              `/technologies?page=${currentPage + 1}&size=${size}${
                searchTerm && `&query=${searchTerm}`
              }`
            );
          }}
          disabled={currentPage >= totalPage}
          className="mx-1 px-4 bg-white text-black disabled:opacity-50"
        >
          <ArrowRight size={24} />
        </button>
      </div>

      {/* Edit Company Drawer */}
      {/* {isDrawerOpen && (
        <EditCompany
          isOpen={isDrawerOpen}
          editItemId={editItemId}
          onClose={handleDrawerClose}
          onUpdate={handleRefetchOnUpdate}
        />
      )} */}
    </div>
  );
};

export default Tools;
