import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const cookiesToken = (await cookies()).get("token");
    const token = cookiesToken?.value;

    if(!token) {
        return NextResponse.json({status: false, message: "User belum login" }, { status: 401 });
    }

    return NextResponse.json({status: true, token: token}, {status: 200})
}