export async function Login({email, password}: {email: string, password: string}) {
    try {
        const loginLaravel = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({email: email, password: password})
        })

        const responseApi = await loginLaravel.json()
        if(!responseApi.success && responseApi.success == null) return responseApi;

        let token = responseApi.jwt.original.access_token;
        let expired = responseApi.jwt.original.expires_in;

        const generateToken = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_APP}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({token: token, expired: expired}),
        });

        let response = await generateToken.json();
        
        return response;
    } catch (error) {
        console.error("Error fetching token:", error);
    }
}

export async function Logout() {
    try {
        const logout = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_APP}/api/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        
        return await logout.json();
    } catch (error) {
        console.error("Error fetching token:", error);
    }
}

export async function Register({name, email, password}: {name: string, email: string, password: string}) {
    try {
        const register = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({name: name, email: email, password: password})
        });

        const responseApi = await register.json()
        return responseApi;
    } catch (error) {
        console.error("Error fetching token:", error);
    }
}

export async function Token() {
    try {
        const token = await fetch(`api/token`, {
            method: "POST"
        });

        const responseApi = await token.json()
        if(responseApi.status == false) return "";

        return responseApi.token;
    } catch (error) {
        console.error("Error fetching token:", error);
    }
}