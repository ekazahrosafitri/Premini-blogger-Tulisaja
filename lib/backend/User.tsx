"use client"
type propTypeUser = {
    sort?: string | null,
    order?: "DESC" | "ASC",
    start?: number | null,
    end?: number | null,
    filters?: object | null,
    limit?: number | null,
    token: string
}

export async function semuaUser({sort = null, order = "DESC", start = null, end = null, filters = null, token}: propTypeUser) {
    try {
        const getUser = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json", 
                "X-HTTP-Method-Override": "GET", 
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({sort, order, start, end, filters})
        });
        
        const data = await getUser.json();
        return data.data;
    } catch (err) {
        console.error("Error fetching :", err);
        return [];
    }
}

type propTypeUserPenulis = {
    sort?: string | null,
    order?: "DESC" | "ASC",
    start?: number | null,
    end?: number | null,
    filters?: object | null,
}

export async function semuaUserPenulis({sort = null, order = "DESC", start = null, end = null, filters = null}: propTypeUserPenulis) {
    try {
        const getUser = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/penulis`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json", 
                "X-HTTP-Method-Override": "GET", 
            },
            body: JSON.stringify({sort, order, start, end, filters})
        });
        
        const data = await getUser.json();
        return data.data;
    } catch (err) {
        console.error("Error fetching :", err);
        return [];
    }
}


export async function byIdUser({id, token}: {id: number, token: string}) {
    try {
        const getUser = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${id}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json", 
                "Authorization": `Bearer ${token}`
            },
        });
        
        const data = await getUser.json();
        return data.data;
    } catch (err) {
        console.error("Error fetching :", err);
        return [];
    }
}

type PropTypeBuatUser = {
    name: string;
    email: string;
    password: string;
    role_id: number;
    profil?: string | ArrayBuffer | null;
    token: string
}

export async function createUser({name, email, password, role_id, profil, token}: PropTypeBuatUser) {
    try {
        const createUser = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({name, email, password, role_id, profil})
        });
        
        const data = await createUser.json();

        return data;
    } catch (error) {
        console.error("Error fetching :", error);
    }
}

type PropTypeEditUser = {
    name?: string;
    email?: string;
    role_id?: number;
    profil?: string | ArrayBuffer | null;
    token: string,
    id: number
}

export async function editUser({name, email, role_id, profil, token, id}: PropTypeEditUser) {
    try {
        const editUser = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({name, email, role_id, profil})
        });
        
        const data = await editUser.json();
        return data;
    } catch (error) {
        console.error("Error fetching :", error);
    }
}

export async function deleteUser({id, token}: {id: number, token: string}) {
    try {
        const deleteUser = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${id}`, {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        
        const data = await deleteUser.json();
        return data;
    } catch (error) {
        console.error("Error fetching :", error);
    }
}
