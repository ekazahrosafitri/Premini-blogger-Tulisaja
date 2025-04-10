"use client"
type PropTypeTag = {
    sort?: string | null,
    order?: "DESC" | "ASC",
    start?: number | null,
    end?: number | null,
    filters?: object | null,
    limit?: number | null,
}

export async function semuaTag({sort = null, order = "DESC", start = null, end = null, filters = null}: PropTypeTag) {
    try {
        const getTag = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tag`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json", 
                "X-HTTP-Method-Override": "GET", 
            },
            body: JSON.stringify({sort, order, start, end, filters})
        });
        
        const data = await getTag.json();
        return data.data;
    } catch (err) {
        console.error("Error fetching :", err);
        return [];
    }
}


export async function byIdTag({id}: {id: number}) {
    try {
        const getTag = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tag/${id}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json", 
            },
        });
        
        const data = await getTag.json();
        return data.data;
    } catch (err) {
        console.error("Error fetching :", err);
        return [];
    }
}

type PropTypeBuatTag = {
    tag: string;
    token: string
}

export async function createTag({tag, token}: PropTypeBuatTag) {
    try {
        const createTag = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tag`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({tag})
        });
        
        const data = await createTag.json();
        return data;
    } catch (error) {
        console.error("Error fetching :", error);
    }
}

type PropTypeEditTag = {
    tag?: string,
    token: string,
    id: number
}

export async function editTag({tag, token, id}: PropTypeEditTag) {
    try {
        const editTag = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tag/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({tag})
        });
        
        const data = await editTag.json();
        return data;
    } catch (error) {
        console.error("Error fetching :", error);
    }
}

export async function deleteTag({id, token}: {id: number, token: string}) {
    try {
        const deleteTag = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tag/${id}`, {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        
        const data = await deleteTag.json();
        return data;
    } catch (error) {
        console.error("Error fetching :", error);
    }
}
