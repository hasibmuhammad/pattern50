import { Controller } from "react-hook-form";
import Select, { components, ValueContainerProps } from "react-select";
import { cn } from "../../utils/cn";
import { useRouter } from "next/navigation";

type Option = {
  label: string;
  value: string;
};

type Props = {
  control: any;
  name: string;
  placeholder: string;
  className?: string;
  options: Option[];
  setStateFilter: (value: string[]) => void;
  value: string[];
};

// Custom ValueContainer to display the count of selected items
const CustomValueContainer = (props: ValueContainerProps<Option, true>) => {
  const { getValue } = props;
  const count = getValue().length;
  return (
    <components.ValueContainer {...props}>
      {count > 0 ? `${count} selected` : "State"}
    </components.ValueContainer>
  );
};

const InputSelectMulti = ({
  control,
  name,
  placeholder,
  className,
  options,
  setStateFilter,
  value,
}: Props) => {
  const router = useRouter();

  const formattedValue = value.map((v) => ({
    label: v,
    value: v,
  }));

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          className={cn(className)}
          placeholder={placeholder}
          options={options}
          onChange={(selectedOptions) => {
            const filterValue = (selectedOptions as Option[]).map(
              (option) => option.value
            );
            setStateFilter(filterValue);
            router.push(`/companies?state=${filterValue.join(",")}`);
          }}
          isMulti
          closeMenuOnSelect={false}
          value={formattedValue}
          components={{ ValueContainer: CustomValueContainer }}
        />
      )}
    />
  );
};

export default InputSelectMulti;
