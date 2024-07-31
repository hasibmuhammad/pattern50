import { CalendarBlank } from "@phosphor-icons/react";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";

type Props = {
  control: any;
  errors: any;
  name: string;
  placeholder: string;
};

const InputDate = ({ control, errors, name, placeholder }: Props) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <DatePicker
            className={`w-full border ${
              errors && errors.startDate && "border-red-500"
            } outline-none rounded-md px-3 py-2`}
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
