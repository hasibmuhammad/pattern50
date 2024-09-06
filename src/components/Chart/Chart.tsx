"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../../lib/axiosInstance";
import { AxiosResponse } from "axios";
import { DashboardStatistics } from "@/types/types";
import CustomTooltip from "./CustomTooltip";
import Loader from "../Loader";

const getMonthName = (monthNumber: number) => {
  const months = [
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
  return months[monthNumber - 1];
};

const Chart = () => {
  const [activeItem, setActiveItem] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("roleType") || "";
    setCurrentUserRole(role);
  }, []);

  console.log(currentUserRole);

  const { data: statisticsData, isFetching: statisticsFetching } = useQuery({
    queryKey: ["getStatistics"],
    queryFn: async () => {
      const res: AxiosResponse<DashboardStatistics[]> = await axiosInstance.get(
        "/dashboard/statistics?startDate=&endDate=&companyIds="
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const transformedData =
    currentUserRole === "Admin Role"
      ? statisticsData?.map((item) => ({
          ...item,
          Revenue: item.totalBillingRate,
          Cost: item.totalInternalRate,
          yearWithMonth: `${getMonthName(item.month)} ${item.year}`,
        }))
      : statisticsData?.map((item) => ({
          ...item,
          Spend: item.totalBillingRate,
          Saved: item.totalDiscount,
          yearWithMonth: `${getMonthName(item.month)} ${item.year}`,
        }));

  if (statisticsFetching)
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  return (
    <div className="w-full h-full max-w-7xl">
      {currentUserRole === "Admin Role" ? (
        <>
          <h2 className="font-semibold text-xl">Revenue</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              width={500}
              height={400}
              data={transformedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="2 2" vertical={false} />
              <XAxis
                tickLine={false}
                dataKey="yearWithMonth"
                fontSize={12}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) =>
                  value >= 1000 ? value / 1000 + "k" : value
                }
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={<CustomTooltip activeItem={activeItem} />}
                cursor={false}
              />
              <Legend
                fontSize={12}
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={10}
              />
              <Bar
                onMouseEnter={() => setActiveItem("firstBar")}
                onMouseLeave={() => setActiveItem("")}
                barSize={18}
                dataKey="Revenue"
                fill="#60a5fa"
                className="bg-blue-400"
              />
              <Bar
                onMouseEnter={() => setActiveItem("secondBar")}
                onMouseLeave={() => setActiveItem("")}
                barSize={18}
                dataKey="Cost"
                fill="#dbeafe"
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <>
          <h2 className="font-semibold text-xl">Spending</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              width={500}
              height={400}
              data={transformedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="2 2" vertical={false} />
              <XAxis
                tickLine={false}
                dataKey="yearWithMonth"
                fontSize={12}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) =>
                  value >= 1000 ? value / 1000 + "k" : value
                }
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={<CustomTooltip activeItem={activeItem} />}
                cursor={false}
              />
              <Legend
                fontSize={12}
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={10}
              />
              <Bar
                onMouseEnter={() => setActiveItem("firstBar")}
                onMouseLeave={() => setActiveItem("")}
                barSize={18}
                dataKey="Spend"
                fill="#60a5fa"
                className="bg-blue-400"
              />
              <Bar
                onMouseEnter={() => setActiveItem("secondBar")}
                onMouseLeave={() => setActiveItem("")}
                barSize={18}
                dataKey="Saved"
                fill="#dbeafe"
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default Chart;
