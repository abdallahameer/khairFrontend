"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface LoginFormInputs {
  userName: string;
  password: string;
}

export default function VideoReviewPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const formValues = watch();
  const router = useRouter();

  const onSubmit = () => {
    if (
      formValues.userName.toLowerCase() == "abdallah ameer" &&
      formValues.password == "123456"
    ) {
      router.push("/videoReview");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4 sm:p-6">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-6 sm:p-8 border border-gray-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-white">
          Login
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 sm:space-y-6"
        >
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Username
            </label>
            <input
              id="userName"
              type="text"
              placeholder="Enter your username"
              {...register("userName", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
              className="w-full px-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {errors.userName && (
              <p className="mt-2 text-xs sm:text-sm text-red-400">
                {errors.userName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {errors.password && (
              <p className="mt-2 text-xs sm:text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 sm:py-2 px-4 rounded-lg transition duration-200 text-base sm:text-sm"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-gray-400 mt-6 sm:mt-8">
          Don't have an account?{" "}
          <a href="#" className="text-blue-400 hover:text-blue-300 underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
