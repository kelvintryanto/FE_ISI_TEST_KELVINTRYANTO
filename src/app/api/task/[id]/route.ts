import { verify } from "@/app/utils/jwt";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    // mengambil user yang melakukan delete
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await verify(token);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // mengambil id task untuk dicatat
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // mengambil task yang akan di delete
    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.taskLog.create({
      data: {
        action: "DELETE",
        description: `Task with title ${task.title} deleted by ${user.name}}`,
        userId: user.id,
      },
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

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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
    // mengambil user yang melakukan update
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await verify(token);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Mengambil ID dan data yang dikirimkan oleh klien
    const { id, status, description } = await req.json();

    // Validasi status yang diterima
    const validStatuses = ["NOT_STARTED", "ON_PROGRESS", "DONE", "REJECT"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Memperbarui task di database, memperbarui status dan description jika diberikan
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(status && { status }), // Update status jika ada
        ...(description && { description }), // Update description jika ada
      },
    });

    // Ambil task yang akan di update untuk logging
    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.taskLog.create({
      data: {
        action: "UPDATE",
        description: `Task with title ${task.title} updated by ${user.name}`,
        userId: user.id,
      },
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
