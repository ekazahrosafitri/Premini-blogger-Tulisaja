import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const {token, expired} = await req.json();

    if(!token && !expired) {
        return NextResponse.json({status: false, message: "Field Token And Expired Is Required"}, {status: 400});
    }


    const checkToken = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/me`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
         },
    });
    const responseApi = await checkToken.json();
    if (!checkToken.ok) {
        return NextResponse.json({status: false, message: responseApi.message}, {status: 400});
    }
    

    // Simpan Cookie
    (await cookies()).set('token', token, {
        httpOnly: true,
        secure: process.env.APPLICATION_STATUS == 'production',
        maxAge: expired,
        path: '/'
    });

    return NextResponse.json({status: true, message: "Token Successfuly Generated"}, {status: 200})
}