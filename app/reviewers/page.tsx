"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { supabase } from "../Supabaseclient";

interface LoginFormInputs {
  userName: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {
    const { data: reviewer, error } = await supabase
      .from("reviewers")
      .select("*")
      .eq("username", data.userName.toLowerCase())
      .eq("password", data.password)
      .single();

    if (error || !reviewer) {
      alert("Invalid username or password");
      return;
    }

    localStorage.setItem(
      "reviewer",
      JSON.stringify({ id: reviewer.id, username: reviewer.username }),
    );

    router.push("/videoReview");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          Login
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.userName && (
              <p className="mt-1 text-sm text-red-400">
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
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
