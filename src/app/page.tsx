"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";

// Skema validasi dengan Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Minimal 6 karakter" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoading(true);
      // Mengirim data ke API backend
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log(response);
      const result = await response.json();

      if (response.ok) {
        toast.success("Welcome!");
        router.push("/task");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
    console.log("Data login:", data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-5 bg-zinc-900 text-white">
      <div className="w-full sm:max-w-[350px] p-5 bg-zinc-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center text-white">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border rounded-md bg-zinc-700 text-white border-zinc-600 focus:outline-none focus:ring-2 focus:ring-white"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border rounded-md bg-zinc-700 text-white border-zinc-600 focus:outline-none focus:ring-2 focus:ring-white"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black hover:bg-gray-200 h-10 px-4 py-2"
          >
            {loading ? "Loading..." : "Login"}
          </button>

          <div className="flex justify-center items-center">
            <p className="text-sm text-gray-400">
              {`Don't have an account?`}{" "}
              <Link href="/register" className="text-blue-500 underline">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
