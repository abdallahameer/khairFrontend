"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE_URL = "https://my-worker.mohammad-3db.workers.dev";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is invalid or missing a token.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError(
        "Something went wrong. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-sm text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">Invalid link</h1>
        <p className="text-gray-400">
          This password reset link is missing or invalid. Please request a new
          one from the app.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 hidden h-16 w-16 items-center justify-center rounded-full bg-red-600/10 sm:flex">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-white">Password reset!</h1>
        <p className="mb-6 text-gray-400">
          Your password has been changed successfully. You can now return to the
          Khair app and log in with your new password.
        </p>
        <Link
          href="khairmobilev://login"
          className="inline-block rounded-lg bg-red-600 px-6 py-3 font-medium text-white"
        >
          Open Khair App
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="mb-2 text-center text-2xl font-bold text-white">
        Reset your password
      </h1>
      <p className="mb-6 text-center text-sm text-gray-400">
        Enter a new password for your Khair account.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-600 p-3 text-sm text-white">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-200">
            New password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-200">
            Confirm password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-red-600 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-red-600 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
