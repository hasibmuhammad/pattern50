"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import axios, { AxiosError, AxiosResponse } from "axios";
import { CompanyInfoType } from "@/types/types";
import axiosInstance from "../../../lib/axiosIntance";

const CompanyList = ({ searchTerm }: { searchTerm: string }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    setCurrentPage(page);
  }, [searchParams]);

  // fetchcompanies function
  const fetchCompanies = async (page: number, searchTerm: string) => {
    const query = searchTerm ? `&query=${searchTerm}` : "";

    try {
      const accessToken = localStorage.getItem("access-token");
      const refreshToken = localStorage.getItem("refresh-token");

      if (refreshToken) {
        const res: AxiosResponse<{ data: CompanyInfoType[]; count: number }> =
          await axiosInstance.get(`/company/list?page=${page}&size=10${query}`);
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
    queryKey: ["companies", currentPage, searchTerm],
    queryFn: () => fetchCompanies(currentPage, searchTerm),
  });

  const companies = data?.data || [];
  const totalPage = data ? Math.ceil(data.count / 10) : 1;

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
        <p>Error loading companies. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="relative sm:rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Company
            </th>
            <th scope="col" className="px-6 py-3">
              Phone
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Location
            </th>
            <th scope="col" className="px-6 py-3">
              Products
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company?._id} className="bg-white border-b">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {company?.name}
              </th>
              <td className="px-6 py-4">{company?.phone}</td>
              <td className="px-6 py-4">{company?.email}</td>
              <td className="px-6 py-4">
                {company?.addresses?.city}, {company?.addresses?.country}
              </td>
              <td className="px-6 py-4">{company?.productsCount}</td>
              <td className="px-6 py-4">
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Details
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-end my-10">
        <button
          onClick={() => {
            onPageChange(currentPage - 1);
            router.push(
              `/companies?page=${currentPage - 1}${
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
              href={`/companies?page=${page}${
                searchTerm && `&query=${searchTerm}`
              }`}
            >
              <button
                onClick={() => onPageChange(currentPage)}
                className={`mx-1 px-4 py-2 border ${
                  page === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                {page}
              </button>
            </Link>
          )
        )}
        <button
          onClick={() => {
            onPageChange(currentPage + 1);
            router.push(
              `/companies?page=${currentPage + 1}${
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
    </div>
  );
};

export default CompanyList;
