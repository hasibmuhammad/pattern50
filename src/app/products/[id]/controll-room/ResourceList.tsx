"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Info } from "@phosphor-icons/react";
import axios, { AxiosResponse } from "axios";
import { Resources } from "@/types/types";
import axiosInstance from "../../../../../lib/axiosInstance";
import Button from "@/components/button/button";
import { cn } from "../../../../../utils/cn";

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

const ResourceList = ({
  searchTerm,
  initialFilter,
  productId,
  currentCategory,
  toolId,
}: {
  searchTerm: string;
  initialFilter: string[];
  productId: any;
  currentCategory: string;
  toolId: any;
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [size, setSize] = useState(10);
  const [filter, setFilter] = useState<string[]>(initialFilter);

  // handle Edit Click
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editItemId, setEditItemId] = useState("");
  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setEditItemId("");
  };

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const filterBy = searchParams.get("filterBy") || "";
    setCurrentPage(page);
    setSize(size);
    setFilter(filterBy ? filterBy.split(",") : []);
  }, [searchParams]);

  useEffect(() => {
    router.push(
      `/products/${productId}/controll-room?page=${currentPage}&size=${size}&query=${
        searchTerm || ""
      }&categoryId=${currentCategory}&toolId=${toolId}&filterBy=${
        filter.join(",") || ""
      }`
    );
  }, [currentPage, size, searchTerm, filter, toolId]);

  const fetchResources = async (
    page: number,
    searchTerm: string,
    filter: string[]
  ) => {
    try {
      const accessToken = localStorage.getItem("access-token");
      const refreshToken = localStorage.getItem("refresh-token");

      if (refreshToken) {
        const res: AxiosResponse<{ data: Resources[]; count: number }> =
          await axiosInstance.get(
            `/resource/list?page=${page}&size=${size}&query=${
              searchTerm || ""
            }&categoryId=${currentCategory}&productId=${productId}&toolId=${
              toolId || ""
            }&filterBy=${filter.join(",").toLowerCase() || ""}`
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
      "resources",
      currentPage ? currentPage : 1,
      searchTerm ? searchTerm : "",
      filter,
      toolId,
      currentCategory,
    ],
    queryFn: () => fetchResources(currentPage, searchTerm, filter),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setCurrentPage((prevPage) =>
        Math.min(prevPage, Math.ceil(data.count / size))
      );
    }
  }, [data, size]);

  const handleRefetchOnUpdate = () => refetch();

  const resources = data?.data || [];
  const totalPage = data ? Math.ceil(data.count / size) : 1;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    router.push(
      `/products/${productId}/controll-room?page=${page}&size=${size}&query=${
        searchTerm || ""
      }&categoryId=${currentCategory}&toolId=${toolId}&filterBy=${
        filter.join(",") || ""
      }`
    );
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
        <p>Error loading resources. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="relative sm:rounded-lg">
      {!isFetching && resources?.length !== 0 ? (
        <>
          <div className="w-full overflow-x-scroll lg:overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Resource Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Tool
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Resource Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
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
                {resources.map((resource) => (
                  <tr
                    key={resource?._id}
                    className={cn("border-b bg-white", {
                      "bg-blue-200": resource._id === editItemId,
                    })}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {resource?.name}
                    </th>
                    <td className="px-6 py-4 uppercase">
                      {resource?.tool.name}
                    </td>
                    <td className="px-6 py-4 uppercase flex items-center">
                      {resource?.type.name}{" "}
                      <span
                        className="cursor-pointer"
                        title={`${resource?.type?.description}`}
                      >
                        <Info size={16} />
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(resource?.created_at)}
                    </td>
                    <td className="sticky right-0 bg-white">
                      <Button
                        intent={"link"}
                        onClick={() => {
                          setEditItemId(resource._id);
                          handleDrawerOpen();
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-gray-600">
              Showing {resources.length} of {data?.count} resources
            </div>

            <div className="flex items-center justify-center md:justify-end">
              <button
                onClick={() => {
                  if (currentPage > 1) {
                    onPageChange(currentPage - 1);
                  }
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
                    href={`/products/${productId}/controll-room?page=${page}&size=${size}&query=${
                      searchTerm || ""
                    }&categoryId=${currentCategory}&toolId=${toolId}&filterBy=${
                      filter.join(",") || ""
                    }`}
                  >
                    <Button
                      onClick={() => onPageChange(+page)}
                      state={page === currentPage ? "active" : "inactive"}
                    >
                      {page}
                    </Button>
                  </Link>
                )
              )}
              <button
                onClick={() => {
                  if (currentPage < totalPage) {
                    onPageChange(currentPage + 1);
                  }
                }}
                disabled={currentPage >= totalPage}
                className="mx-1 px-4 bg-white text-black disabled:opacity-50"
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-slate-400 font-medium">No resources found!</p>
      )}
    </div>
  );
};

export default ResourceList;
