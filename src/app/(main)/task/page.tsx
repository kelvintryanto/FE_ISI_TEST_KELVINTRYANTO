"use client";

import TaskTable, { TaskTableType } from "@/app/components/TaskTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Task = () => {
  const [lead, setLead] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskTableType[]>([]);

  const fetchTask = async () => {
    try {
      const response = await fetch("/api/task");
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data) {
          setTasks(data);
        }
      } else {
        toast.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    fetchTask();
    fetchUserRole();
  }, []);

  const addTask = () => {
    try {
      setLoading(true);
      router.push("/task/create");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task</h1>
        {lead && (
          <button
            onClick={addTask}
            className="bg-zinc-700 text-white px-4 py-2 rounded-md hover:cursor-pointer hover:bg-gray-300 transition hover:text-black"
          >
            {loading ? "Loading..." : "Create Task"}
          </button>
        )}
      </div>

      {tasks.length > 0 ? (
        <TaskTable tasks={tasks} fetchTask={fetchTask} />
      ) : (
        <div className="flex w-full justify-center mt-5">Belum ada task</div>
      )}
    </>
  );
};

export default Task;
