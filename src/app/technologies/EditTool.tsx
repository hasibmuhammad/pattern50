"use client";
import { PlusCircle, Trash, X, Warning } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/Input";
import InputSelectType from "@/components/InputSelectType";
import Button from "@/components/button/button";
import { cn } from "../../../utils/cn";
import ToolFieldError from "@/components/ToolFieldError";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axiosInstance";
import { Tool, ToolData } from "@/types/types";
import { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";

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
            !value || /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(value),
          {
            message:
              "Invalid URL format. URL must start with 'www.' and can include optional paths.",
          }
        ),
      logo: z
        .any()
        .optional() // Make logo optional
        .refine(
          (file: FileList | undefined) =>
            !file || file.length === 0 || file[0]?.size <= 1 * 1024 * 1024,
          "File must be under 1MB"
        )
        .refine(
          (file: FileList | undefined) =>
            !file ||
            file.length === 0 ||
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
              file?.[0]?.type
            ),
          "File must be PNG, JPG, JPEG, or WebP"
        )
        .refine(async (file: FileList | undefined) => {
          if (!file || file.length === 0) return true; // Skip validation if no file is selected

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
  editItemId: string;
  activeTab: string;
  tabName: string;
  onUpdate: () => void;
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

const EditTool = ({
  activeTab,
  tabName,
  editItemId,
  isOpen,
  onClose,
  onUpdate,
}: Props) => {
  const {
    data: types,
    isLoading: isLoadingTypes,
    error: typesError,
  } = useQuery({
    queryKey: ["types"],
    queryFn: async () => {
      const response: AxiosResponse<{ data: Tool[]; count: number }> =
        await axiosInstance.get("/technology-category/tool-types/list");
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const toolTypes = types?.data || [];

  // Fetch the tool info based on the editing id
  const {
    data: editItemInfo,
    isLoading: editItemLoading,
    error: editItemError,
  } = useQuery({
    queryKey: ["editTool", editItemId],
    queryFn: async () => {
      const response: AxiosResponse<ToolData> = await axiosInstance.get(
        `/technology-tool/details/${editItemId}`
      );
      return response.data;
    },
    enabled: !!editItemId,
    refetchOnWindowFocus: false,
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(ToolSchema) });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isFileChanged, setIsFileChanged] = useState<boolean>(false);

  useEffect(() => {
    if (editItemInfo) {
      setValue("tools[0].name", editItemInfo.name);
      setValue("tools[0].type", editItemInfo.type._id);
      setValue(
        "tools[0].website",
        editItemInfo.website.replace("https://", "")
      );

      setSelectedFileName(editItemInfo.logoKey);
      setIsFileChanged(false);
    }
  }, [editItemInfo, editItemId, setValue]);

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

  const updateToolMutation = useMutation({
    mutationKey: ["updateTool", editItemId],
    mutationFn: async (data: ToolInfo) => {
      const payload = data.tools[0];

      let logoKey = editItemInfo?.logoKey;
      let logo = editItemInfo?.logo;

      if (isFileChanged) {
        const res = await uploadLogo(payload.logo[0]);
        logoKey = res?.key;
        logo = res?.Location;
      }

      const response = await axiosInstance.patch(
        `/technology-tool/edit/${editItemId}`,
        {
          name: payload.name,
          website: payload.website ? `https://${payload.website}` : "",
          typeId: editItemInfo?.type._id,
          logo: logo,
          logoKey: logoKey,
          categoryId: activeTab,
          id: editItemId,
        }
      );
      return response.data;
    },
  });

  const onSubmit = async (data: ToolInfo) => {
    updateToolMutation.mutate(data, {
      onSuccess: (data) => {
        console.log("Success: ", data);
        onUpdate();
        onClose();
      },
      onError: (error: any) => {
        console.error("Error updating tool:", error);
      },
    });
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setValue("tools[0].logo", event.target.files); // Update form value
      setSelectedFileName(event.target.files[0].name); // Update file name display
      setIsFileChanged(true); // Set flag to true when a new file is selected

      // Trigger validation on file change
      //   await trigger("tools[0].logo");
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  //   if (isLoadingTypes || editItemLoading) {
  //     return <div>Loading...</div>;
  //   }

  //   if (typesError || editItemError) {
  //     return <div>Error loading data</div>;
  //   }

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
              <h1 className="text-2xl font-bold">Edit {tabName} Technology</h1>

              <p className="text-slate-400">
                Get started by filling in the information to add new technology
              </p>
            </div>
            <X onClick={onClose} size={28} className="cursor-pointer" />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <form
              className="flex-1 mt-4 flex flex-col justify-between"
              onSubmit={handleSubmit(onSubmit)}
            >
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
                        name="tools[0].name"
                        placeholder="Tool Name"
                        type="text"
                        className={cn({
                          "border-red-500": errors?.tools?.[0]?.name,
                        })}
                      />
                      <ToolFieldError index={0} errors={errors} name={`name`} />
                    </div>
                  </div>
                  <div className="flex gap-4 items-center justify-between">
                    <label className="w-[200px] text-nowrap">
                      Tool Type <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full">
                      <InputSelectType
                        control={control}
                        name={`tools[0].type`}
                        placeholder="Select"
                        errors={errors}
                        className={cn("w-full border-0 outline-none", {
                          "border border-red-500 rounded-md":
                            errors?.tools?.[0]?.type,
                        })}
                        types={toolTypes}
                      />
                      <ToolFieldError index={0} errors={errors} name={`type`} />
                    </div>
                  </div>
                  <div className="flex gap-4 items-center justify-between">
                    <label className="w-[200px] text-nowrap">
                      Website Link
                    </label>
                    <div className="w-full">
                      <div className="flex relative">
                        <span className="inline-flex items-center absolute h-full px-2 border-r-2 text-slate-400">
                          https://
                        </span>
                        <Input
                          register={register}
                          errors={errors}
                          name={`tools[0].website`}
                          placeholder="www.figma.com"
                          type="text"
                          className={cn("pl-20", {
                            "border-red-500": errors?.tools?.[0]?.website,
                          })}
                        />
                      </div>
                      <ToolFieldError
                        index={0}
                        errors={errors}
                        name={`website`}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 justify-between">
                    <label className="w-[200px] text-nowrap">
                      Add Logo <span className="text-red-500">*</span>
                    </label>
                    <div className="max-w-[305px] w-full">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button
                        size={"small"}
                        type="button"
                        onClick={triggerFileSelect}
                        className={cn(
                          "text-black font-normal text-left",
                          "file:border-none file:bg-white bg-white text-sm outline-none rounded-md px-3 w-full py-2 border truncate",
                          {
                            "border-red-500": errors.tools?.[0]?.logo,
                          }
                        )}
                      >
                        {selectedFileName
                          ? `Choose File ${selectedFileName}`
                          : "Choose File"}
                      </Button>
                      <p
                        className={cn(
                          "flex items-center gap-1 text-sm text-slate-400 py-1"
                        )}
                      >
                        Files must be in PNG format, ≤ 1MB, 200x200 pixels
                      </p>
                      <ToolFieldError index={0} errors={errors} name={`logo`} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-5 pr-10 bg-slate-50 flex gap-5 justify-end mt-auto">
                <Button type="button" intent={"secondary"} onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTool;
