import { Controller } from "react-hook-form";
import Select from "react-select";
import { cn } from "../../utils/cn";

type Props = {
  register: any;
  control: any;
  errors?: any;
  name: string;
  placeholder: string;
  className?: string;
  options?: any;
  setValue: any;
};

const InputSelect2 = ({
  register,
  control,
  errors,
  name,
  placeholder,
  className,
  options,
  setValue,
}: Props) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            {...field}
            className={cn(
              "w-1/2",
              {
                "border rounded-md border-red-500": errors && errors[name],
              },
              className
            )}
            placeholder={placeholder}
            options={options}
            onChange={(selectedOption: any) => {
              setValue(name, selectedOption, { shouldValidate: true });
            }}
            // value={field.value}
            // value={options?.find(
            //   (option: any) =>
            //     option.value === field.value?.value ||
            //     option.value === field.value
            // )}
          />
        )}
      />
    </>
  );
};

export default InputSelect2;
