import React from "react";
import { cn } from "../../utils/cn";
import { X } from "@phosphor-icons/react";

type Props = {
  register: any;
  errors: any;
  name: string;
  placeholder?: string;
  type: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  multiple?: boolean;
  fileList?: File[];
  onRemoveFile?: (file: File) => void;
};

const InputMultiFile = ({
  register,
  errors,
  name,
  placeholder,
  type,
  onChange,
  className,
  defaultValue,
  disabled,
  multiple,
  fileList,
  onRemoveFile,
}: Props) => {
  return (
    <div className="relative">
      <input
        className={cn(
          "outline-none rounded-md px-3 w-full py-2 border",
          className,
          {
            "border-red-500": errors && errors[name],
          }
        )}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        multiple={multiple}
        {...register(name)}
      />
      {fileList && fileList.length > 0 && (
        <div className="mt-2">
          {fileList.map((file, index) => (
            <div key={index} className="flex items-center justify-between mb-2">
              <span>{file.name}</span>
              <button
                type="button"
                onClick={() => onRemoveFile?.(file)}
                className="text-red-500"
              >
                <X weight="bold" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputMultiFile;
