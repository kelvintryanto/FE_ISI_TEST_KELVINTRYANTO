// app/api/register/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hashPass } from "@/app/utils/bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json(); // Ambil data dari request

    console.log(data);
    // Cek apakah email sudah terdaftar di database
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered!" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPass(data.password);

    // Simpan user baru ke database
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Successfully registered!" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error registering user!" },
      { status: 500 }
    );
  }
}
