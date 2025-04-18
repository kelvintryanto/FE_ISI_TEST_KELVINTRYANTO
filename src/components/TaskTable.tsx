"use client";

import { Eye, Pen, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type TaskTableType = {
  id: string;
  title: string;
  description: string;
  status: "NOT STARTED" | "ON PROGRESS" | "DONE" | "REJECT";
  assignedTo?: User;
};

type TaskTableProps = {
  tasks: TaskTableType[];
  fetchTask: () => void;
};

const TaskTable = ({ tasks, fetchTask }: TaskTableProps) => {
  const [sortKey, setSortKey] = useState<keyof TaskTableType | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const handleSort = (key: keyof TaskTableType) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/task/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Task deleted successfully");
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      console.log(error);
    } finally {
      fetchTask();
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === "ALL") return true;
    return task.status === statusFilter;
  });

  const sortedTasks = sortKey
    ? [...filteredTasks].sort((a, b) => {
        const aValue = a[sortKey] ?? "";
        const bValue = b[sortKey] ?? "";
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortAsc
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      })
    : filteredTasks;

  return (
    <>
      <div className="flex justify-end gap-4 mt-4">
        <select
          className="border rounded px-3 py-1 bg-zinc-700 text-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="NOT_STARTED">Not Started</option>
          <option value="ON_PROGRESS">On Progress</option>
          <option value="DONE">Done</option>
          <option value="REJECT">Reject</option>
        </select>
      </div>

      <table className="rounded-lg mt-5 w-full text-sm text-left text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
          <tr>
            <th className="px-6 py-3 border">No.</th>
            <th
              className="px-6 py-3 border cursor-pointer"
              onClick={() => handleSort("title")}
            >
              Title
            </th>
            <th
              className="px-6 py-3 border cursor-pointer"
              onClick={() => handleSort("description")}
            >
              Description
            </th>
            <th
              className="px-6 py-3 border cursor-pointer"
              onClick={() => handleSort("status")}
            >
              Status
            </th>
            <th
              className="px-6 py-3 border cursor-pointer"
              onClick={() => handleSort("assignedTo")}
            >
              Assigned To
            </th>
            <th className="px-6 py-3 border text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task, index) => (
            <tr
              key={task.id}
              className="even:bg-gray-50 even:dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
            >
              <td className="px-6 py-4 border text-gray-900 dark:text-white">
                {index + 1}
              </td>
              <td className="px-6 py-4 border text-gray-900 dark:text-white">
                {task.title}
              </td>
              <td className="px-6 py-4 border text-gray-500 dark:text-gray-400">
                {task.description}
              </td>
              <td className="px-6 py-4 border text-gray-500 dark:text-gray-400">
                {task.status}
              </td>
              <td className="px-6 py-4 border text-gray-500 dark:text-gray-400">
                {task.assignedTo ? task.assignedTo.name : "Not Assigned"}
              </td>
              <td className="px-6 py-4 border text-center text-sm font-medium">
                <div className="flex items-center justify-center gap-2 flex-nowrap">
                  <div className="relative group">
                    <Link
                      href={`/task/${task.id}`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Eye size={20} />
                    </Link>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition transform bg-gray-700 text-white text-xs rounded py-1 px-2 z-10">
                      View
                    </span>
                  </div>

                  <div className="relative group">
                    <Link
                      href={`/task/${task.id}`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Pen size={20} />
                    </Link>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition transform bg-gray-700 text-white text-xs rounded py-1 px-2 z-10">
                      Edit
                    </span>
                  </div>

                  <div className="relative group">
                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:cursor-pointer"
                    >
                      <Trash size={20} />
                    </button>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition transform bg-gray-700 text-white text-xs rounded py-1 px-2 z-10">
                      Delete
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TaskTable;
