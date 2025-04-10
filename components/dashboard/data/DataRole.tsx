"use client"

import { useState, useEffect } from "react";
import { LoadingText } from "@/components/ui/Loading";
import { RefreshCcw } from "lucide-react";
import Helper from '@/lib/Helper';
import { RoleType, UserLogin } from '@/lib/typedata';
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
import { byIdRole, createRole, deleteRole, editRole, semuaRole } from "@/lib/backend/Role";
import {z} from "zod";
import { LoadingCircle } from '../../ui/Loading';

export const roleValidation = () => 
  z.object({
    role: z.string().min(3, "Minimal 3 Kata"),
  })


export default function DataRole({user} : {user: UserLogin}) {
    const route = useRouter();
    const [roleData, setRoleData] = useState<RoleType[] | []>([]);
    const [loadingPage, setLoadingPage] = useState(true);
    const [token, setToken] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [sukses, setSukses] = useState<string>("");
    const timeDeleteAlert = 5000; // 5 detik
    const [alertCountdown, setAlertCountdown] = useState<number>(0);
    const [open, setOpen] = useState(false);
    const showRoleAdmin = true;
    const adminRoleID = 2;
    const [formData, setFormData] = useState({
      role: "",
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
          role: "",
        });
        setErrorMessages({});
        setErrorForm('')
        setModalType("create")
      }
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function fetchDataRole(tokenAccess: string) {
        setLoadingPage(true); 
        const data = await semuaRole({token: tokenAccess}); 
        setRoleData(data); 
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
            fetchDataRole(token);
          } else {
            route.push("/login");
          }
        }

        fetchToken();
        
    }, [])


    async function handleDelete(id: number) {
      if(confirm("Apakah Anda Yakin Ingin Menghapus Role Ini?")) {
        const delRole = await deleteRole({id, token})

        if(delRole.succes) {
          setSukses(delRole.pesan);
          setAlertCountdown(timeDeleteAlert / 1000);
          setTimeout(() => {
            setSukses("");
            setAlertCountdown(0);
          }, timeDeleteAlert);

        } else {
          setError(delRole.pesan);
          setAlertCountdown(timeDeleteAlert / 1000);
          setTimeout(() => {
            setError("");
            setAlertCountdown(0);
          }, timeDeleteAlert);
        }

        fetchDataRole(token);

      }
    }

    async function handleSubmitForm(e: React.FormEvent) {
      e.preventDefault();
      setLoadingSave(true);
      const validation = roleValidation().safeParse(formData);

      if(!validation.success) {
        const errors = validation.error.flatten().fieldErrors;
        setErrorMessages(Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value?.[0] || ""])));
        setLoadingSave(false);
        return;
      }

      if(modalType == "create") {
        const fetchCreateRole = await createRole({role: validation.data.role, token: token});

        if(fetchCreateRole.errors !== undefined || fetchCreateRole.status == false || fetchCreateRole.success == false) {
          setErrorForm(fetchCreateRole.message || fetchCreateRole.pesan || "Error Tidak Diketahui");
          setLoadingSave(false);
          return;
        }

        setSukses(fetchCreateRole.pesan);
        setAlertCountdown(timeDeleteAlert / 1000);
        setTimeout(() => {
          setSukses("");
          setAlertCountdown(0);
        }, timeDeleteAlert);

      } else if(modalType == "update") {
        const fetchEditRole = await editRole({role: validation.data.role, token, id: idData})
        if(fetchEditRole.errors !== undefined || fetchEditRole.status == false || fetchEditRole.success == false) {
          setErrorForm(fetchEditRole.message || fetchEditRole.pesan || "Error Tidak Diketahui");
          setLoadingSave(false);
          return;
        }

        setSukses(fetchEditRole.pesan);
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
      fetchDataRole(token);
    }

    async function handleEdit(id: number) {
      setIddata(id)
      setOpenEditLoading(true);
      const role: RoleType = await byIdRole({id, token});
      setFormData({
        role: role.role
      })
      setModalType("update");
      setOpen(true);
      setOpenEditLoading(false);
    }

    

    return (
        <div>
          {/* Header Table */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Data Role</h2>
            <div className="flex items-center gap-x-3 flex-row-reverse">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 h-10 rounded-md transition" style={{borderRadius: "5px"}}>Buat Role</Button>
                </DialogTrigger>

                <DialogContent className="text-gray-100 bg-black/90" style={{borderRadius: "10px"}}>
                  <DialogHeader>
                    <DialogTitle>{modalType == "create" ? "Tambah Role Baru" : "Edit Data Role"}</DialogTitle>
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
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md bg-gray-800 text-white"
                          autoComplete="off"
                          style={{
                            borderRadius: "5px"
                          }}
                        />
                        {errorMessages.role && <p className="text-red-400 mt-1 text-sm">{errorMessages.role}</p>}
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

              <button onClick={() => fetchDataRole(token)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 h-10 rounded-md transition" style={{borderRadius: "5px"}}>
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
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Jumlah User</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
    
              {/* Table Body */}
              <tbody>
                {loadingPage ? (
                  <tr><td colSpan={5} className="text-center py-4"><LoadingText text="Memuat..."/></td></tr>
                  ) : (
                    <>
                      {roleData.length > 0 && roleData ? 
                      roleData
                      .filter(roleD => showRoleAdmin || roleD.id != adminRoleID)
                      .map((roleD, no_index) => (
                        <tr key={roleD.id} className="border-t border-gray-600 hover:bg-gray-500/10 transition">
                          <td className="px-4 py-3">{no_index + 1}</td>
                          <td className="px-4 py-3">{Helper.potongText(roleD.role, 20)}</td>
                          <td className="px-4 py-3">{roleD.users?.length}</td>
                          <td className="px-4 py-3 flex items-center">
                            <button disabled={openEditLoading} className="flex justify-center items-center bg-green-600 hover:bg-green-700 px-3 py-1 rounded mr-2" onClick={() => handleEdit(roleD.id)}>{(openEditLoading && roleD.id == idData) && <LoadingCircle className={"mr-1 border-gray-300"}/>} Edit</button>
                            <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded" onClick={() => handleDelete(roleD.id)}>Hapus</button>
                          </td>
                        </tr>
                      )) : <tr><td colSpan={5} className="text-center py-4">Data Role Tidak Ada</td></tr>}
                    </>
                  )}
              </tbody>
            </table>
            
          </div>
        </div>
      );
  }