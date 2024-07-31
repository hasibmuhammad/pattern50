import { Warning } from "@phosphor-icons/react";
import PhoneInput from "react-phone-input-2";

type Props = {
  register: any;
  errors: any;
  name: string;
  placeholder: string;
  onChange: (value: string) => void;
};

const InputPhone = ({
  register,
  errors,
  name,
  placeholder,
  onChange,
}: Props) => {
  return (
    <>
      <PhoneInput
        {...register(name)}
        onChange={onChange}
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
