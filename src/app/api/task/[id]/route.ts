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
