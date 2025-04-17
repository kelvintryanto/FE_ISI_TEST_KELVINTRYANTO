"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Task = () => {
  const [lead, setLead] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    </>
  );
};

export default Task;
