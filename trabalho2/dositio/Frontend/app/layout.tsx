import React from "react";
import AuthProvider from "../context/AuthContext";
import "./globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default RootLayout;
