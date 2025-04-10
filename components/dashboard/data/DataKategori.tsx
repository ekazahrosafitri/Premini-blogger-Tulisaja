"use client"

import { useState, useEffect } from "react";
import { LoadingText, LoadingCircle } from "@/components/ui/Loading";
import { RefreshCcw } from "lucide-react";
import Helper from '@/lib/Helper';
import { UserLogin, KategoriType } from '@/lib/typedata';
import { Token } from "@/lib/Authenticate";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { semuaKategori, deleteKategori, createKategori, editKategori, byIdKategori } from "@/lib/backend/Kategori";
import {z} from "zod";

export const kategoriValidation = () => 
  z.object({
    kategori: z.string().min(3, "Minimal 3 Kata"),
  })

export default function DataKategori({user} : {user: UserLogin}) {
    const route = useRouter();
    const [kategoriData, setKategoriData] = useState<KategoriType[] | []>([]);
    const [loadingPage, setLoadingPage] = useState(true);
    const [token, setToken] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [sukses, setSukses] = useState<string>("");
    const timeDeleteAlert = 5000; // 5 detik
    const [alertCountdown, setAlertCountdown] = useState<number>(0);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
      kategori: "",
    });
    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
    const [modalType, setModalType] = useState<"create" | "update">("create");
    const [idData, setIddata] = useState<number>(0);
    const [errorForm, setErrorForm] = useState<string>("");
    const [loadingSave, setLoadingSave] = useState(false);
    const [openEditLoading, setOpenEditLoading] = useState(false);

    useEffect(() => {
      if(user == null) route.push("/login");
    }, [user])

    useEffect(() => {
      if(open == false) {
        setFormData({
          kategori: "",
        });
        setErrorMessages({});
        setErrorForm('')
        setModalType("create")
      }
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function fetchDataKategori() {
        setLoadingPage(true); 
        const data = await semuaKategori({}); 
        setKategoriData(data); 
        setLoadingPage(false); 
    }

    useEffect(() => {
      if (alertCountdown > 0) {
        const timer = setTimeout(() => {
          setAlertCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, [alertCountdown]);

    useEffect(() => {
        async function fetchToken() {
          const token = await Token();
          if(token != "") {
            setToken(token);
            fetchDataKategori();
          } else {
            route.push("/login");
          }
        }

        fetchToken();
        
    }, [])


    async function handleDelete(id: number) {
      if(confirm("Apakah Anda Yakin Ingin Menghapus Kategori Ini?")) {
        const delkategori = await deleteKategori({id, token})

        if(delkategori.succes) {
          setSukses(delkategori.pesan);
          setAlertCountdown(timeDeleteAlert / 1000);
          setTimeout(() => {
            setSukses("");
            setAlertCountdown(0);
          }, timeDeleteAlert);

        } else {
          setError(delkategori.pesan);
          setAlertCountdown(timeDeleteAlert / 1000);
          setTimeout(() => {
            setError("");
            setAlertCountdown(0);
          }, timeDeleteAlert);
        }

        fetchDataKategori();

      }
    }

    async function handleSubmitForm(e: React.FormEvent) {
      e.preventDefault();
      setLoadingSave(true);
      const validation = kategoriValidation().safeParse(formData);

      if(!validation.success) {
        const errors = validation.error.flatten().fieldErrors;
        setErrorMessages(Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value?.[0] || ""])));
        setLoadingSave(false);
        return;
      }

      if(modalType == "create") {
        const fetchCreateKategori = await createKategori({kategori: validation.data.kategori, token: token});

        if(fetchCreateKategori.errors !== undefined || fetchCreateKategori.status == false || fetchCreateKategori.success == false) {
          setErrorForm(fetchCreateKategori.message || fetchCreateKategori.pesan || "Error Tidak Diketahui");
          setLoadingSave(false);
          return;
        }

        setSukses(fetchCreateKategori.pesan);
        setAlertCountdown(timeDeleteAlert / 1000);
        setTimeout(() => {
          setSukses("");
          setAlertCountdown(0);
        }, timeDeleteAlert);

      } else if(modalType == "update") {
        const fetchEditKategori = await editKategori({kategori: validation.data.kategori, token, id: idData})
        if(fetchEditKategori.errors !== undefined || fetchEditKategori.status == false || fetchEditKategori.success == false) {
          setErrorForm(fetchEditKategori.message || fetchEditKategori.pesan || "Error Tidak Diketahui");
          setLoadingSave(false);
          return;
        }

        setSukses(fetchEditKategori.pesan);
        setAlertCountdown(timeDeleteAlert / 1000);
        setTimeout(() => {
          setSukses("");
          setAlertCountdown(0);
        }, timeDeleteAlert);

      } else {
        console.error("Mode Tidak Diketahui")
      }

      setLoadingSave(false);
      setOpen(false);
      fetchDataKategori();
    }

    async function handleEdit(id: number) {
      setIddata(id)
      setOpenEditLoading(true);
      const kategori: KategoriType = await byIdKategori({id});
      setFormData({
        kategori: kategori.kategori
      })
      setModalType("update");
      setOpen(true);
      setOpenEditLoading(false);
    }

    

    return (
        <div>
          {/* Header Table */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Data Kategori</h2>
            <div className="flex items-center gap-x-3 flex-row-reverse">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 h-10 rounded-md transition" style={{borderRadius: "5px"}}>Buat Kategori</Button>
                </DialogTrigger>

                <DialogContent className="text-gray-100 bg-black/90" style={{borderRadius: "10px"}}>
                  <DialogHeader>
                    <DialogTitle>{modalType == "create" ? "Tambah Kategori Baru" : "Edit Data Kategori"}</DialogTitle>
                  </DialogHeader>

                  {/* Form */}
                  <form onSubmit={handleSubmitForm} className="">
                    {errorForm != "" && 
                    <div className="bg-red-400/30 w-full h-7 text-sm mb-2 flex p-2 items-center" style={{
                      borderRadius: "5px"
                    }}>{errorForm} {alertCountdown > 0 && `(${alertCountdown}s)`}</div>}
                    <div className="h-[120px] overflow-y-auto space-y-4 px-1">
                      {/* Nama */}
                      <div>
                        <label className="block text-sm font-medium">Kategori</label>
                        <input
                          type="text"
                          name="kategori"
                          value={formData.kategori}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md bg-gray-800 text-white"
                          autoComplete="off"
                          style={{
                            borderRadius: "5px"
                          }}
                        />
                        {errorMessages.kategori && <p className="text-red-400 mt-1 text-sm">{errorMessages.kategori}</p>}
                      </div>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="flex justify-between">
                      <DialogClose asChild>
                        <Button variant="outline" className="rounded bg-gray-700 hover:bg-gray-800 transition">
                          Batal
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={loadingSave} className="rounded bg-blue-700 hover:bg-blue-800 transition">
                        {loadingSave && <LoadingCircle/>} Simpan
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <button onClick={fetchDataKategori} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 h-10 rounded-md transition" style={{borderRadius: "5px"}}>
                <RefreshCcw size={18}/>
              </button>
            </div>
          </div>
    
          {/* Table */}
          <div className="overflow-x-auto p-4 rounded-lg shadow-lg">
            {error != "" && 
              <div className="bg-red-500/10 px-3 py-2 rounded mb-2 text-sm">{error} {alertCountdown > 0 && `(${alertCountdown}s)`}</div>}
            {sukses != "" && 
              <div className="bg-green-500/10 px-3 py-2 rounded mb-2 text-sm">{sukses} {alertCountdown > 0 && `(${alertCountdown}s)`}</div>}
            
            <table className="w-full border-collapse">
              {/* Table Head */}
              <thead>
                <tr className="bg-gray-700 text-left">
                  <th className="px-4 py-3">No.</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Jumlah Artikel</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
    
              {/* Table Body */}
              <tbody>
                {loadingPage ? (
                  <tr><td colSpan={5} className="text-center py-4"><LoadingText text="Memuat..."/></td></tr>
                  ) : (
                    <>
                      {kategoriData.length > 0 && kategoriData ? 
                      kategoriData
                      .map((kategoriD, no_index) => (
                        <tr key={kategoriD.id} className="border-t border-gray-600 hover:bg-gray-500/10 transition">
                          <td className="px-4 py-3">{no_index + 1}</td>
                          <td className="px-4 py-3">{Helper.potongText(kategoriD.kategori, 20)}</td>
                          <td className="px-4 py-3">{kategoriD.artikels?.length}</td>
                          <td className="px-4 py-3 flex items-center">
                            <button disabled={openEditLoading} className="flex justify-center items-center bg-green-600 hover:bg-green-700 px-3 py-1 rounded mr-2" onClick={() => handleEdit(kategoriD.id)}>{(openEditLoading && kategoriD.id == idData) && <LoadingCircle className={"mr-1 border-gray-300"}/>} Edit</button>
                            <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded" onClick={() => handleDelete(kategoriD.id)}>Hapus</button>
                          </td>
                        </tr>
                      )) : <tr><td colSpan={5} className="text-center py-4">Data User Tidak Ada</td></tr>}
                    </>
                  )}
              </tbody>
            </table>
            
          </div>
        </div>
      );
  }