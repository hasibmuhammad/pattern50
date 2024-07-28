"use client";

import { SubmitHandler, useForm } from "react-hook-form";

type FormField = {
  firstName: String;
  lastName: String;
  email: String;
  password: String;
};

const SignUp = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormField>();

  const onsubmit: SubmitHandler<FormField> = (data) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-10 lg:px-0">
      <h1 className="font-bold text-3xl">Registrations</h1>

      <br />
      <br />
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="w-full md:w-[450px] space-y-4"
      >
        <div>
          <label className="font-semibold">First Name</label>
          <br />
          <input
            {...register("firstName", { required: true })}
            className="p-2 w-full border outline-none rounded-md"
            type="text"
          />
        </div>
        <div>
          <label className="font-semibold">Last Name</label>
          <br />
          <input
            {...register("lastName", { required: true })}
            className="p-2 w-full border outline-none rounded-md"
            type="text"
          />
        </div>
        <div>
          <label className="font-semibold">Email</label>
          <br />
          <input
            {...register("email", { required: true })}
            className="p-2 w-full border outline-none rounded-md"
            type="email"
          />
        </div>
        <div>
          <label className="font-semibold">Password</label>
          <br />
          <input
            {...register("password", { required: true })}
            className="p-2 w-full border outline-none rounded-md"
            type="password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 rounded-md py-2 text-white"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default SignUp;
