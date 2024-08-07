import { Warning } from "@phosphor-icons/react";
import { cn } from "../../utils/cn";

type Props = {
  errors: any;
  name: string;
  className?: string;
  index: number;
};

const ToolFieldError = ({ errors, name, className, index }: Props) => {
  const error = errors.tools?.[index]?.[name];

  return (
    <>
      {error && (
        <p className={cn("text-sm flex gap-1 text-red-600", className)}>
          <Warning size={20} /> {error.message}
        </p>
      )}
    </>
  );
};

export default ToolFieldError;
