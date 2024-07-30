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
import { CompanyInfoType } from "@/types/types";
import { format, parseISO } from "date-fns";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  editItemId: string;
  onClose: () => void;
  onUpdate: () => void;
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
  ein: string;
  addressLine: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  masterEmail: string;
  startDate: string;
  endDate?: string;
};

const EditCompany = ({ isOpen, editItemId, onClose, onUpdate }: Props) => {
  const [startDate, setStartDate] = useState<any>("");
  const [endDate, setEndDate] = useState<any>("");
  const [zip, setZip] = useState("");
  const router = useRouter();

  // populate city, state, country based on zipcode
  const {
    data: zipInfo,
    error,
    isFetched: zipFetched,
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
  } = useForm<Company>();

  // Get date according to the currently editing item
  const {
    data: companyData,
    isFetching: editInfoFetching,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: ["editCompany", editItemId],
    queryFn: async () => {
      if (editItemId) {
        try {
          const response: AxiosResponse<CompanyInfoType> = await axiosInstance(
            `/company/${editItemId}`
          );

          return response.data;
        } catch (error) {
          console.error("Error fetching company info", error);
          throw new Error("Error fetching company info");
        }
      }
      return null;
    },
    enabled: !!editItemId,
  });

  useEffect(() => {
    if (companyData) {
      setValue("name", companyData.name);
      setValue("email", companyData.email);
      setValue("phone", companyData.phone);
      setValue("ein", companyData.ein);
      setValue("addressLine", companyData.address.addressLine);
      setValue("zipCode", companyData.address.zipCode);
      setZip(companyData.address.zipCode.toString());
      setValue("masterEmail", companyData.masterEmail);

      if (companyData?.billingInfo?.startDate) {
        setValue(
          "startDate",
          format(parseISO(companyData?.billingInfo?.startDate), "MMMM yyyy")
        );
        setStartDate(
          format(parseISO(companyData?.billingInfo?.startDate), "MMMM yyyy")
        );
      } else {
        setStartDate("");
      }

      if (companyData?.billingInfo?.endDate) {
        setValue(
          "endDate",
          format(parseISO(companyData?.billingInfo?.endDate), "MMMM yyyy")
        );
        setEndDate(
          format(parseISO(companyData?.billingInfo?.endDate), "MMMM yyyy")
        );
      } else {
        setEndDate("");
      }
    }
  }, [companyData, setValue, editItemId]);

  useEffect(() => {
    if (zipInfo) {
      setValue("city", zipInfo.city);
      setValue("state", zipInfo.state);
      setValue("country", zipInfo.country);
    }
  }, [zipInfo, setValue]);

  const updateCompany = useMutation({
    mutationKey: ["updateCompany", editItemId],
    mutationFn: async (data: Company) => {
      const response = await axiosInstance.put(`/company/${editItemId}`, {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: data.endDate
          ? new Date(data.endDate).toISOString()
          : undefined,
      });

      return response.data;
    },
  });

  const onSubmit = (data: Company) => {
    updateCompany.mutate(data, {
      onSuccess: (data) => {
        onClose();
        refetch();
        onUpdate();
      },
      onError: (error) => {
        console.error("Error while updating company", error);
      },
    });
  };

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
              <h1 className="text-2xl font-bold">Edit Company</h1>
              <p className="text-slate-400">
                Update and customize company profile information
              </p>
            </div>
            <X onClick={onClose} size={28} className="cursor-pointer" />
          </div>
          <div className="bg-white">
            {editInfoFetching && !isFetched && (
              <div className="px-10 w-full flex items-center justify-center min-h-screen bg-white">
                <Loader />
              </div>
            )}

            {isFetched && (
              <>
                <h2 className="px-10 pt-10 text-xl font-bold">
                  Company Information
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                  <div className="px-10">
                    <div className="space-y-8">
                      <div
                        className={`flex gap-4 items-center justify-between`}
                      >
                        <label className="w-[200px] text-nowrap">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full">
                          <input
                            {...register("name", {
                              required: "Company name is required!",
                            })}
                            className={`w-full border ${
                              errors && errors.name && "border-red-500"
                            } outline-none rounded-md px-3 py-2`}
                            type="text"
                            placeholder="Company Name"
                          />
                          {errors && errors?.name?.type === "required" && (
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
                            {...register("email", {
                              required: "Email address is required!",
                            })}
                            className={`w-full border ${
                              errors && errors.email && "border-red-500"
                            } outline-none rounded-md px-3 py-2`}
                            type="email"
                            placeholder="Email address"
                          />
                          {errors && errors?.email?.type === "required" && (
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
                            {...register("phone", {
                              required: "Phone number is required!",
                              minLength: 11,
                            })}
                            onChange={(phone) => setValue("phone", phone)}
                            country={"us"}
                            placeholder={"000 000 0000"}
                            inputProps={{
                              className: `w-full border ${
                                errors && errors.phone && "border-red-500"
                              } rounded-md outline-none px-3 py-2 pl-14`,
                            }}
                            value={companyData?.phone}
                          />

                          {errors && errors?.phone?.type === "required" && (
                            <p className="flex items-center gap-1 text-red-600">
                              <Warning /> {errors.phone.message}
                            </p>
                          )}
                          {errors && errors?.phone?.type === "minLength" && (
                            <p className="flex items-center gap-1 text-red-600">
                              <Warning /> Number Must be 11 digits!
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
                            {...register("ein", {
                              required: "EIN is required!",
                              minLength: 9,
                            })}
                            className="w-full border outline-none rounded-md px-3 py-2"
                            type="text"
                            placeholder="EIN"
                          />
                          {errors && errors?.ein?.type === "required" && (
                            <p className="flex items-center gap-1 text-red-600">
                              <Warning /> {errors.ein.message}
                            </p>
                          )}
                          {errors && errors?.ein?.type === "minLength" && (
                            <p className="flex items-center gap-1 text-red-600">
                              <Warning /> EIN must be 9 digits.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <label
                          className={`${
                            zipInfo ? "w-[200px]" : "w-[180px]"
                          } text-nowrap`}
                        >
                          Address <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          <input
                            {...register("addressLine", {
                              required: "Address is required!",
                            })}
                            className={`w-full border ${
                              errors && errors.addressLine && "border-red-500"
                            } outline-none rounded-md px-3 py-2`}
                            type="text"
                            placeholder="Address line"
                          />
                          <div className="space-y-2 w-full">
                            <div className="flex gap-2">
                              <input
                                {...register("zipCode", {
                                  required: "Zipcode is required!",
                                  minLength: 5,
                                })}
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
                                {...register("city", {
                                  required: "City is required!",
                                })}
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
                                {...register("state", {
                                  required: "State is required!",
                                })}
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
                                {...register("country", {
                                  required: "Country is required!",
                                })}
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

                            {errors &&
                              errors?.addressLine?.type === "required" && (
                                <p className="flex items-center gap-1 text-red-600">
                                  <Warning /> {errors.addressLine.message}
                                </p>
                              )}
                            {errors &&
                              !errors?.addressLine &&
                              errors?.zipCode?.type === "required" &&
                              !zipInfo && (
                                <p className="flex items-center gap-1 text-red-600">
                                  <Warning /> {errors.zipCode.message}
                                </p>
                              )}
                            {errors &&
                              !errors?.addressLine &&
                              errors?.zipCode?.type === "minLength" && (
                                <p className="flex items-center gap-1 text-red-600">
                                  <Warning /> Zipcode must be 5 digits.
                                </p>
                              )}
                            {errors &&
                              !errors?.zipCode &&
                              errors?.city?.type === "required" && (
                                <p className="flex items-center gap-1 text-red-600">
                                  <Warning /> {errors.city.message}
                                </p>
                              )}
                            {errors &&
                              !errors?.city &&
                              errors?.state?.type === "required" && (
                                <p className="flex items-center gap-1 text-red-600">
                                  <Warning /> {errors.state.message}
                                </p>
                              )}
                            {errors &&
                              !errors?.country &&
                              errors?.country?.type === "required" && (
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
                            Email Address{" "}
                            <span className="text-red-500">*</span>
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
                            {errors &&
                              errors?.masterEmail?.type === "required" && (
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
                              rules={{
                                required: "Billing Start month is required!",
                              }}
                              render={({
                                field: { onChange, onBlur, value, ref },
                              }) => (
                                <DatePicker
                                  className={`w-full border ${
                                    errors &&
                                    errors.startDate &&
                                    "border-red-500"
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
                            {errors &&
                              errors?.startDate?.type === "required" && (
                                <p className="flex items-center gap-1 text-red-600">
                                  <Warning /> {errors.startDate.message}
                                </p>
                              )}
                          </div>
                        </div>
                        <div className="flex gap-4 items-center justify-between">
                          <label className="w-[200px] text-nowrap">
                            End Month
                          </label>
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

                  <div className="mt-20 py-5 pr-10 bg-slate-50 flex gap-5 justify-end">
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
                      {updateCompany.isPending
                        ? "Loading..."
                        : updateCompany.isSuccess
                        ? "Updated"
                        : "Update"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCompany;