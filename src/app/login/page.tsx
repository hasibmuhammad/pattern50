"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { FaTriangleExclamation } from "react-icons/fa6";
import { AxiosResponse } from "axios";
import { UserInfoType } from "@/types/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../../../public/logo.svg";
import Loader from "@/components/Loader";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axiosIntance";

type FormField = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormField>();

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const localStorageAccessToken = localStorage.getItem("access-token");
    const localStorageRefreshToken = localStorage.getItem("refresh-token");
    if (localStorageAccessToken && localStorageRefreshToken) {
      router.replace("/dashboard");
    }
  }, [router]);

  // login function to mutate
  const login = useMutation({
    mutationKey: ["loginMutation"],
    mutationFn: async (data: FormField) => {
      // the post request to login
      const response: AxiosResponse<UserInfoType> = await axiosInstance.post(
        "/auth/sign-in",
        {
          ...data,
          grantType: "password",
          refreshToken: process.env.NEXT_REFRESH_TOKEN,
        }
      );

      return response.data;
    },
  });

  const onSubmit: SubmitHandler<FormField> = (data) => {
    login.mutate(data, {
      onSuccess: (data) => {
        if (data?.auth?.accessToken) {
          localStorage.setItem("access-token", data?.auth?.accessToken);
          localStorage.setItem("refresh-token", data?.auth?.refreshToken);
          router.replace("/dashboard");
        }
      },
      onError: (error) => {
        console.error("Error while login", error);
      },
    });
  };

  return (
    <main className="w-[70vw] h-[80vh] flex items-center justify-center">
      <div>
        <div className="flex items-center justify-center">
          <Image src={Logo} alt="Logo" />
        </div>
        <div className="mt-10 bg-gray-50 w-full md:w-[500px] h-[450px] border-t-4 border-blue-500 p-10">
          <h2 className="font-bold text-2xl">Login</h2>
          <p className="text-gray-400 font-bold">Continue with pattern50</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
            <div className="space-y-4">
              <div>
                <label className="font-semibold">Email Address:</label>
                <br />
                <input
                  {...register("email", {
                    required: true,
                    pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  })}
                  className="p-2 border-2 outline-none rounded-md w-full"
                  type="email"
                  placeholder="Email Address"
                />
                {errors.email && errors.email.type === "required" && (
                  <p className="text-red-400 flex items-center gap-1">
                    <FaTriangleExclamation /> Email address is required!
                  </p>
                )}
                {errors.email && (
                  <p className="text-red-400 flex items-center gap-1">
                    <FaTriangleExclamation /> Please enter a valid email
                    address!
                  </p>
                )}
              </div>
              <div>
                <label className="font-semibold">Password:</label>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required!",
                    })}
                    className="p-2 border-2 outline-none rounded-md w-full"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  {!showPassword ? (
                    <Eye
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-3 cursor-pointer right-1"
                    />
                  ) : (
                    <EyeSlash
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-3 cursor-pointer right-1"
                    />
                  )}
                </div>
                {errors.password && (
                  <p className="text-red-400 flex items-center gap-1">
                    {errors.password.message}
                  </p>
                )}
                <br />
                <p className="text-right mt-1 font-medium">Forgot Password?</p>
              </div>
            </div>
            <button
              type="submit"
              className="mt-14 bg-blue-500 text-white w-full py-2 rounded-lg"
            >
              {login.isPending ? <Loader /> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
