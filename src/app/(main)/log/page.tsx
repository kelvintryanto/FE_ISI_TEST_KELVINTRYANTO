"use client";

import formatDateLog from "@/app/utils/formatLogDate";
import { useEffect, useState } from "react";

type Log = {
  id: string;
  action: string;
  description: string;
  taskId?: string | null;
  userId?: string | null;
  createdAt: Date;
  user: User;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: "lead" | "team";
};

const TaskLog = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/taskLog");
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data) {
          setLogs(data);
        }
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task Log</h1>
      </div>
      <table className="w-full text-xs table-auto border-separate border-spacing-y-2">
        <tbody>
          {logs.map((log) => {
            let textColor = "text-white"; // default text color

            if (log.action === "DELETE") {
              textColor = "text-red-500"; // warna tulisan untuk DELETE
            } else if (log.action === "UPDATE") {
              textColor = "text-green-500"; // warna tulisan untuk UPDATE menjadi hijau
            }

            return (
              <tr key={log.id} className="bg-gray-800 rounded shadow-sm">
                <td className="px-2 py-1 whitespace-nowrap text-gray-400">
                  [{formatDateLog(log.createdAt.toString())}]
                </td>
                <td className={`px-2 py-1 ${textColor} text-gray-100`}>
                  {log.description}
                </td>
                <td className={`px-2 py-1 text-right font-medium ${textColor}`}>
                  {log.action}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default TaskLog;
