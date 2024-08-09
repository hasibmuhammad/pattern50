import { Controller } from "react-hook-form";
import Select, {
  components,
  ValueContainerProps,
  OptionProps,
} from "react-select";
import { cn } from "../../utils/cn";
import { useRouter } from "next/navigation";
import { X, Check } from "@phosphor-icons/react";

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
  setFilter: (value: string[]) => void;
  value: string[];
  urlPart?: string;
};

const CustomValueContainer = (props: ValueContainerProps<Option, true>) => {
  const { getValue, clearValue, selectProps } = props;

  const count = getValue().length;

  return (
    <components.ValueContainer {...props}>
      {count > 0 ? (
        <div className="flex gap-1 items-center">
          <div className="flex items-center bg-slate-200 px-2 rounded-md">
            <span>{count}</span>
            <X
              size={16}
              className="ml-1 cursor-pointer z-50"
              onClick={(e) => {
                e.stopPropagation();
                clearValue();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                clearValue();
              }}
            />
          </div>
          {selectProps.name === "filterByState" && (
            <span className="font-medium">
              State{`${count > 1 ? "s" : ""}`}
            </span>
          )}
          {selectProps.name === "filterByStatus" && (
            <span className="font-medium">Status</span>
          )}
        </div>
      ) : (
        props.children
      )}
    </components.ValueContainer>
  );
};

const CustomOption = (props: OptionProps<Option, true>) => {
  const { isSelected, label } = props;

  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between cursor-pointer">
        <span>{label}</span>
        {isSelected && (
          <Check size={16} weight="bold" className="text-blue-600" />
        )}
      </div>
    </components.Option>
  );
};

const InputSelectMulti = ({
  control,
  name,
  placeholder,
  className,
  options,
  setFilter,
  value,
  urlPart,
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
        <>
          <Select
            {...field}
            className={cn(className)}
            placeholder={placeholder}
            options={options}
            onChange={(selectedOptions) => {
              const filterValue = (selectedOptions as Option[]).map(
                (option) => option.value
              );
              setFilter(filterValue);
              router.push(`${urlPart}=${filterValue.join(",")}`);
            }}
            isMulti
            closeMenuOnSelect={false}
            blurInputOnSelect={false}
            value={formattedValue}
            classNamePrefix="multi-select"
            hideSelectedOptions={false}
            components={{
              ValueContainer: CustomValueContainer,
              Option: CustomOption,
            }}
          />
        </>
      )}
    />
  );
};

export default InputSelectMulti;
