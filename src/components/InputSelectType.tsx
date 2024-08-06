import { Controller } from "react-hook-form";
import Select from "react-select";
import { cn } from "../../utils/cn";

type Props = {
  register: any;
  control: any;
  errors?: any;
  name: string;
  placeholder?: string;
  className?: string;
};

const InputSelectType = ({
  register,
  control,
  errors,
  name,
  placeholder,
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
                  errors && errors[name],
              },
              className
            )}
            options={[]}
          />
        )}
      />
    </>
  );
};

export default InputSelectType;
