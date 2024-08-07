import { Controller } from "react-hook-form";
import Select from "react-select";
import { cn } from "../../utils/cn";

type Props = {
  control: any;
  errors?: any;
  name: string;
  placeholder?: string;
  className?: string;
  types: any;
};

const InputSelectType = ({
  control,
  errors,
  name,
  placeholder,
  className,
  types,
}: Props) => {
  const options = types.map((type: any) => ({
    label: type.name,
    value: type.name,
  }));

  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            placeholder={placeholder}
            className={cn(className, {
              "border border-red-500 rounded-md": errors?.[name],
            })}
            options={options}
            value={
              options.find((option: any) => option.value === field.value) ||
              null
            }
            onChange={(selected) => field.onChange(selected?.value)}
          />
        )}
      />
    </div>
  );
};

export default InputSelectType;
