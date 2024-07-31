import { Warning } from "@phosphor-icons/react";
import PhoneInput from "react-phone-input-2";

type Props = {
  register: any;
  errors: any;
  name: string;
  placeholder: string;
  // onChange: (value: string) => void;
  setValue: (name: any, value: any) => void;
  value?: string;
};

const InputPhone = ({
  register,
  errors,
  name,
  placeholder,
  setValue,
  value,
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
          className: `w-full border ${
            errors && errors.phone && "border-red-500"
          } rounded-md outline-none px-3 py-2 pl-14`,
        }}
      />
    </>
  );
};

export default InputPhone;
