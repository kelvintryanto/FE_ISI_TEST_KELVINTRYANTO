import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const result = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        assignedToId: data.assignedTo,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: data.assignedFrom,
      },
    });

    const assignedUser = await prisma.user.findUnique({
      where: {
        id: data.assignedTo,
      },
    });

    await prisma.taskLog.create({
      data: {
        action: "create",
        description: `${data.title} created by ${user.name} to ${assignedUser.name}`,
        taskId: result.id,
        userId: data.assignedFromId,
      },
    });

    return NextResponse.json({ message: "Task created successfully!" });
  } catch (error) {
    console.log(error);
  }
}

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignedTo: true, // ini penting untuk mendapatkan data assignedTo.name
      },
    });

    return NextResponse.json({ tasks, status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
