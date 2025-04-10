"use client"

import { useState, useEffect } from "react";
import { LoadingText, LoadingCircle } from "@/components/ui/Loading";
import { RefreshCcw } from "lucide-react";
import Helper from '@/lib/Helper';
import { UserLogin, TagsType } from '@/lib/typedata';
import { Token } from "@/lib/Authenticate";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { semuaTag, deleteTag, createTag, editTag, byIdTag } from "@/lib/backend/Tag";
import {z} from "zod";

const tagValidation = () => z.object({
  tag: z.string().min(3, "Minimal terdiri dari 3 huruf").refine((val) => /^#/.test(val), {
    message: "Harus diawali dengan tanda #",
  }),
});

export default function DataTag({user} : {user: UserLogin}) {
    const route = useRouter();
    const [tagData, setTagData] = useState<TagsType[] | []>([]);
    const [loadingPage, setLoadingPage] = useState(true);
    const [token, setToken] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [sukses, setSukses] = useState<string>("");
    const timeDeleteAlert = 5000; // 5 detik
    const [alertCountdown, setAlertCountdown] = useState<number>(0);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
      tag: "",
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
          tag: "",
        });
        setErrorMessages({});
        setErrorForm('')
        setModalType("create")
      }
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function fetchDataTag() {
        setLoadingPage(true); 
        const data = await semuaTag({}); 
        setTagData(data); 
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
            fetchDataTag();
          } else {
            route.push("/login");
          }
        }

        fetchToken();
        
    }, [])


    async function handleDelete(id: number) {
      if(confirm("Apakah Anda Yakin Ingin Menghapus Tag Ini?")) {
        const deluser = await deleteTag({id, token})

        if(deluser.succes) {
          setSukses(deluser.pesan);
          setAlertCountdown(timeDeleteAlert / 1000);
          setTimeout(() => {
            setSukses("");
            setAlertCountdown(0);
          }, timeDeleteAlert);

        } else {
          setError(deluser.pesan);
          setAlertCountdown(timeDeleteAlert / 1000);
          setTimeout(() => {
            setError("");
            setAlertCountdown(0);
          }, timeDeleteAlert);
        }

        fetchDataTag();

      }
    }

    async function handleSubmitForm(e: React.FormEvent) {
      e.preventDefault();
      setLoadingSave(true);
      const validation = tagValidation().safeParse(formData);

      if(!validation.success) {
        const errors = validation.error.flatten().fieldErrors;
        setErrorMessages(Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value?.[0] || ""])));
        setLoadingSave(false);
        return;
      }

      if(modalType == "create") {
        const fetchCreateTag = await createTag({tag: validation.data.tag, token: token});

        if(fetchCreateTag.errors !== undefined || fetchCreateTag.status == false || fetchCreateTag.success == false) {
          setErrorForm(fetchCreateTag.message || fetchCreateTag.pesan || "Error Tidak Diketahui");
          setLoadingSave(false);
          return;
        }

        setSukses(fetchCreateTag.pesan);
        setAlertCountdown(timeDeleteAlert / 1000);
        setTimeout(() => {
          setSukses("");
          setAlertCountdown(0);
        }, timeDeleteAlert);

      } else if(modalType == "update") {
        const fetchEditTag = await editTag({tag: validation.data.tag, token, id: idData})
        if(fetchEditTag.errors !== undefined || fetchEditTag.status == false || fetchEditTag.success == false) {
          setErrorForm(fetchEditTag.message || fetchEditTag.pesan || "Error Tidak Diketahui");
          setLoadingSave(false);
          return;
        }

        setSukses(fetchEditTag.pesan);
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
      fetchDataTag();
    }

    async function handleEdit(id: number) {
      setIddata(id)
      setOpenEditLoading(true);
      const tag: TagsType = await byIdTag({id});
      setFormData({
        tag: tag.tag
      })
      setModalType("update");
      setOpen(true);
      setOpenEditLoading(false);
    }

    

    return (
        <div>
          {/* Header Table */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Data User</h2>
            <div className="flex items-center gap-x-3 flex-row-reverse">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 h-10 rounded-md transition" style={{borderRadius: "5px"}}>Buat Tag</Button>
                </DialogTrigger>

                <DialogContent className="text-gray-100 bg-black/90" style={{borderRadius: "10px"}}>
                  <DialogHeader>
                    <DialogTitle>{modalType == "create" ? "Tambah Tag Baru" : "Edit Data Tag"}</DialogTitle>
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
                        <label className="block text-sm font-medium">Role</label>
                        <input
                          type="text"
                          name="tag"
                          value={formData.tag}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md bg-gray-800 text-white"
                          autoComplete="off"
                          style={{
                            borderRadius: "5px"
                          }}
                        />
                        {errorMessages.tag && <p className="text-red-400 mt-1 text-sm">{errorMessages.tag}</p>}
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

              <button onClick={fetchDataTag} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 h-10 rounded-md transition" style={{borderRadius: "5px"}}>
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
                  <th className="px-4 py-3">Tag</th>
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
                      {tagData.length > 0 && tagData ? 
                      tagData
                      .map((tagD, no_index) => (
                        <tr key={tagD.id} className="border-t border-gray-600 hover:bg-gray-500/10 transition">
                          <td className="px-4 py-3">{no_index + 1}</td>
                          <td className="px-4 py-3">{Helper.potongText(tagD.tag, 20)}</td>
                          <td className="px-4 py-3">{tagD.artikels.length}</td>
                          <td className="px-4 py-3 flex items-center">
                            <button disabled={openEditLoading} className="flex justify-center items-center bg-green-600 hover:bg-green-700 px-3 py-1 rounded mr-2" onClick={() => handleEdit(tagD.id)}>{(openEditLoading && tagD.id == idData) && <LoadingCircle className={"mr-1 border-gray-300"}/>} Edit</button>
                            <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded" onClick={() => handleDelete(tagD.id)}>Hapus</button>
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