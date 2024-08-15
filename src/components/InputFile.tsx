import { cn } from "../../utils/cn";

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
};

const InputFile = ({
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
}: Props) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    if (type === "file" && onChange) {
      onChange(e);
    }
  };

  return (
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
      onChange={handleFileChange}
      disabled={disabled}
      multiple={multiple}
      {...register(name)}
    />
  );
};

export default InputFile;
