"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { usePost } from "../hooks/useRequest";

export default function Register({
  isOpen,
  setIsOpen,
  registrationOrLogin = "registration",
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  registrationOrLogin?: "registration" | "login";
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      userName: "",
      password: "",
    },
  });
  const [success, setSuccess] = useState(false);

  const { post, loading, error: postError } = usePost();

  const onSubmit = async (data: { userName: string; password: string }) => {
    setSuccess(false);

    try {
      const endpoint =
        registrationOrLogin === "login"
          ? "/api/users/login"
          : "/api/users/register";
      const response = await post(endpoint, {
        username: data.userName,
        password: data.password,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.id,
          username: response.username,
        }),
      );
      setSuccess(true);

      reset();
      window.location.reload();
    } catch (err) {}
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="bg-opacity-50 fixed inset-0 z-40 bg-black"></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="relative w-full max-w-md rounded-lg bg-gray-900 p-8 shadow-md">
          <button
            onClick={() => {
              setIsOpen(false);
            }}
            className="absolute top-4 right-4 text-gray-400 transition hover:text-white"
            aria-label="Close"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h1 className="mb-8 text-center text-3xl font-bold text-white">
            {registrationOrLogin === "login" ? "Login" : "Register"}
          </h1>
          {success && (
            <div className="mb-4 rounded-lg bg-green-600 p-3 text-sm text-white">
              {registrationOrLogin === "login"
                ? "Login successful!"
                : "Registration successful!"}
            </div>
          )}
          {postError && (
            <div className="mb-4 rounded-lg bg-red-600 p-3 text-sm text-white">
              {postError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="userName"
                className="mb-2 block text-sm font-medium text-gray-200"
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
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                className="mb-2 block text-sm font-medium text-gray-200"
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
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? registrationOrLogin === "login"
                  ? "Logging in..."
                  : "Registering..."
                : registrationOrLogin === "login"
                  ? "Login"
                  : "Register"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
