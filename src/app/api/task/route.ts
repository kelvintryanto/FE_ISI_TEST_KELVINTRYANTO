import { verify } from "@/app/utils/jwt";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
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
        action: "CREATE",
        description: `${data.title} created by ${user?.name} to ${assignedUser?.name}`,
        taskId: result.id,
        userId: data.assignedFrom,
      },
    });

    return NextResponse.json({ message: "Task created successfully!" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // mengambil user yang sedang login
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await verify(token);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let tasks;

    if (user.role === "lead") {
      tasks = await prisma.task.findMany({
        include: {
          assignedTo: true,
        },
      });
    } else {
      tasks = await prisma.task.findMany({
        where: {
          assignedToId: user.id,
        },
        include: {
          assignedTo: true,
        },
      });
    }

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
