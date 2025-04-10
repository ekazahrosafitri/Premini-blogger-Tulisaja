"use client"
type PropTypeRole = {
    sort?: string | null,
    order?: "DESC" | "ASC",
    start?: number | null,
    end?: number | null,
    filters?: object | null,
    limit?: number | null,
    token: string
}

export async function semuaRole({sort = null, order = "DESC", start = null, end = null, filters = null, token}: PropTypeRole) {
    try {
        const getRole = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/role`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json", 
                "X-HTTP-Method-Override": "GET", 
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({sort, order, start, end, filters})
        });
        
        const data = await getRole.json();
        return data.data;
    } catch (err) {
        console.error("Error fetching :", err);
        return [];
    }
}


export async function byIdRole({id, token}: {id: number, token: string}) {
    try {
        const getRole = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/role/${id}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json", 
                "Authorization": `Bearer ${token}`
            },
        });
        
        const data = await getRole.json();
        return data.data;
    } catch (err) {
        console.error("Error fetching :", err);
        return [];
    }
}

type PropTypeBuatRole = {
    role: string;
    token: string
}

export async function createRole({role, token}: PropTypeBuatRole) {
    try {
        const createRole = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/role`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({role})
        });
        
        const data = await createRole.json();
        return data;
    } catch (error) {
        console.error("Error fetching :", error);
    }
}

type PropTypeEditRole = {
    role?: string,
    token: string,
    id: number
}

export async function editRole({role, token, id}: PropTypeEditRole) {
    try {
        const editRole = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/role/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({role})
        });
        
        const data = await editRole.json();
        return data;
    } catch (error) {
        console.error("Error fetching :", error);
    }
}

export async function deleteRole({id, token}: {id: number, token: string}) {
    try {
        const deleteRole = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/role/${id}`, {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        
        const data = await deleteRole.json();
        return data;
    } catch (error) {
        console.error("Error fetching :", error);
    }
}
