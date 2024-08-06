"use client";
import { PlusCircle, X } from "@phosphor-icons/react";
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
import Button from "@/components/button/button";
import { cn } from "../../../utils/cn";
import InputSelectType from "@/components/InputSelectType";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

// type ZipInfo = {
//   city: string;
//   state: string;
//   country: string;
// };

// type Company = {
//   name: string;
//   email: string;
//   phone: string;
//   ein: number;
//   addressLine: string;
//   zipCode: number;
//   city: string;
//   state: string;
//   country: string;
//   masterEmail: string;
//   startDate: string;
//   endDate: string;
// };

// const CompanySchema = z.object({
//   name: z.string().min(1, { message: "Company Name is required" }),
//   email: z
//     .string()
//     .min(1, { message: "Email is required!" })
//     .email({ message: "Invalid email address" }),
//   phone: z.string({ message: "Phone number is required!" }).min(11, {
//     message: "Phone number should be 11 digits",
//   }),
//   ein: z
//     .string()
//     .min(1, { message: "EIN is required!" })
//     .length(9, { message: "EIN must be 9 digits" }),
//   addressLine: z.string().min(1, { message: "Address is required" }),
//   zipCode: z
//     .string()
//     .min(1, { message: "Zipcode is required!" })
//     .length(5, { message: "Zipcode must be 5 digits" }),
//   city: z.string().min(1, { message: "City is required" }),
//   state: z.string().min(1, { message: "State is required" }),
//   country: z.string().min(1, { message: "Country is required" }),
//   masterEmail: z
//     .string()
//     .min(1, { message: "Master email is required!" })
//     .email({ message: "Invalid master email address" }),
//   startDate: z.string({ required_error: "Billing start month is required!" }),
//   endDate: z.string().optional(),
// });

// type CompanySchema = z.infer<typeof CompanySchema>;

const AddTool = ({ isOpen, onClose }: Props) => {
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out translate-x-full",
        {
          "translate-x-0": isOpen,
        }
      )}
    >
      <div className="fixed right-0 top-0 bottom-0 max-w-lg rounded-lg overflow-hidden shadow-xl overflow-y-auto">
        <div className="flex flex-col min-h-screen bg-white">
          <div className="bg-slate-50 p-5 flex justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Add Infrastructure Technology
              </h1>
              <p className="text-slate-400">
                Get started by filling in the information to add new
                infrastructure technology
              </p>
            </div>
            <X onClick={onClose} size={28} className="cursor-pointer" />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <form className="flex-1 mt-4 flex flex-col justify-between">
              {/* this div should be duplicate while clicking on the add more button */}
              <div className="bg-slate-50 px-10 mx-5 py-5 my-2 rounded-lg">
                <div className="space-y-8">
                  <div className="flex gap-4 items-center justify-between">
                    <label className="w-[200px] text-nowrap">
                      Tool Name <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full">
                      <Input
                        register={register}
                        errors={errors}
                        name={"name"}
                        placeholder="Tool Name"
                        type="text"
                      />
                      <FieldError errors={errors} name="name" />
                    </div>
                  </div>
                  <div className="flex gap-4 items-center justify-between">
                    <label className="w-[200px] text-nowrap">
                      Tool Type <span className="text-red-500">*</span>
                    </label>

                    <div className="w-full">
                      <InputSelectType
                        control={control}
                        name="type"
                        placeholder="Select"
                        register={register}
                        errors={errors}
                        className="w-full"
                      />
                      <FieldError errors={errors} name="website" />
                    </div>
                  </div>
                  <div className="flex gap-4 items-center justify-between">
                    <label className="w-[200px] text-nowrap">
                      Website Link
                    </label>
                    <div className="w-full">
                      <Input
                        register={register}
                        errors={errors}
                        name="website"
                        placeholder="www.figma.com"
                        type="text"
                      />
                      <FieldError errors={errors} name="website" />
                    </div>
                  </div>
                  <div className="flex gap-4 justify-between">
                    <label className="w-[200px] text-nowrap">
                      Add Logo <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full">
                      <Input
                        register={register}
                        errors={errors}
                        name="logo"
                        type="file"
                        className="file:border-none file:bg-white bg-white text-sm"
                      />
                      <p
                        className={cn(
                          "flex items-center gap-1 text-sm text-slate-400 py-1"
                        )}
                      >
                        Files must be in PNG format,≤ 2MB, 200x200 pixels
                      </p>

                      <FieldError errors={errors} name="logo" />
                    </div>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                state="inactive"
                className="mx-5 flex justify-center flex-grow-0 items-center gap-1 w-40"
              >
                <PlusCircle weight="bold" />
                Add More
              </Button>
              <div className="py-5 pr-10 bg-slate-50 flex gap-5 justify-end mt-auto">
                <Button intent={"secondary"} onClick={onClose}>
                  Cancel
                </Button>
                <Button>Create</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTool;
