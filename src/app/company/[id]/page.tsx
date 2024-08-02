"use client";
import { CompanyInfoType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import axiosInstance from "../../../../lib/axiosInstance";
import Loader from "@/components/Loader";
import Button from "@/components/button/button";
import { PencilSimpleLine } from "@phosphor-icons/react";
import EditCompany from "@/app/companies/EditCompany";

const CompanyDetail = () => {
  const { id } = useParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  // Get date according to the currently editing item
  const {
    data: companyData,
    isFetching,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: ["editCompany"],
    queryFn: async () => {
      if (id) {
        try {
          const response: AxiosResponse<CompanyInfoType> = await axiosInstance(
            `/company/${id}`
          );

          return response.data;
        } catch (error) {
          console.error("Error fetching company info", error);
          throw new Error("Error fetching company info");
        }
      }
      return null;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

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

  return (
    <div className="relative">
      <div className="bg-slate-50 p-10">
        <h1 className="font-bold text-3xl">Company Profile</h1>
        <p className="text-slate-400 font-medium">
          Company Profile Information
        </p>
      </div>

      {isFetching && (
        <div className="flex items-center justify-center min-h-[65vh]">
          <Loader />
        </div>
      )}

      {companyData && isFetched && !isFetching && (
        <div className="my-5 px-10 space-y-16">
          {/* Company Details */}
          <div>
            <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center">
              <h2 className="font-bold text-2xl">
                {companyData?.name} Details
              </h2>
              <Button
                onClick={handleDrawerOpen}
                intent={"secondary"}
                className="flex gap-1 items-center"
              >
                <PencilSimpleLine />
                Edit Profile
              </Button>
            </div>

            <div className="p-5">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                <div className="space-y-2 md:space-y-5">
                  <div className="flex gap-6 text-lg font-medium text-slate-400">
                    <label className="flex justify-between items-center w-[165px]">
                      Company Name <span>:</span>
                    </label>
                    <p>{companyData?.name}</p>
                  </div>
                  <div className="flex gap-6 text-lg font-medium text-slate-400">
                    <label className="flex justify-between items-center w-[165px]">
                      Email Address <span>:</span>
                    </label>
                    <p>{companyData?.email}</p>
                  </div>
                </div>
                <div className="space-y-2 md:space-y-5">
                  <div className="flex gap-6 text-lg font-medium text-slate-400">
                    <label className="flex justify-between items-center w-[165px]">
                      Phone Number <span>:</span>
                    </label>
                    <p>{companyData?.phone}</p>
                  </div>
                  <div className="flex gap-6 text-lg font-medium text-slate-400">
                    <label className="flex justify-between items-center w-[165px]">
                      Address <span>:</span>
                    </label>
                    <p className="break-words">
                      {companyData?.address?.addressLine}
                      {/* {companyData?.address?.city},{" "}
                      {companyData?.address?.country}{" "}
                      {companyData?.address?.zipCode} */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Master Account Info */}
          <div>
            <h2 className="font-bold text-2xl">Company Master Account</h2>
            <div className="p-5">
              <div className="flex gap-6 text-lg font-medium text-slate-400">
                <label className="flex justify-between items-center w-[165px]">
                  Master Email <span>:</span>
                </label>
                <p>{companyData?.masterEmail}</p>
              </div>
            </div>
          </div>

          {/* Billing Details Info */}
          <div>
            <h2 className="font-bold text-2xl">Billing Details</h2>
            <div className="p-5">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="flex gap-6 text-lg font-medium text-slate-400">
                  <label className="flex justify-between items-center w-[165px]">
                    Billing Start Date <span>:</span>
                  </label>
                  <p>{formatDate(companyData?.billingInfo?.startDate)}</p>
                </div>
                <div className="flex gap-6 text-lg font-medium text-slate-400">
                  {companyData?.billingInfo?.endDate && (
                    <>
                      <label className="flex justify-between items-center w-[165px]">
                        Billing End Date <span>:</span>
                      </label>
                      <p>{formatDate(companyData?.billingInfo?.endDate)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Drawer */}
      {isDrawerOpen && (
        <EditCompany
          isOpen={isDrawerOpen}
          editItemId={id.toString()}
          onClose={handleDrawerClose}
        />
      )}
    </div>
  );
};

export default CompanyDetail;
