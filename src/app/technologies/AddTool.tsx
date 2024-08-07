"use client";
import { PlusCircle, Trash, X } from "@phosphor-icons/react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/Input";
import InputSelectType from "@/components/InputSelectType";
import Button from "@/components/button/button";
import { cn } from "../../../utils/cn";
import ToolFieldError from "@/components/ToolFieldError";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axiosInstance";
import { Tool } from "@/types/types";
import { AxiosResponse } from "axios";
import InputFile from "@/components/InputFile";

// Define the Zod schema
const ToolSchema = z.object({
  tools: z.array(
    z.object({
      name: z.string().min(1, { message: "Tool Name is required" }),
      type: z.string().min(1, { message: "Tool Type is required" }),
      website: z
        .string()
        .optional()
        .refine(
          (value) =>
            !value || /^(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(value),
          {
            message: "Invalid URL format",
          }
        ),
      logo: z
        .any()
        .refine((file: FileList) => file?.length > 0, "File is required")
        .refine(
          (file: FileList) => file?.[0]?.size <= 1 * 1024 * 1024,
          "File must be under 1MB"
        )
        .refine(
          (file: FileList) =>
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
              file?.[0]?.type
            ),
          "File must be PNG, JPG, JPEG, or WebP"
        )
        .refine(async (file: FileList) => {
          if (!file || file.length === 0) return false;

          return new Promise((resolve: any) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              const img = new Image();
              img.onload = () => {
                resolve(img.width === img.height);
              };
              img.onerror = () => {
                resolve(false);
              };
              img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file[0]);
          });
        }, "File must have equal height and width!"),
    })
  ),
});

type FormValues = z.infer<typeof ToolSchema>;

type Props = {
  isOpen: boolean;
  tabName: string;
  activeTabId: string;
  onClose: () => void;
};

type ToolInfo = {
  tools: {
    name: string;
    type: string;
    website?: string;
    logo?: FileList;
  }[];
};

const AddTool = ({ activeTabId, tabName, isOpen, onClose }: Props) => {
  const {
    data: types,
    isLoading,
    error: typesError,
  } = useQuery({
    queryKey: ["types"],
    queryFn: async () => {
      const response: AxiosResponse<{ data: Tool[]; count: number }> =
        await axiosInstance.get("/technology-category/tool-types/list");
      return response.data;
    },
  });

  const toolTypes = types?.data || [];

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      tools: [{ name: "", type: "", website: "", logo: null }],
    },
    resolver: zodResolver(ToolSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tools",
  });

  const handleAddMore = () => {
    append({ name: "", type: "", website: "", logo: null });
  };

  const uploadLogo = async (
    file: File
  ): Promise<{ logo: string; logoKey: string }> => {
    const formData = new FormData();
    formData.append("file", file, file.name);

    try {
      const response = await axiosInstance.patch("/upload/documents", formData);
      return response.data;
    } catch (error) {
      console.error("Error uploading logo:", error);
      throw new Error("Failed to upload logo");
    }
  };

  const handleMutation = async (tools: FormValues["tools"]) => {
    const toolsWithDetails = await Promise.all(
      tools.map(async (tool) => {
        const logoFile = await tool.logo?.[0];
        if (!logoFile) return null;

        const logoRes: any = await uploadLogo(logoFile);

        const logo = logoRes?.Location;
        const logoKey = logoRes?.key;

        return {
          name: tool.name,
          typeId: tool.type,
          categoryId: activeTabId,
          website: tool.website ? `https://${tool.website}` : undefined,
          logo,
          logoKey,
        };
      })
    );

    const filteredTools = toolsWithDetails.filter((tool) => tool !== null);

    try {
      await axiosInstance.post("/technology-tool/create", {
        tools: filteredTools,
      });
    } catch (error) {
      console.error("Error creating tool:", error);
      throw new Error("Failed to create tools");
    }
  };

  const createTool = useMutation({
    mutationKey: ["addTool"],
    mutationFn: handleMutation,
  });

  const onSubmit = (data: ToolInfo) => {
    createTool.mutate(data.tools, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    });
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out translate-x-full",
        {
          "translate-x-0": isOpen,
        }
      )}
    >
      <div className="fixed right-0 top-0 bottom-0 max-w-xl rounded-lg overflow-hidden shadow-xl overflow-y-auto">
        <div className="flex flex-col min-h-screen bg-white">
          <div className="bg-slate-50 p-5 flex justify-between">
            <div>
              <h1 className="text-2xl font-bold">Add {tabName} Technology</h1>
              <p className="text-slate-400">
                Get started by filling in the information to add new {tabName}{" "}
                technology
              </p>
            </div>
            <X onClick={onClose} size={28} className="cursor-pointer" />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <form
              className="flex-1 mt-4 flex flex-col justify-between"
              onSubmit={handleSubmit(onSubmit)}
            >
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-slate-50 px-10 mx-5 py-5 my-2 rounded-lg flex justify-between"
                >
                  <div className="space-y-8">
                    <div className="flex gap-4 items-center justify-between">
                      <label className="w-[200px] text-nowrap">
                        Tool Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full">
                        <Input
                          register={register}
                          errors={errors}
                          name={`tools[${index}].name`}
                          placeholder="Tool Name"
                          type="text"
                          className={cn({
                            "border-red-500": errors.tools?.[index]?.name,
                          })}
                        />
                        <ToolFieldError
                          errors={errors}
                          index={index}
                          name={`name`}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 items-center justify-between">
                      <label className="w-[200px] text-nowrap">
                        Tool Type <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full">
                        <InputSelectType
                          control={control}
                          name={`tools[${index}].type`}
                          placeholder="Select"
                          errors={errors}
                          className={cn("w-full border-0 outline-none", {
                            "border border-red-500 rounded-md":
                              errors.tools?.[index]?.type,
                          })}
                          types={toolTypes}
                        />
                        <ToolFieldError
                          errors={errors}
                          index={index}
                          name={`type`}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 items-center justify-between">
                      <label className="w-[200px] text-nowrap">
                        Website Link
                      </label>
                      <div className="w-full">
                        <div className="flex relative">
                          <span className="inline-flex items-center absolute h-full px-2 border-r-2 text-slate-400">
                            http://
                          </span>
                          <Input
                            register={register}
                            errors={errors}
                            name={`tools[${index}].website`}
                            placeholder="www.figma.com"
                            type="text"
                            className={cn("pl-20", {
                              "border-red-500": errors.tools?.[index]?.website,
                            })}
                          />
                        </div>
                        <ToolFieldError
                          errors={errors}
                          index={index}
                          name={`website`}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 justify-between">
                      <label className="w-[200px] text-nowrap">
                        Add Logo <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full">
                        <input
                          name={`tools[${index}].logo`}
                          type="file"
                          className={cn(
                            "file:border-none file:bg-white bg-white text-sm outline-none rounded-md px-3 w-full py-2 border",
                            {
                              "border-red-500": errors.tools?.[index]?.logo,
                            }
                          )}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setValue(`tools[${index}].logo`, e.target.files);
                            }
                          }}
                        />
                        <p
                          className={cn(
                            "flex items-center gap-1 text-sm text-slate-400 py-1"
                          )}
                        >
                          Files must be in PNG format, ≤ 1MB, 200x200 pixels
                        </p>
                        <ToolFieldError
                          errors={errors}
                          index={index}
                          name={`logo`}
                        />
                      </div>
                    </div>
                  </div>
                  {fields.length > 1 && index > 0 && (
                    <Trash
                      onClick={() => remove(index)}
                      size={32}
                      className="text-red-500 cursor-pointer"
                    />
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={handleAddMore}
                state="inactive"
                className="mx-5 flex justify-center flex-grow-0 items-center gap-1 w-40"
              >
                <PlusCircle weight="bold" />
                Add More
              </Button>
              <div className="py-5 pr-10 bg-slate-50 flex gap-5 justify-end mt-auto">
                <Button type="button" intent={"secondary"} onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTool;
