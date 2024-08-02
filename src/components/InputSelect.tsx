import { Controller } from "react-hook-form";
import Select from "react-select";
import { cn } from "../../utils/cn";

type Props = {
  register: any;
  control: any;
  errors?: any;
  name: string;
  placeholder: string;
  zipInfo?: any;
  className?: string;
};

const InputSelect = ({
  register,
  control,
  errors,
  name,
  placeholder,
  zipInfo,
  className,
}: Props) => {
  return (
    <>
      <Controller
        {...register(name)}
        control={control}
        render={() => (
          <Select
            className={cn(
              "w-1/2",
              {
                "border rounded-md overflow-hidden border-red-500":
                  errors && errors[name] && !zipInfo,
              },
              className
            )}
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
