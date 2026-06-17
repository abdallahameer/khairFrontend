"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import Sidebar from "./components/sidebar";
import Register from "./components/regester";
import useSWR from "swr";
import { fetcher } from "./helpers/api";

interface User {
  id: string;
  username: string;
  profile_image?: string | null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // useState initializer runs only in the browser — safe to use localStorage here
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [openRegister, setOpenRegister] = useState(false);
  const [registrationOrLogin, setRegistrationOrLogin] = useState<
    "registration" | "login"
  >("registration");

  const { data: currentUserData } = useSWR(
    currentUser ? `/api/users/${currentUser.id}` : null,
    fetcher,
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <html dir="ltr" lang="en" className="h-full w-full antialiased">
      <body className="min-h-full w-full flex flex-row justify-between">
        <Sidebar
          currentUser={currentUserData?.user || currentUser}
          onOpenRegister={() => setOpenRegister(true)}
          onOpenLogin={() => {
            setRegistrationOrLogin("login");
            setOpenRegister(true);
          }}
          onLogout={handleLogout}
        />

        <div className="flex flex-col h-full w-full md:ml-[15%]">
          {children}
        </div>

        {openRegister && (
          <Register
            isOpen={openRegister}
            setIsOpen={setOpenRegister}
            registrationOrLogin={registrationOrLogin}
          />
        )}
      </body>
    </html>
  );
}
