"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

// Validasi schema dengan role
const registerSchema = z
  .object({
    name: z.string().min(1, "Please enter your name"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password confirmation must be at least 6 characters"),
    role: z.enum(["lead", "team"], {
      required_error: "Please select a role",
      message: "Please select a role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  useEffect(() => {
    try {
      setIsCheckingAuth(true);
      const fetchToken = async () => {
        const response = await fetch("/api/login");
        const data = await response.json();

        if (data.token) {
          router.push("/task");
        }
      };

      fetchToken();
    } catch (error) {
      console.log(error);
    } finally {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      role: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      // Mengirim data ke API backend
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message + " Please login");
        router.push("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isCheckingAuth ? (
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen items-center justify-center p-5 bg-zinc-900 text-white">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 p-5 flex flex-col items-center justify-center w-full space-y-5 md:max-w-[450px]"
          >
            <h1 className="text-xl font-bold mb-5 text-white">Register</h1>

            {/* Name */}
            <div className="w-full">
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1 text-gray-200"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                placeholder="Enter your name"
                autoComplete="off"
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-400"
              />
              {errors.name && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-gray-200"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                placeholder="Enter your email"
                autoComplete="off"
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-400"
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="w-full">
              <label
                htmlFor="role"
                className="block text-sm font-medium mb-1 text-gray-200"
              >
                Role
              </label>
              <select
                id="role"
                {...register("role")}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="">Select a role</option>
                <option value="lead">Lead</option>
                <option value="team">Team</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="w-full">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1 text-gray-200"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                placeholder="Enter your password"
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-400"
              />
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="w-full">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1 text-gray-200"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                placeholder="Confirm your password"
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-400"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-white text-black py-2 px-4 rounded-lg hover:cursor-pointer hover:bg-gray-300 transition hover:text-black"
            >
              {loading ? "Loading..." : "Register"}
            </button>

            <div className="flex justify-center items-center">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/" className="text-blue-500 underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
