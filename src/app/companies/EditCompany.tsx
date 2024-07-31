"use client";
import { Warning, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import "react-phone-input-2/lib/bootstrap.css";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axiosInstance";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { CompanyInfoType } from "@/types/types";
import { format, parseISO } from "date-fns";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputDate from "@/components/InputDate";
import FieldError from "@/components/FieldError";
import Input from "@/components/Input";
import InputSelect from "@/components/InputSelect";
import InputPhone from "@/components/InputPhone";

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

const EditCompany = ({ isOpen, editItemId, onClose, onUpdate }: Props) => {
  const [startDate, setStartDate] = useState<any>("");
  const [endDate, setEndDate] = useState<any>("");
  const [zip, setZip] = useState("");
  const [endDateError, setEndDateError] = useState("");
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
  } = useForm<Company>({ resolver: zodResolver(CompanySchema) });

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
    refetchOnWindowFocus: false,
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
      onError: (error: any) => {
        if (
          error.response.data.errorCode ===
          "endDate_must_be_greater_than_StartDate"
        ) {
          setEndDateError(
            "End date must be greater than or equal to Start date!"
          );
        }
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
                          <Input
                            register={register}
                            errors={errors}
                            name={"name"}
                            placeholder="Company Name"
                            type="text"
                          />
                          <FieldError errors={errors} name="name" />
                        </div>
                      </div>
                      <div className="flex gap-4 items-center justify-between">
                        <label className="w-[200px] text-nowrap">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full">
                          <Input
                            register={register}
                            errors={errors}
                            name="email"
                            placeholder="Email Address"
                            type="email"
                          />
                          <FieldError errors={errors} name="email" />
                        </div>
                      </div>
                      <div className="flex gap-4 items-center justify-between">
                        <label className="w-[200px] text-nowrap">
                          Phone Number <span className="text-red-500">*</span>
                        </label>

                        <div className="w-full">
                          <InputPhone
                            register={register}
                            errors={errors}
                            name="phone"
                            placeholder="000 000 0000"
                            setValue={setValue}
                            value={companyData?.phone ? companyData?.phone : ""}
                          />
                          <FieldError errors={errors} name="phone" />
                        </div>
                      </div>
                      <div className="flex gap-4 items-center justify-between">
                        <label className="w-[200px] text-nowrap">
                          EIN <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full">
                          <Input
                            register={register}
                            errors={errors}
                            name="ein"
                            placeholder="EIN"
                            type="text"
                          />
                          <FieldError errors={errors} name="ein" />
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
                          <Input
                            register={register}
                            errors={errors}
                            name="addressLine"
                            placeholder="Address line"
                            type="text"
                          />
                          <div className="space-y-2 w-full">
                            <div className="flex gap-2">
                              <Input
                                register={register}
                                errors={errors}
                                name="zipCode"
                                placeholder="Zip code"
                                type="text"
                                onChange={(e) => setZip(e.target.value)}
                              />

                              <InputSelect
                                register={register}
                                control={control}
                                errors={errors}
                                name="city"
                                placeholder="City"
                                zipInfo={zipInfo}
                              />
                            </div>
                            <div className="flex gap-2">
                              <InputSelect
                                register={register}
                                control={control}
                                errors={errors}
                                name="state"
                                placeholder="State"
                                zipInfo={zipInfo}
                              />

                              <InputSelect
                                register={register}
                                control={control}
                                errors={errors}
                                name="country"
                                placeholder="Country"
                                zipInfo={zipInfo}
                              />
                            </div>
                            <FieldError errors={errors} name="addressLine" />

                            {errors &&
                              errors.zipCode &&
                              !errors.addressLine && (
                                <FieldError errors={errors} name="zipCode" />
                              )}

                            {errors && !errors?.zipCode && errors?.city && (
                              <FieldError errors={errors} name="city" />
                            )}
                            {errors && !errors?.city && errors?.state && (
                              <FieldError errors={errors} name="state" />
                            )}
                            {errors && !errors?.country && errors?.country && (
                              <FieldError errors={errors} name="country" />
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
                            <Input
                              register={register}
                              errors={errors}
                              name="masterEmail"
                              placeholder="Email Address"
                              type="email"
                            />
                            <FieldError errors={errors} name="masterEmail" />
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
                            <InputDate
                              control={control}
                              errors={errors}
                              name="startDate"
                              placeholder="Pick a month"
                            />
                            <FieldError errors={errors} name="startDate" />
                          </div>
                        </div>
                        <div className="flex gap-4 items-center justify-between">
                          <label className="w-[200px] text-nowrap">
                            End Month
                          </label>
                          <div className="w-full">
                            <InputDate
                              control={control}
                              errors={errors}
                              name="endDate"
                              placeholder="Pick a month"
                            />

                            {endDateError && (
                              <p className="flex gap-1 text-red-600">
                                <Warning size={28} /> {endDateError}
                              </p>
                            )}
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
