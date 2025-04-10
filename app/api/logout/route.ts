import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    (await cookies()).delete('token'); // Hapus token dari cookie
    return NextResponse.json({ message: "Anda Berhasil Keluar" });
}
