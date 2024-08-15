"use client";
import React, { useEffect, useState } from "react";
import { Info, List, PlusCircle } from "@phosphor-icons/react";
import Sidebar from "@/components/Sidebar";
import Input from "@/components/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import FieldError from "@/components/FieldError";
import Button from "@/components/button/button";
import { cn } from "../../../../../../utils/cn";
import InputFile from "@/components/InputFile";
import FieldLinkError from "@/components/FieldLinkError";
import InputSelect2 from "@/components/InputSelect2";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../../../lib/axiosInstance";
import { AxiosResponse } from "axios";
import {
  Categories,
  TechnologiesByCategory,
  TechnologyCategoryType,
} from "@/types/types";
import { useParams, useRouter } from "next/navigation";

// Define the Zod schema for validation
const ResourceSchema = z.object({
  name: z.string().min(1, "Resource Name is required!"),
  category: z.object(
    { label: z.string(), value: z.string() },
    { message: "Category is required" }
  ),
  type: z.object(
    { label: z.string(), value: z.string() },
    { message: "Resource Type is required" }
  ),
  tool: z.object(
    { label: z.string(), value: z.string() },
    { message: "Resource tool is required" }
  ),
  purpose: z
    .string()
    .min(1, "Tool Purpose is required")
    .max(250, "Tool Purpose must be under 250 characters"),
  instruction: z.string().max(250, "Instruction must be under 250 characters"),
  useLink: z.boolean(),
  files: z
    .any()
    .refine(
      (files) =>
        Array.from(files).every((file) => file?.size <= 10 * 1024 * 1024),
      "File must be under 10MB."
    ),
  links: z.array(
    z.object({
      link: z
        .string()
        .optional()
        .refine(
          (value) =>
            !value || /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(value),
          {
            message: "Invalid URL format",
          }
        ),
    })
  ),
});

type FormValues = z.infer<typeof ResourceSchema>;

const CreateResource = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleSidebarVisibility = () => setIsSidebarOpen(!isSidebarOpen);

  const [useLink, setUseLink] = useState(false);
  const { id: productId } = useParams();
  const router = useRouter();

  const {
    register,
    watch,
    setValue,
    getValues,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(ResourceSchema),
    defaultValues: {
      name: "",
      category: {
        label: "",
        value: "",
      },
      type: {
        label: "",
        value: "",
      },
      tool: {
        label: "",
        value: "",
      },
      purpose: "",
      instruction: "",
      files: [],
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

  const category = watch("category");

  useEffect(() => {
    if (category) {
      setValue("type", { label: "", value: "" });
      setValue("tool", { label: "", value: "" });
    }
  }, [category, setValue]);

  const { data: resourceCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res: AxiosResponse<Categories[]> = await axiosInstance.get(
        "/resource-category"
      );

      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const categoryOptions = resourceCategories
    ? resourceCategories?.map((category) => {
        return {
          label: category.name,
          value: category?._id,
        };
      })
    : [];

  const currentCategoryId = getValues()?.["category"]?.value;

  // Type by category
  const { data: typesByCategory } = useQuery({
    queryKey: ["typesByCategory", currentCategoryId],
    queryFn: async () => {
      const res: AxiosResponse<{ types: TechnologyCategoryType[] }> =
        await axiosInstance.get(
          `/resource-type/by-category?categoryId=${currentCategoryId}`
        );

      return res.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!currentCategoryId,
  });

  const categoryTypes = typesByCategory?.types || [];

  const typesOptions = categoryTypes.map((type) => {
    return {
      label: type?.name,
      value: type?._id,
    };
  });

  // get all the tools
  const { data: tools } = useQuery({
    queryKey: ["typesByCategory"],
    queryFn: async () => {
      const res: AxiosResponse<{ _id: string; name: string }[]> =
        await axiosInstance.get(`technology-tool/dropdown`);

      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const toolOptions = tools?.map((tool) => {
    return {
      label: tool.name,
      value: tool._id,
    };
  });

  const handleCreateResource = async (data: FormValues) => {
    // get links and join by comma
    const links = data?.links.map((link) => Object.values(link).join(","));

    const formData = new FormData();
    formData.append("name", data?.name);
    formData.append("categoryId", data?.category?.value);
    formData.append("typeId", data?.type?.value);
    formData.append("toolId", data?.tool?.value);
    formData.append("toolPurpose", data?.purpose);
    formData.append("instruction", data?.instruction);

    !useLink &&
      Array.from(data?.files).forEach((file) =>
        formData.append("files", file, file?.name)
      );
    useLink && formData.append("links", links.join(","));
    formData.append("productId", `${productId}`);

    const res = await axiosInstance.post("/resource", formData);

    return res.data;
  };

  const create = useMutation({
    mutationKey: ["createResource"],
    mutationFn: handleCreateResource,
  });

  const onSubmit = (data: FormValues) => {
    create.mutate(data, {
      onSuccess: (data) => {
        // router.back();
      },
      onError: (error) => console.error(error),
    });
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
                    <InputSelect2
                      className="w-full"
                      control={control}
                      register={register}
                      errors={errors}
                      name={"category"}
                      placeholder="Select"
                      options={categoryOptions}
                      setValue={setValue}
                    />
                    <FieldError errors={errors} name="category" />
                  </div>
                </div>
                <div className="flex gap-4 items-center justify-between">
                  <label className="text-right w-[200px] text-nowrap">
                    Resource Type <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full">
                    <InputSelect2
                      className="w-full"
                      control={control}
                      register={register}
                      errors={errors}
                      name={"type"}
                      placeholder="Select"
                      options={typesOptions}
                      setValue={setValue}
                    />
                    <FieldError errors={errors} name="type" />
                  </div>
                </div>
                <div className="flex gap-4 items-center justify-between">
                  <label className="text-right w-[200px] text-nowrap">
                    Tool <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full">
                    <InputSelect2
                      className="w-full"
                      control={control}
                      register={register}
                      errors={errors}
                      name={"tool"}
                      placeholder="Select"
                      options={toolOptions}
                      setValue={setValue}
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
                      placeholder="Tool Purpose"
                      className={cn(
                        "w-full border rounded-md outline-none px-2 py-1",
                        {
                          "border border-red-500": errors && errors.purpose,
                        }
                      )}
                      rows={5}
                      {...register("purpose")}
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
                      className={cn(
                        "w-full border rounded-md outline-none px-2 py-1",
                        {
                          "border border-red-500": errors && errors.instruction,
                        }
                      )}
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
                      register={register}
                      errors={errors}
                      name="files"
                      type="file"
                      placeholder="Select"
                      className={cn(
                        "disabled:text-slate-400 disabled:cursor-not-allowed file:disabled:cursor-not-allowed file:border-none file:bg-white bg-white text-sm outline-none rounded-md px-3 w-full py-2 border"
                      )}
                      disabled={useLink}
                      multiple={true}
                    />
                    <p className="text-slate-400 text-xs">
                      All suported files can be uploaded within 10MB.
                    </p>
                    <FieldError errors={errors} name="files" />
                  </div>
                </div>

                <div className="flex gap-1">
                  <input
                    {...register("useLink")}
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
                  <>
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
                                className={cn("pl-20", {
                                  "border border-red-500":
                                    errors?.links?.[index],
                                })}
                              />
                            </div>
                            <FieldLinkError
                              errors={errors}
                              name={`links.${index}.link`}
                              index={index}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
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
              <Button
                // onClick={() => router.back()}
                intent={"secondary"}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit">Add Resource</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResource;
