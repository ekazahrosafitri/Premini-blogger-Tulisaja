"use client"

type propTypeArtikel = {
    sort?: string | null,
    order?: "DESC" | "ASC",
    start?: number | null,
    end?: number | null,
    filters?: object | null,
    fixfilters?: object | null,
    limit?: number | null,
}

export async function semuaArtikel({sort = null, order = "DESC", start = null, end = null, filters = null, fixfilters = null}: propTypeArtikel) {
    try {
        const getArtikel = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/artikel`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json", 
                "X-HTTP-Method-Override": "GET" 
            },
            body: JSON.stringify({sort, order, start, end, filters, fixfilters})
        });
        
        const data = await getArtikel.json();
        return data.data;
    } catch (err) {
        console.error("Error fetching :", err);
        return [];
    }
}


export async function trendingArtikel({limit, filters}: propTypeArtikel) {
    try {
        const getArtikel = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/artikel`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json", 
                "X-HTTP-Method-Override": "GET" 
            },
            body: JSON.stringify({limit, filters})
        });
        
        const data = await getArtikel.json();
        return data.data;
    } catch (err) {
        console.error("Error fetching :", err);
        return [];
    }
}

export async function populerArtikel({limit, filters}: propTypeArtikel) {
    try {
        const getArtikel = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/artikel`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json", 
                "X-HTTP-Method-Override": "GET" 
            },
            body: JSON.stringify({limit, filters})
        });
        
        const data = await getArtikel.json();
        return data.data;
    } catch (err) {
        console.error("Error fetching :", err);
        return [];
    }
}

export async function byIdArtikel({id}: {id: number}) {
    try {
        const getArtikel = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/artikel/${id}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json", 
            },
        });
        
        const data = await getArtikel.json();
        return data;
    } catch (err) {
        console.error("Error fetching :", err);
        return [];
    }
}

type PropTypeBuatArtikel = {
    judul_artikel: string;
    isi: string;
    user_id: number;
    kategori_id: number;
    tags: number[];
    banner: string | ArrayBuffer | null;
    token: string
}

export async function createArtikel({judul_artikel, isi, user_id, kategori_id, tags, banner, token}: PropTypeBuatArtikel) {
    try {
        const createArtikel = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/artikel`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({judul_artikel, isi, user_id, kategori_id, tags, banner})
        });
        
        const data = await createArtikel.json();
        return data;
    } catch (error) {
        console.error("Error fetching :", error);
    }
}

type PropTypeEditArtikel = {
    judul_artikel?: string,
    isi?: string,
    user_id?: number,
    kategori_id?: number,
    tags?: number[],
    banner?: string | ArrayBuffer | null,
    token: string,
    id: number
}

export async function editArtikel({judul_artikel, isi, user_id, kategori_id, tags, banner, token, id}: PropTypeEditArtikel) {
    try {
        const editArtikel = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/artikel/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({judul_artikel, isi, user_id, kategori_id, tags, banner})
        });
        
        const data = await editArtikel.json();
        return data;
    } catch (error) {
        console.error("Error fetching :", error);
    }
}

export async function deleteArtikel({id, token}: {id: number, token: string}) {
    try {
        const deleteArtikel = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/artikel/${id}`, {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        
        const data = await deleteArtikel.json();
        return data;
    } catch (error) {
        console.error("Error fetching :", error);
    }
}
