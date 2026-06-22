"use client";

import { useState } from "react";
import "./globals.css";
import Sidebar from "./components/sidebar";
import Register from "./components/regester";
import useSWR from "swr";
import { fetcher, getCurrentUser } from "./helpers/api";

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
  const currentUser = getCurrentUser();

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
  };

  return (
    <html dir="ltr" lang="en" className="h-full w-full antialiased">
      <body className="flex min-h-full w-full flex-row justify-between">
        <Sidebar
          currentUser={currentUserData?.user || currentUser}
          onOpenRegister={() => setOpenRegister(true)}
          onOpenLogin={() => {
            setRegistrationOrLogin("login");
            setOpenRegister(true);
          }}
          onLogout={handleLogout}
        />

        <div className="flex h-full w-full flex-col md:ml-[15%]">
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
