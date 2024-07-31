import { Controller } from "react-hook-form";
import Select from "react-select";

type Props = {
  register: any;
  control: any;
  errors: any;
  name: string;
  placeholder: string;
  zipInfo: any;
};

const InputSelect = ({
  register,
  control,
  errors,
  name,
  placeholder,
  zipInfo,
}: Props) => {
  return (
    <>
      <Controller
        {...register(name)}
        control={control}
        render={() => (
          <Select
            className={`w-1/2 ${
              errors &&
              errors[name] &&
              !zipInfo &&
              "border rounded-md overflow-hidden border-red-500"
            }`}
            placeholder={placeholder}
            options={
              zipInfo
                ? [
                    {
                      value: zipInfo[name],
                      label: zipInfo[name],
                    },
                  ]
                : []
            }
            value={
              zipInfo
                ? {
                    value: zipInfo[name],
                    label: zipInfo[name],
                  }
                : null
            }
          />
        )}
      />
    </>
  );
};

export default InputSelect;
