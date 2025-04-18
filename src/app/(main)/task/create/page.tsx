"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

const TaskSchema = z.object({
  title: z.string().min(1, "Please enter a title"),
  description: z.string().min(1, "Please enter a description"),
  status: z.enum(["NOT_STARTED", "ON_PROGRESS", "DONE", "REJECT"], {
    message: "Please select a status",
  }),
  assignedTo: z.string().min(1, "Please select an assigned user"),
  assignedFrom: z.string(),
});

type TaskForm = z.infer<typeof TaskSchema>;

type Team = {
  id: string;
  name: string;
  email: string;
  role: "lead" | "team";
};

const CreateTask = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState<Team[]>([]);
  const [whoAmI, setWhoAmI] = useState<string>("");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/userRole");
        const data = await response.json();

        setWhoAmI(data.user.id);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTeam = async () => {
      try {
        const team = await fetch("/api/team");
        const data = await team.json();
        if (data.team) {
          setTeam(data.team);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
    fetchTeam();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskForm>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "NOT_STARTED",
      assignedTo: "",
      assignedFrom: whoAmI,
    },
  });

  const onSubmit = async (data: TaskForm) => {
    try {
      setLoading(true);

      const body = {
        ...data,
        assignedFrom: whoAmI,
      };

      // Mengirim data ke API backend
      const response = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log(data);
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        router.push("/task");
      } else {
        toast.error(result.message);
      }

      router.push("/task");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5 w-full max-w-[500px]">
        <h1 className="text-2xl font-bold">Create Task</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* task title */}
          <div className="w-full">
            <label
              htmlFor="title"
              className="block text-sm font-medium mb-1 text-gray-200"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter your title"
              {...register("title")}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-400"
            />
            {errors.title && (
              <p className="text-sm text-red-400 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* task description */}
          <div className="w-full">
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1 text-gray-200"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter your description"
              {...register("description")}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-400"
            />
            {errors.description && (
              <p className="text-sm text-red-400 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* task status */}
          <div className="w-full">
            <label
              htmlFor="status"
              className="block text-sm font-medium mb-1 text-gray-200"
            >
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="NOT_STARTED">Not Started ⛔ </option>
              <option value="ON_PROGRESS">On Progress 🔛</option>
              <option value="DONE">Done ✅</option>
              <option value="REJECT">Reject ❌</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-400 mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* task assignedTo */}
          <div className="w-full">
            <label
              htmlFor="assignedTo"
              className="block text-sm font-medium mb-1 text-gray-200"
            >
              Assigned To
            </label>
            <select
              id="assignedTo"
              {...register("assignedTo")}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="">Select a user</option>
              {team.map((team) => (
                <option value={team.id} key={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {errors.assignedTo && (
              <p className="text-sm text-red-400 mt-1">
                {errors.assignedTo.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-2 px-4 rounded-lg hover:cursor-pointer hover:bg-gray-300 transition hover:text-black"
          >
            {loading ? "Loading..." : "Create Task"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateTask;
