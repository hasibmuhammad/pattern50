import { Warning } from "@phosphor-icons/react";
import { cn } from "../../utils/cn";

type Props = {
  errors: any;
  name: string;
  className?: string;
};

const ToolEditFieldError = ({ errors, name, className }: Props) => {
  const error = errors[name];

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

export default ToolEditFieldError;
