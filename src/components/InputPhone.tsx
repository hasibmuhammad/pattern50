import { Warning } from "@phosphor-icons/react";
import PhoneInput from "react-phone-input-2";
import { cn } from "../../utils/cn";

type Props = {
  register: any;
  errors: any;
  name: string;
  placeholder: string;
  // onChange: (value: string) => void;
  setValue: (name: any, value: any) => void;
  value?: string;
  className?: string;
};

const InputPhone = ({
  register,
  errors,
  name,
  placeholder,
  setValue,
  value,
  className,
}: Props) => {
  return (
    <>
      <PhoneInput
        {...register(name)}
        onChange={(phone) => setValue(name, phone)}
        value={value}
        country={"us"}
        placeholder={placeholder}
        inputProps={{
          className: cn(
            "w-full border rounded-md outline-none px-3 py-2 pl-14",
            { "border-red-500": errors && errors.phone },
            className
          ),
        }}
      />
    </>
  );
};

export default InputPhone;
