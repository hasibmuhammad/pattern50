import { CalendarBlank } from "@phosphor-icons/react";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";
import { cn } from "../../utils/cn";

type Props = {
  control: any;
  errors: any;
  name: string;
  placeholder: string;
  className?: string;
};

const InputDate = ({
  control,
  errors,
  name,
  placeholder,
  className,
}: Props) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <DatePicker
            className={cn(
              "w-full border outline-none rounded-md px-3 py-2",
              { "border-red-500": errors && errors.startDate },
              className
            )}
            placeholderText={placeholder}
            showIcon
            icon={<CalendarBlank className="text-slate-500" />}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            onChange={(date) => {
              onChange(date?.toISOString());
            }}
            selected={value ? new Date(value) : null}
            onBlur={onBlur}
            ref={ref}
          />
        )}
      />
    </>
  );
};

export default InputDate;
