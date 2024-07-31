import { Warning } from "@phosphor-icons/react";

type Props = {
  errors: any;
  name: string;
};
const FieldError = ({ errors, name }: Props) => {
  return (
    <>
      {errors && errors[name] && (
        <p className="flex items-center gap-1 text-red-600">
          <Warning /> {errors[name].message}
        </p>
      )}
    </>
  );
};

export default FieldError;
