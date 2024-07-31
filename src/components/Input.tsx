type Props = {
  register: any;
  errors: any;
  name: string;
  placeholder: string;
  type: string;
  onChange?: (e: any) => void;
};

const Input = ({
  register,
  errors,
  name,
  placeholder,
  type,
  onChange,
}: Props) => {
  return (
    <>
      <input
        {...register(name)}
        className={`${name === "zipCode" ? "w-1/2" : "w-full"} border ${
          errors && errors[name] && "border-red-500"
        } outline-none rounded-md px-3 py-2`}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
      />
    </>
  );
};

export default Input;
