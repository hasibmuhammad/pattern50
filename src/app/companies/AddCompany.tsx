"use client";
import { X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import "react-phone-input-2/lib/bootstrap.css";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axiosInstance";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/Input";
import InputPhone from "@/components/InputPhone";
import FieldError from "@/components/FieldError";
import InputSelect from "@/components/InputSelect";
import InputDate from "@/components/InputDate";

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
    console.log(data);
    createCompany.mutate(data, {
      onSuccess: (data) => {
        onClose();
      },
      onError: (error) => {
        console.error("Error while creating company", error);
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
                        zipInfo ? "w-[220px]" : "w-[180px]"
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

                        {errors && errors.zipCode && !errors.addressLine && (
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
                        Email Address <span className="text-red-500">*</span>
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
                      <label className="w-[200px] text-nowrap">End Month</label>
                      <div className="w-full">
                        <InputDate
                          control={control}
                          errors={errors}
                          name="endDate"
                          placeholder="Pick a month"
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
