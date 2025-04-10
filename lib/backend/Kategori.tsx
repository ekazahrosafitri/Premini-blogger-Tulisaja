"use client"
type PropTypeKategori = {
    sort?: string | null,
    order?: "DESC" | "ASC",
    start?: number | null,
    end?: number | null,
    filters?: object | null,
    limit?: number | null,
}

export async function semuaKategori({sort = null, order = "DESC", start = null, end = null, filters = null}: PropTypeKategori) {
    try {
        const getKategori = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/kategori`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json", 
                "X-HTTP-Method-Override": "GET", 
            },
            body: JSON.stringify({sort, order, start, end, filters})
        });
        
        const data = await getKategori.json();
        return data.data;
    } catch (err) {
        console.error("Error fetching :", err);
        return [];
    }
}


export async function byIdKategori({id}: {id: number}) {
    try {
        const getKategori = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/kategori/${id}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json", 
            },
        });
        
        const data = await getKategori.json();
        return data.data;
    } catch (err) {
        console.error("Error fetching :", err);
        return [];
    }
}

type PropTypeBuatKategori = {
    kategori: string;
    token: string
}

export async function createKategori({kategori, token}: PropTypeBuatKategori) {
    try {
        const createKategori = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/kategori`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({kategori})
        });
        
        const data = await createKategori.json();
        return data;
    } catch (error) {
        console.error("Error fetching :", error);
    }
}

type PropTypeEditKategori = {
    kategori?: string,
    token: string,
    id: number
}

export async function editKategori({kategori, token, id}: PropTypeEditKategori) {
    try {
        const editKategori = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/kategori/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({kategori})
        });
        
        const data = await editKategori.json();
        return data;
    } catch (error) {
        console.error("Error fetching :", error);
    }
}

export async function deleteKategori({id, token}: {id: number, token: string}) {
    try {
        const deleteKategori = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/kategori/${id}`, {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        
        const data = await deleteKategori.json();
        return data;
    } catch (error) {
        console.error("Error fetching :", error);
    }
}
