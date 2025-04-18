"use client";

import { formatDate } from "@/app/utils/dateHelper";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type User = {
  id: string;
  name: string;
  email: string;
  role: "lead" | "team";
};

type TaskLogType = {
  id: string;
  action: string;
  description: string;
  taskId: string;
  userId: string;
  user: User;
};

type TaskType = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  assignedTo: User;
  logs: TaskLogType[];
};

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState<TaskType>();

  const fetchTaskDetail = async () => {
    try {
      const response = await fetch(`/api/task/${id}`);

      if (response.ok) {
        const data = await response.json();
        setTask(data);
      } else {
        toast.error("Failed to fetch task");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTaskDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold">Task Detail</h1>

      <div className="rounded-lg mt-5 w-full max-w-[500px] text-sm text-left text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 p-4 space-y-4">
        <div>
          <h2 className="text-lg font-bold">Task Title</h2>
          <p>{task?.title}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Task Description</h2>
          <p>{task?.description}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Assigned To</h2>
          <p>{task?.assignedTo?.name}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Status</h2>
          <p>{task?.status}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Assigned From</h2>
          <p>{task?.logs?.[0]?.user?.name ?? "-"}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Created at</h2>
          <p>{task?.createdAt ? formatDate(task?.createdAt) : "-"}</p>
        </div>
      </div>
    </>
  );
};

export default TaskDetail;
