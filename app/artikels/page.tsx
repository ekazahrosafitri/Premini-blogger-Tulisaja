"use client"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useState, useEffect } from "react"
import { LoadingText } from "@/components/ui/Loading"
import Image from "next/image"
import Helper from "@/lib/Helper"
import { ArtikelType, KategoriType } from "@/lib/typedata"
import { semuaArtikel } from "@/lib/backend/Artikel"
import { Search } from "lucide-react"
import { semuaKategori } from "@/lib/backend/Kategori"
import { useSearchParams, useRouter } from "next/navigation"


function ArtikelsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loadingGetArtikel, setLoadingGetArtikel] = useState(false);
    const [dataArtikel, setDataArtikel] = useState<ArtikelType[] | []>([]);
    const [loadingKategori, setLoadingKategori] = useState(false);
    const [dataKategori, setDataKategori] = useState<KategoriType[]>([]);
    const [kategoriSelect, setKategoriSelect] = useState<number | "">("");
    const [searchJudul, setSearchJudul] = useState<string>("");
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
    const [isClient, setIsClient] = useState(false)

    async function fetchDataArtikel(judul_artikel: string = "", kategori_id: number | "" = "") {
        setLoadingGetArtikel(true); 

        let artikels: ArtikelType[] | [] = [];
        if(kategori_id != "") {
            artikels = await semuaArtikel({filters: {judul_artikel}, fixfilters: {kategori_id}}); 
        } else {
            artikels= await semuaArtikel({filters: {judul_artikel}}); 
        }
        setDataArtikel(artikels);
        
        setLoadingGetArtikel(false);
    }

    async function fetchDataKategori() {
        setLoadingKategori(true); 
        const kategoris: KategoriType[] | [] = await semuaKategori({}); 
        setDataKategori(kategoris);
        
        setLoadingKategori(false);
    }

    // Ambil nilai dari URL saat pertama kali render
    useEffect(() => {
        setIsClient(true)
        const qParam = searchParams.get("q") || ""
        const kategoriParam = searchParams.get("kategori") || ""
        setSearchJudul(qParam)
        setKategoriSelect(parseInt(kategoriParam) || "")

        if(kategoriSelect != "") {
            fetchDataArtikel(searchJudul, kategoriSelect);
        } else {
            fetchDataArtikel(searchJudul);
        }
    }, [searchParams]) // hanya sekali saat mount

    useEffect(() => {
        // Clear timeout sebelumnya
        if (typingTimeout) {
            clearTimeout(typingTimeout)
        }
    
        // Delay 400ms sebelum fetch (debounce manual)
        const timeout = setTimeout(() => {
            if(kategoriSelect != "") {
                router.push("/artikels?q=" + searchJudul + "&kategori=" + kategoriSelect)
            } else {
                fetchDataArtikel(searchJudul);
            }
        }, 400)
    
        setTypingTimeout(timeout)
    
        // Cleanup kalau component unmount atau query berubah lagi
        return () => clearTimeout(timeout)

    }, [kategoriSelect, searchJudul])

    useEffect(() => {
        
        fetchDataKategori();
        fetchDataArtikel();
    }, [])

    if (!isClient) return null

    return (
        <div className="app">
            <Header />
            <main className="main-content">
            <div className="p-5">
                <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4">Data Artikel</h2>
                    <div className="flex items-center gap-x-3">

                        <input
                            type="text"
                            name="judul_artikel"
                            value={searchJudul}
                            onChange={(e) => {
                                setSearchJudul(e.target.value);
                            }}
                            className="w-[300px] p-2 border rounded-md bg-gray-800 text-white"
                            autoComplete="off"
                            style={{
                            borderRadius: "5px"
                            }}
                        />

                        <select
                            name="kategori_id"
                            value={kategoriSelect}
                            onChange={(e) => {
                                setKategoriSelect(parseInt(e.target.value));
                            }}
                            className="w-[150px] p-2 border rounded-md bg-gray-800 text-white"
                            style={{
                            borderRadius: "5px"
                            }}
                        >
                            <option value="">{loadingKategori ? "Memuat..." : "Pilih Kategori"}</option>
                            {dataKategori && dataKategori.map((kategori, index) => (
                            <option key={index} value={kategori.id}>
                                {kategori.kategori}
                            </option>
                            ))}
                        </select>

                        {/* <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 h-10 rounded-md transition" style={{borderRadius: "5px"}}>
                            <Search size={18}/>
                        </button> */}
                    </div>
                </div>

                <div className="mt-10">
                    {loadingGetArtikel ? <LoadingText text="Memuat Data Artikel..."/> : (
                        <div>
                            {dataArtikel && dataArtikel.length != 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4">
                                    {dataArtikel.map((item, i) => (
                                        <a href={`/detailartikel/${item.id}`} key={i} className="bg-[#222222] text-white rounded-2xl shadow-md overflow-hidden flex flex-col relative">
                                            {/* Gambar */}
                                            <Image
                                            src={process.env.NEXT_PUBLIC_BASE_URL_IMAGE + item.banner || "/artikels/artikel.jpeg"}
                                            alt={item.judul_artikel}
                                            width={300}
                                            height={200}
                                            className="w-full h-48 object-cover"
                                            // layout="responsive"
                                            />

                                            {/* Isi Card */}
                                            <div className="p-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-1">{Helper.potongText(item.judul_artikel, 30)}</h3>
                                                <h6 className="text-sm font-medium mb-1">Kategori : {item.kategori?.kategori}</h6>
                                                <p className="text-sm text-gray-300">{Helper.potongText(Helper.hilangkanHTMLTAG(item.isi), 50)}</p>
                                                <span className="text-gray-100 text-[12px] font-semibold">{Helper.dateConvert(item.created_at)}</span>
                                            </div>
                                            </div>
                                        </a>
                                    ))}
                            </div>
                            ) : (
                                <div className="text-center text-lg font-bold text-nowrap">Data Artikel Tidak Ada</div>
                            )}
                            
                        </div>
                    )}
                </div>
            </div>
            </main>
            <Footer />
        </div>
    )
}

export default ArtikelsPage
