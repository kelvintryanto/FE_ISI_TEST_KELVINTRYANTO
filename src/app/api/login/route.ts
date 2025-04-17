import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sign } from "@/app/utils/jwt";
import { comparePass } from "@/app/utils/bcrypt";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log("masuk sini nih");
    const body = await request.json();
    const { email, password } = body;
    console.log(body);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    console.log(user);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        {
          status: 400,
        }
      );
    }

    const isPasswordCorrect = await comparePass(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        {
          status: 400,
        }
      );
    }

    const token = await sign({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    if (token) {
      // Set cookie with the token
      const cookieStore = await cookies();
      cookieStore.set("token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 1, // 1 days
      });

      return NextResponse.json(token, { status: 200 });
    } else {
      return NextResponse.json(token, { status: 400 });
    }
  } catch (error) {
    console.log("Error on creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return NextResponse.json({ token });
}
