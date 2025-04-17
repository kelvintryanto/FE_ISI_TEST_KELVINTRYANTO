"use client";

import { usePathname, useRouter } from "next/navigation";
import { ListIcon, LogOutIcon, Users } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Tasks", href: "/task", icon: <ListIcon size={20} /> },
];

const leadItems = [
  { label: "My Team", href: "/team", icon: <Users size={20} /> },
];

const logoutItem = {
  label: "Logout",
  icon: <LogOutIcon size={20} />,
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [lead, setLead] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/userRole");
        const data = await response.json();
        if (data.user) {
          if (data.user.role === "lead") {
            setLead(true);
          } else {
            setLead(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserRole();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      router.push("/");
      toast.success("Success: Logout successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to LogOut");
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[60px] lg:w-64 bg-gray-800 text-white transition-all duration-300 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center lg:justify-start px-3 py-4 border-b border-gray-700">
        <span className="text-lg font-semibold hidden lg:inline">
          📋 Task Manager
        </span>
        <span className="lg:hidden text-lg font-bold">📋</span>
      </div>

      {/* Navigasi utama */}
      <nav className="flex-1 flex flex-col gap-2 p-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative flex items-center gap-3 rounded-md p-2 hover:bg-gray-700 transition-colors group",
                isActive ? "bg-gray-700" : ""
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="hidden lg:inline">{item.label}</span>

              {/* Tooltip on small screen */}
              <span className="absolute left-14 z-10 hidden whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-sm shadow-lg group-hover:inline-block lg:group-hover:hidden">
                {item.label}
              </span>
            </Link>
          );
        })}

        {lead &&
          leadItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "relative flex items-center gap-3 rounded-md p-2 hover:bg-gray-700 transition-colors group",
                  isActive ? "bg-gray-700" : ""
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="hidden lg:inline">{item.label}</span>

                {/* Tooltip on small screen */}
                <span className="absolute left-14 z-10 hidden whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-sm shadow-lg group-hover:inline-block lg:group-hover:hidden">
                  {item.label}
                </span>
              </Link>
            );
          })}
      </nav>

      <div className="p-3 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-start gap-2 p-2 bg-sidebar-primary-background text-sidebar-primary-foreground rounded-md hover:bg-gray-700 hover:text-sidebar-accent-foreground hover:cursor-pointer"
        >
          <span className="flex-shrink-0">{logoutItem.icon}</span>
          <span className="hidden lg:inline">{logoutItem.label}</span>
        </button>
      </div>
    </aside>
  );
}
