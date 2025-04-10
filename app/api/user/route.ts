import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const cookiesToken = (await cookies()).get("token");
    const token = cookiesToken?.value;

    if(!token) {
        return NextResponse.json({success: false, message: "User belum login" }, { status: 401 });
    }
    
    try {
        const checkToken = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/me`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
             },
        });
        const data = await checkToken.json();

        return NextResponse.json({
            success: true,
            message: "User terautentikasi",
            user: data.user,
            role: data.user.role, // Kirim role-nya (misalnya "admin" atau "user")
        }, {status: 200});
    } catch(err) {
        return NextResponse.json({success: false, message: "Token tidak valid" }, { status: 401 });
    }
}