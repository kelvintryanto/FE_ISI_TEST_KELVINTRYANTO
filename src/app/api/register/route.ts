// app/api/register/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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
        { message: "Email sudah terdaftar!" },
        { status: 400 }
      );
    }

    // Simpan user baru ke database
    await prisma.user.create({
      data: {
        name: data.email,
        email: data.email,
        role: data.role,
        password: data.password,
      },
    });

    return NextResponse.json({ message: "User berhasil terdaftar!" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan!" },
      { status: 500 }
    );
  }
}
