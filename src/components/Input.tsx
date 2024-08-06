import { cn } from "../../utils/cn";

type Props = {
  register: any;
  errors: any;
  name: string;
  placeholder?: string;
  type: string;
  onChange?: (e: any) => void;
  className?: string;
  defaultValue?: string;
};

const Input = ({
  register,
  errors,
  name,
  placeholder,
  type,
  onChange,
  className,
  defaultValue,
}: Props) => {
  return (
    <>
      <input
        {...register(name)}
        className={cn(
          "outline-none rounded-md px-3 w-full py-2 border",
          className,
          {
            "w-1/2": name === "zipCode",
            "border-red-500": errors && errors[name],
          }
        )}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        defaultValue={defaultValue}
      />
    </>
  );
};

export default Input;
