import { Warning } from "@phosphor-icons/react";
import { cn } from "../../utils/cn";

type Props = {
  errors: any;
  name: string;
  className?: string;
  index: number;
};
const FieldLinkError = ({ errors, name, index, className }: Props) => {
  const message = (
    <>
      {errors?.links?.[index]?.link && <Warning />}{" "}
      {errors?.links?.[index]?.link?.message}
    </>
  );
  return (
    <>
      {errors && errors.links && (
        <p className={cn("flex items-center gap-1 text-red-600", className)}>
          {message}
        </p>
      )}
    </>
  );
};

export default FieldLinkError;
