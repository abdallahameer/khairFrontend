"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import Sidebar from "./components/sidebar";
import Register from "./components/regester";

interface User {
  id: string;
  username: string;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [openRegister, setOpenRegister] = useState(false);
  const [registrationOrLogin, setRegistrationOrLogin] = useState<
    "registration" | "login"
  >("registration");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!openRegister) {
      const stored = localStorage.getItem("user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    }
  }, [openRegister]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <html dir="ltr" lang="en" className="h-full w-full antialiased">
      <body className="min-h-full w-full flex flex-row justify-between">
        <Sidebar
          currentUser={currentUser}
          onOpenRegister={() => setOpenRegister(true)}
          onOpenLogin={() => {
            setRegistrationOrLogin("login");
            setOpenRegister(true);
          }}
          onLogout={handleLogout}
        />

        <div className="flex flex-col h-full w-full">{children}</div>

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
