import { Eye, Trash, Pen } from "lucide-react";
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
  status: "NOT_STARTED" | "ON_PROGRESS" | "DONE" | "REJECT";
  assignedTo?: User;
};

type TaskTableProps = {
  tasks: TaskTableType[];
  fetchTask: () => void;
};

const TaskTable = ({ tasks, fetchTask }: TaskTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskTableType | null>(null);
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState<
    "NOT_STARTED" | "ON_PROGRESS" | "DONE" | "REJECT"
  >("NOT_STARTED");

  const openModal = (task: TaskTableType) => {
    setSelectedTask(task);
    setUpdatedDescription(task.description);
    setUpdatedStatus(task.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (!selectedTask) return;

    try {
      const response = await fetch(`/api/task/${selectedTask.id}`, {
        method: "PUT",
        body: JSON.stringify({
          id: selectedTask.id,
          description: updatedDescription,
          status: updatedStatus,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Task updated successfully");
        fetchTask();
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating task");
    } finally {
      closeModal();
    }
  };

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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/task/${id}`, {
        method: "PUT",
        body: JSON.stringify({ id, status: newStatus }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        toast.success("Status updated successfully");
        fetchTask(); // Refresh tasks
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.log(error);
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
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="border rounded px-3 py-1 bg-zinc-700 text-white"
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="ON_PROGRESS">On Progress</option>
                  <option value="DONE">Done</option>
                  <option value="REJECT">Reject</option>
                </select>
              </td>
              <td className="px-6 py-4 border text-gray-500 dark:text-gray-400">
                {task.assignedTo ? task.assignedTo.name : "Not Assigned"}
              </td>
              <td className="px-6 py-4 border text-center text-sm font-medium">
                <div className="flex items-center justify-center gap-2 flex-nowrap">
                  {/* View Button */}
                  <div className="relative group">
                    <Link
                      href={`/task/${task.id}`}
                      className="hover:cursor-pointer"
                    >
                      <Eye size={20} />
                    </Link>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition transform bg-gray-700 text-white text-xs rounded py-1 px-2 z-10">
                      View
                    </span>
                  </div>

                  {/* Edit Button */}
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={() => openModal(task)}
                      className="hover:cursor-pointer"
                    >
                      <Pen size={20} />
                    </button>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition transform bg-gray-700 text-white text-xs rounded py-1 px-2 z-10">
                      Edit
                    </span>
                  </div>

                  {/* Delete Button */}
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      className="hover:cursor-pointer"
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

      {/* Modal for editing */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-zinc-800 text-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                rows={3}
                className="w-full mt-2 p-2 bg-zinc-700 rounded border border-zinc-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Status</label>
              <select
                value={updatedStatus}
                onChange={(e) =>
                  setUpdatedStatus(
                    e.target.value as
                      | "NOT_STARTED"
                      | "ON_PROGRESS"
                      | "DONE"
                      | "REJECT"
                  )
                }
                className="w-full mt-2 p-2 bg-zinc-700 rounded border border-zinc-600"
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="ON_PROGRESS">On Progress</option>
                <option value="DONE">Done</option>
                <option value="REJECT">Reject</option>
              </select>
            </div>
            <div className="flex justify-between gap-2">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskTable;
