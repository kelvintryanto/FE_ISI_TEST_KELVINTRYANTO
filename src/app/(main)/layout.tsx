import React from "react";
import Sidebar from "@/app/components/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="p-5 w-full flex-1 ml-16 lg:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
