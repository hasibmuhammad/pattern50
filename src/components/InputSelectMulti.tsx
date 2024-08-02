import { Controller } from "react-hook-form";
import Select, { defaultTheme } from "react-select";
import { cn } from "../../utils/cn";
import { useRouter } from "next/navigation";

type Props = {
  register: any;
  control: any;
  name: string;
  placeholder: string;
  className?: string;
  options: any;
  setStateFilter: any;
  value: any;
};

const InputSelectMulti = ({
  register,
  control,
  name,
  placeholder,
  className,
  options,
  setStateFilter,
  value,
}: Props) => {
  const router = useRouter();

  const formatedValue = value.map((v: any) => ({
    label: v,
    value: v,
  }));

  return (
    <>
      <Controller
        {...register(name)}
        control={control}
        render={() => (
          <Select
            className={cn(className)}
            placeholder={placeholder}
            options={options}
            onChange={(state: any) => {
              const filterValue = state.map((st: any) => st.value);
              setStateFilter(filterValue);
              router.push(`/companies?state=${filterValue.join(",")}`);
            }}
            isMulti
            closeMenuOnSelect={false}
            value={formatedValue}
          />
        )}
      />
    </>
  );
};

export default InputSelectMulti;
