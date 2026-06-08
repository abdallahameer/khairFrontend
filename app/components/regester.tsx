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
      window.location.reload(); // Reload to update user state in parent component
    } catch (err) {
      // Error is handled by the usePost hook
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-md p-8 relative">
          {/* Close Button */}
          <button
            onClick={() => {
              setIsOpen(false);
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
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

          <h1 className="text-3xl font-bold text-center mb-8 text-white">
            {registrationOrLogin === "login" ? "Login" : "Register"}
          </h1>
          {success && (
            <div className="mb-4 p-3 bg-green-600 text-white rounded-lg text-sm">
              {registrationOrLogin === "login"
                ? "Login successful!"
                : "Registration successful!"}
            </div>
          )}
          {postError && (
            <div className="mb-4 p-3 bg-red-600 text-white rounded-lg text-sm">
              {postError}
            </div>
          )}
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
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
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
