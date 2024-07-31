"use client";
import { CalendarBlank, Warning, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axiosInstance";
import { AxiosResponse } from "axios";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type ZipInfo = {
  city: string;
  state: string;
  country: string;
};

type Company = {
  name: string;
  email: string;
  phone: string;
  ein: number;
  addressLine: string;
  zipCode: number;
  city: string;
  state: string;
  country: string;
  masterEmail: string;
  startDate: string;
  endDate: string;
};

const CompanySchema = z.object({
  name: z.string().min(1, { message: "Company Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Invalid email address" }),
  phone: z.string({ message: "Phone number is required!" }).min(11, {
    message: "Phone number should be 11 digits",
  }),
  ein: z
    .string()
    .min(1, { message: "EIN is required!" })
    .length(9, { message: "EIN must be 9 digits" }),
  addressLine: z.string().min(1, { message: "Address is required" }),
  zipCode: z
    .string()
    .min(1, { message: "Zipcode is required!" })
    .length(5, { message: "Zipcode must be 5 digits" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  masterEmail: z
    .string()
    .min(1, { message: "Master email is required!" })
    .email({ message: "Invalid master email address" }),
  startDate: z.string({ required_error: "Billing start month is required!" }),
  endDate: z.string().optional(),
});

type CompanySchema = z.infer<typeof CompanySchema>;

const AddCompany = ({ isOpen, onClose }: Props) => {
  const [startDate, setStartDate] = useState<any>("");
  const [endDate, setEndDate] = useState<any>("");
  const [zip, setZip] = useState("");

  const {
    data: zipInfo,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["fetchZipInfo", zip],
    queryFn: async () => {
      if (zip && zip.length === 5) {
        try {
          const response: AxiosResponse<ZipInfo> = await axiosInstance.get(
            `/geo/zip/${zip}`
          );
          return response.data;
        } catch (error) {
          console.error("Error fetching zip info:", error);
          throw new Error("Error fetching zip info");
        }
      }
      return null;
    },
    enabled: zip.length === 5,
    refetchOnWindowFocus: false,
  });

  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Company>({ resolver: zodResolver(CompanySchema) });

  useEffect(() => {
    if (zipInfo) {
      setValue("city", zipInfo.city);
      setValue("state", zipInfo.state);
      setValue("country", zipInfo.country);
    }
  }, [zipInfo, setValue]);

  const createCompany = useMutation({
    mutationKey: ["createCompany"],
    mutationFn: async (data: Company) => {
      const response = await axiosInstance.post("/company", {
        ...data,
        phone: `+${data.phone}`,
      });

      return response.data;
    },
  });

  const onSubmit = (data: Company) => {
    createCompany.mutate(data, {
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.error("Error while creating company", error);
      },
    });
  };

  console.log(errors);

  return (
    <div
      className={`fixed inset-0 z-50 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="fixed right-0 top-0 bottom-0 max-w-lg rounded-lg overflow-hidden shadow-xl overflow-y-auto">
        <div>
          <div className="bg-slate-50 p-5 flex justify-between">
            <div>
              <h1 className="text-2xl font-bold">Add Company</h1>
              <p className="text-slate-400">
                Get started by filling in the information to add new company
              </p>
            </div>
            <X onClick={onClose} size={28} className="cursor-pointer" />
          </div>
          <div className="bg-white">
            <h2 className="px-10 pt-10 text-xl font-bold">
              Company Information
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <div className="px-10">
                <div className="space-y-8">
                  <div className={`flex gap-4 items-center justify-between`}>
                    <label className="w-[200px] text-nowrap">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full">
                      <input
                        {...register("name")}
                        className={`w-full border ${
                          errors && errors.name && "border-red-500"
                        } outline-none rounded-md px-3 py-2`}
                        type="text"
                        placeholder="Company Name"
                      />
                      {errors && errors?.name && (
                        <p className="flex items-center gap-1 text-red-600">
                          <Warning /> {errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 items-center justify-between">
                    <label className="w-[200px] text-nowrap">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full">
                      <input
                        {...register("email")}
                        className={`w-full border ${
                          errors && errors.email && "border-red-500"
                        } outline-none rounded-md px-3 py-2`}
                        type="email"
                        placeholder="Email address"
                      />
                      {errors && errors?.email && (
                        <p className="flex items-center gap-1 text-red-600">
                          <Warning /> {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 items-center justify-between">
                    <label className="w-[200px] text-nowrap">
                      Phone Number <span className="text-red-500">*</span>
                    </label>

                    <div className="w-full">
                      <PhoneInput
                        {...register("phone")}
                        onChange={(phone) => setValue("phone", phone)}
                        country={"us"}
                        placeholder={"000 000 0000"}
                        inputProps={{
                          className: `w-full border ${
                            errors && errors.phone && "border-red-500"
                          } rounded-md outline-none px-3 py-2 pl-14`,
                        }}
                      />

                      {errors && errors?.phone && (
                        <p className="flex items-center gap-1 text-red-600">
                          <Warning /> {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 items-center justify-between">
                    <label className="w-[200px] text-nowrap">
                      EIN <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full">
                      <input
                        {...register("ein")}
                        className={`w-full border ${
                          errors && errors.ein && "border-red-500"
                        } outline-none rounded-md px-3 py-2`}
                        type="text"
                        placeholder="EIN"
                      />
                      {errors && errors?.ein && (
                        <p className="flex items-center gap-1 text-red-600">
                          <Warning /> {errors.ein.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <label
                      className={`${
                        zipInfo ? "w-[220px]" : "w-[180px]"
                      } text-nowrap`}
                    >
                      Address <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <input
                        {...register("addressLine")}
                        className={`w-full border ${
                          errors && errors.addressLine && "border-red-500"
                        } outline-none rounded-md px-3 py-2`}
                        type="text"
                        placeholder="Address line"
                      />
                      <div className="space-y-2 w-full">
                        <div className="flex gap-2">
                          <input
                            {...register("zipCode")}
                            className={`w-1/2 border ${
                              errors &&
                              errors.zipCode &&
                              !zipInfo &&
                              "border-red-500"
                            } outline-none rounded-md px-3 py-2`}
                            type="text"
                            placeholder="Zip code"
                            onChange={(e) => setZip(e.target.value)}
                          />

                          <Controller
                            {...register("city")}
                            control={control}
                            render={() => (
                              <Select
                                className={`w-1/2 ${
                                  errors &&
                                  errors.city &&
                                  !zipInfo &&
                                  "border rounded-md overflow-hidden border-red-500"
                                }`}
                                placeholder="City"
                                options={
                                  zipInfo
                                    ? [
                                        {
                                          value: zipInfo.city,
                                          label: zipInfo.city,
                                        },
                                      ]
                                    : []
                                }
                                value={
                                  zipInfo
                                    ? {
                                        value: zipInfo.city,
                                        label: zipInfo.city,
                                      }
                                    : null
                                }
                              />
                            )}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Controller
                            {...register("state")}
                            control={control}
                            render={() => (
                              <Select
                                className={`w-1/2 ${
                                  errors &&
                                  errors.state &&
                                  !zipInfo &&
                                  "border rounded-md overflow-hidden border-red-500"
                                }`}
                                placeholder="State"
                                options={
                                  zipInfo
                                    ? [
                                        {
                                          value: zipInfo.state,
                                          label: zipInfo.state,
                                        },
                                      ]
                                    : []
                                }
                                value={
                                  zipInfo
                                    ? {
                                        value: zipInfo.state,
                                        label: zipInfo.state,
                                      }
                                    : null
                                }
                              />
                            )}
                          />

                          <Controller
                            {...register("country")}
                            control={control}
                            render={() => (
                              <Select
                                className={`w-1/2 ${
                                  errors &&
                                  errors.country &&
                                  !zipInfo &&
                                  "border rounded-md overflow-hidden border-red-500"
                                }`}
                                placeholder="Country"
                                options={
                                  zipInfo
                                    ? [
                                        {
                                          value: zipInfo.country,
                                          label: zipInfo.country,
                                        },
                                      ]
                                    : []
                                }
                                value={
                                  zipInfo
                                    ? {
                                        value: zipInfo.country,
                                        label: zipInfo.country,
                                      }
                                    : null
                                }
                              />
                            )}
                          />
                        </div>

                        {errors && errors?.addressLine && (
                          <p className="flex items-center gap-1 text-red-600">
                            <Warning /> {errors.addressLine.message}
                          </p>
                        )}
                        {errors &&
                          !errors?.addressLine &&
                          errors?.zipCode &&
                          !zipInfo && (
                            <p className="flex items-center gap-1 text-red-600">
                              <Warning /> {errors.zipCode.message}
                            </p>
                          )}
                        {errors && !errors?.zipCode && errors?.city && (
                          <p className="flex items-center gap-1 text-red-600">
                            <Warning /> {errors.city.message}
                          </p>
                        )}
                        {errors && !errors?.city && errors?.state && (
                          <p className="flex items-center gap-1 text-red-600">
                            <Warning /> {errors.state.message}
                          </p>
                        )}
                        {errors && !errors?.country && errors?.country && (
                          <p className="flex items-center gap-1 text-red-600">
                            <Warning /> {errors.country.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <h2 className="text-xl font-bold">Master Account</h2>
                  <div className="mt-5">
                    <div className="flex gap-4 items-center justify-between">
                      <label className="w-[200px] text-nowrap">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full">
                        <input
                          {...register("masterEmail", {
                            required: "Master email is required!",
                          })}
                          className={`w-full border ${
                            errors && errors.masterEmail && "border-red-500"
                          } outline-none rounded-md px-3 py-2`}
                          type="email"
                          placeholder="Email address"
                        />
                        {errors && errors?.masterEmail && (
                          <p className="flex items-center gap-1 text-red-600">
                            <Warning /> {errors.masterEmail.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-10">
                  <h2 className="text-xl font-bold">Billing Information</h2>
                  <div className="mt-5 space-y-8">
                    <div className="flex gap-4 items-center justify-between">
                      <label className="w-[200px] text-nowrap">
                        Start Month <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full">
                        <Controller
                          name="startDate"
                          control={control}
                          render={({
                            field: { onChange, onBlur, value, ref },
                          }) => (
                            <DatePicker
                              className={`w-full border ${
                                errors && errors.startDate && "border-red-500"
                              } outline-none rounded-md px-3 py-2`}
                              placeholderText="Pick a month"
                              showIcon
                              icon={
                                <CalendarBlank className="text-slate-500" />
                              }
                              dateFormat="MMMM yyyy"
                              showMonthYearPicker
                              onChange={(date) => {
                                onChange(date?.toISOString());
                                setStartDate(date?.toISOString());
                              }}
                              selected={value ? new Date(value) : null}
                              onBlur={onBlur}
                              ref={ref}
                            />
                          )}
                        />
                        {errors && errors?.startDate && (
                          <p className="flex items-center gap-1 text-red-600">
                            <Warning /> {errors.startDate.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4 items-center justify-between">
                      <label className="w-[200px] text-nowrap">End Month</label>
                      <div className="w-full">
                        <Controller
                          name="endDate"
                          control={control}
                          render={({
                            field: { onChange, onBlur, value, ref },
                          }) => (
                            <DatePicker
                              className="w-full border outline-none rounded-md px-3 py-2"
                              placeholderText="Pick a month"
                              showIcon
                              icon={
                                <CalendarBlank className="text-slate-500" />
                              }
                              dateFormat="MMMM yyyy"
                              showMonthYearPicker
                              onChange={(date) => {
                                onChange(date?.toISOString());
                                setEndDate(date?.toISOString());
                              }}
                              selected={value ? new Date(value) : null}
                              onBlur={onBlur}
                              ref={ref}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-5 pr-10 bg-slate-50 flex gap-5 justify-end">
                <button
                  onClick={onClose}
                  type="button"
                  className="bg-white border-2 rounded-md font-semibold px-3 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 rounded-md font-semibold px-3 py-2 text-white"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCompany;
