"use client";
import React, { useState } from "react";
import { Info, List, PlusCircle } from "@phosphor-icons/react";
import Sidebar from "@/components/Sidebar";
import Input from "@/components/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import FieldError from "@/components/FieldError";
import Button from "@/components/button/button";
import InputSelect from "@/components/InputSelect";
import { cn } from "../../../../../../utils/cn";
import InputFile from "@/components/InputFile";

const CreateResource = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleSidebarVisibility = () => setIsSidebarOpen(!isSidebarOpen);

  const [useLink, setUseLink] = useState(false);

  // Define the Zod schema for validation
  const schema = z.object({
    name: z.string().min(1, "Resource Name is required"),
    category: z.string().min(1, "Category is required"),
    type: z.string().min(1, "Resource Type is required"),
    tool: z.string().min(1, "Tool is required"),
    purpose: z.string().max(250, "Tool Purpose must be under 250 characters"),
    instruction: z
      .string()
      .max(250, "Instruction must be under 250 characters"),
    useLink: z.boolean(),
    links: z.array(z.object({ link: z.string().url("Invalid URL") })),
  });

  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      purpose: "",
      instruction: "",

      links: [{ link: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  const handleAddMore = () => {
    append({ link: "" });
  };

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle form submission (e.g., send to backend)
  };

  return (
    <div className=" relative w-full">
      <div className="p-5 visible lg:invisible py-5 lg:py-0">
        <List
          onClick={handleSidebarVisibility}
          className="cursor-pointer"
          size={32}
        />
      </div>

      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        handleSidebarVisibility={handleSidebarVisibility}
      />

      {/* Start the create resource */}
      <div className="p-5 space-y-1">
        <h4 className="font-bold text-blue-500">Add Resources</h4>
        <h1 className="text-3xl font-bold">Add Resources</h1>
      </div>

      {/* Resource Form */}
      <div>
        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="max-w-lg mx-auto mb-32">
            <div className="">
              <div className="space-y-8">
                <div className="flex gap-4 items-center justify-between">
                  <label className="text-right w-[200px] text-nowrap">
                    Resource Name <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full">
                    <Input
                      register={register}
                      errors={errors}
                      name={"name"}
                      placeholder="Resource Name"
                      type="text"
                    />
                    <FieldError errors={errors} name="name" />
                  </div>
                </div>
                <div className="flex gap-4 items-center justify-between">
                  <label className="text-right w-[200px] text-nowrap">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full">
                    <InputSelect
                      className="w-full"
                      control={control}
                      register={register}
                      errors={errors}
                      name={"category"}
                      placeholder="Select"
                    />
                    <FieldError errors={errors} name="category" />
                  </div>
                </div>
                <div className="flex gap-4 items-center justify-between">
                  <label className="text-right w-[200px] text-nowrap">
                    Resource Type <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full">
                    <InputSelect
                      className="w-full"
                      control={control}
                      register={register}
                      errors={errors}
                      name={"type"}
                      placeholder="Select"
                    />
                    <FieldError errors={errors} name="type" />
                  </div>
                </div>
                <div className="flex gap-4 items-center justify-between">
                  <label className="text-right w-[200px] text-nowrap">
                    Tool <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full">
                    <InputSelect
                      className="w-full"
                      control={control}
                      register={register}
                      errors={errors}
                      name={"tool"}
                      placeholder="Select"
                    />
                    <FieldError errors={errors} name="tool" />
                  </div>
                </div>

                <div className="flex gap-4 justify-between">
                  <label className="text-right w-[200px] text-nowrap">
                    <span className="flex justify-between items-center">
                      Tool Purpose <span className="text-red-500">*</span>{" "}
                      <Info />
                    </span>
                  </label>
                  <div className="w-full">
                    <textarea
                      {...register("purpose")}
                      placeholder="Tool Purpose"
                      className="w-full border rounded-md outline-none px-2 py-1"
                      rows={5}
                    ></textarea>
                    <p className="text-slate-400 text-xs">
                      Keep tool purpose under 250 characters.
                    </p>
                    <FieldError errors={errors} name="purpose" />
                  </div>
                </div>
                <div className="flex gap-4 justify-between">
                  <label className="text-right w-[200px] text-nowrap">
                    <span className="flex justify-end gap-2 items-center">
                      Instruction <Info />
                    </span>
                  </label>
                  <div className="w-full">
                    <textarea
                      {...register("instruction")}
                      placeholder="Instruction"
                      className="w-full border rounded-md outline-none px-2 py-1"
                      rows={5}
                    ></textarea>
                    <p className="text-slate-400 text-xs">
                      Keep instruction under 250 characters.
                    </p>
                    <FieldError errors={errors} name="instruction" />
                  </div>
                </div>

                <div className="flex gap-4 justify-between">
                  <label className="text-right w-[200px] text-nowrap">
                    Upload Files
                  </label>
                  <div className="w-full">
                    <InputFile
                      errors={errors}
                      name="files"
                      register={register}
                      type="file"
                      placeholder="Select"
                      className={cn(
                        "disabled:text-slate-400 disabled:cursor-not-allowed file:disabled:cursor-not-allowed file:border-none file:bg-white bg-white text-sm outline-none rounded-md px-3 w-full py-2 border"
                      )}
                      disabled={useLink}
                    />
                    <p className="text-slate-400 text-xs">
                      All suported files can be uploaded within 10MB.
                    </p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <input
                    type="checkbox"
                    className="w-4 border border-blue-400"
                    id="link"
                    onChange={(e) => setUseLink(e.target.checked)}
                  />
                  <label htmlFor="link" className="w-[200px] text-nowrap">
                    Use link to share files
                  </label>
                </div>

                {useLink && (
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex gap-4 items-center justify-between"
                      >
                        <label className="text-right w-[200px] text-nowrap">
                          Share Link
                        </label>
                        <div className="w-full">
                          <div className="flex relative">
                            <span className="inline-flex items-center absolute h-full px-2 border-r-2 text-slate-400">
                              https://
                            </span>
                            <Input
                              register={register}
                              errors={errors}
                              name={`links.${index}.link`}
                              placeholder="www.figma.com"
                              type="text"
                              className={cn("pl-20")}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {useLink && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={handleAddMore}
                      state="inactive"
                      className="mx-5 flex justify-center flex-grow-0 items-center gap-1 w-40"
                    >
                      <PlusCircle weight="bold" />
                      Add More
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 w-full mt-10 py-7 pr-10 bg-slate-100 flex gap-5 justify-end">
            <div className="max-w-lg mx-auto flex gap-4 justify-end items-center w-full">
              <Button intent={"secondary"} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid}>
                Add Resource
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResource;
