"use client";

import { Suspense } from "react";
import ResetPasswordForm from "../components/resetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
