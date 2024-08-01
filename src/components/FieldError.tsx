import { Warning } from "@phosphor-icons/react";
import { cn } from "../../utils/cn";

type Props = {
  errors: any;
  name: string;
  className?: string;
};
const FieldError = ({ errors, name, className }: Props) => {
  return (
    <>
      {errors && errors[name] && (
        <p className={cn("flex items-center gap-1 text-red-600", className)}>
          <Warning /> {errors[name].message}
        </p>
      )}
    </>
  );
};

export default FieldError;
