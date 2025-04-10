const dateConvert = (date: string) => {
    const dateObj = new Date(date);
    
    // Konversi ke zona waktu Asia/Jakarta
    const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "long", // Nama bulan lengkap
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Format 24 jam
    };

    // Format tanggal dengan nama bulan dalam bahasa Indonesia
    const formattedDate = new Intl.DateTimeFormat("id-ID", options).format(dateObj);

    return formattedDate.replace(" ", " - ").replace(/\./g, ":");
}

const potongText = (text: string, panjang: number) => {
    const isPanjang = text.length > panjang;
    const display = isPanjang ? text.slice(0, panjang) + "..." : text;

    return display;
}

const hilangkanHTMLTAG = (html: string): string => {
    return html.replace(/<[^>]*>?/gm, ""); 
};

const convertImageToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const Helper = {
    dateConvert,
    potongText,
    hilangkanHTMLTAG,
    convertImageToBase64
}

export default Helper;