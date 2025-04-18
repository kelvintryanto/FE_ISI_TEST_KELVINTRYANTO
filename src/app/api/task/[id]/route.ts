import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.taskLog.deleteMany({
      where: { taskId: id }, // pastikan untuk menyesuaikan dengan relasi yang tepat
    });

    await prisma.task.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "Task deleted successfully!" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(id);

    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: true,
        logs: {
          include: {
            user: true,
          },
        },
      },
    });
    console.log(task);

    if (!task) {
      return new Response(JSON.stringify({ message: "Task not found" }), {
        status: 404,
      });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Mengambil ID dan data yang dikirimkan oleh klien
    const { id, status } = await req.json();

    // Validasi status yang diterima
    const validStatuses = ["NOT_STARTED", "ON_PROGRESS", "DONE", "REJECT"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Memperbarui task di database
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
    });

    // Mengembalikan response setelah update berhasil
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
