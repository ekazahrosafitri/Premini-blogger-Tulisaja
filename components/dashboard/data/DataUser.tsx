"use client"

import { useState, useEffect } from "react";
import { semuaUser, deleteUser, createUser, byIdUser, editUser } from "@/lib/backend/User";
import { LoadingText, LoadingCircle } from "@/components/ui/Loading";
import { RefreshCcw, Edit, Trash2 } from "lucide-react";
import Helper from '@/lib/Helper';
import { UserType, UserLogin, RoleType } from '@/lib/typedata';
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
import { semuaRole } from "@/lib/backend/Role";
import {z} from "zod";
import Image from "next/image";

export const userValidationCreate = (validRoleIDs: string[]) =>
  z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    role: z.string().refine((val) => validRoleIDs.includes(val), {
      message: "Role ID tidak valid",
    }),
    profilePhoto: z
      .instanceof(File, { message: "File tidak valid" })
      .refine((file) => ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type), {
        message: "Foto profil harus JPG, PNG, JPEG, atau WEBP",
    }),
});

export const userValidationEdit = (validRoleIDs: string[]) =>
  z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    role: z.string().refine((val) => validRoleIDs.includes(val), {
      message: "Role ID tidak valid",
    }),
    profilePhoto: z
    .union([
      z.instanceof(File).refine(
        (file) => ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file?.type || ""),
        { message: "Foto profil harus JPG, PNG, JPEG, atau WEBP" }
      ),
      z.literal(undefined),
      z.literal(null),
    ]),
});

export default function DataUser({user} : {user: UserLogin}) {
    const route = useRouter();
    const [userData, setUserData] = useState<UserType[] | []>([]);
    const [loadingPage, setLoadingPage] = useState(true);
    const [token, setToken] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [errorForm, setErrorForm] = useState<string>("");
    const [sukses, setSukses] = useState<string>("");
    const timeDeleteAlert = 5000;
    const [alertCountdown, setAlertCountdown] = useState<number>(0);
    const [open, setOpen] = useState(false);
    const showAdminAccountDefault = false;
    const adminAccountDefaultID = 1;
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      role: "",
      profilePhoto: null as File | null,
      previewPhoto: "",
    });
    const [loadingRole, setLoadingRole] = useState(false)
    const [roles, setRoles] = useState<RoleType[] | []>([]);
    const [validRoles, setValidRoles] = useState<number[]>([])
    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
    const [modalType, setModalType] = useState<"create" | "update">("create");
    const [idData, setIddata] = useState<number>(0);
    const [loadingSave, setLoadingSave] = useState(false);
    const [openEditLoading, setOpenEditLoading] = useState(false);
    
    useEffect(() => {
      if(user == null) route.push("/login");
    }, [user])

    async function fetchDataUser(tokenAccess: string) {
        setLoadingPage(true); 
        const data = await semuaUser({token: tokenAccess}); 
        setUserData(data); 
        setLoadingPage(false); 
    }

    async function fetchDataRole(tokenAccess: string) {
      setLoadingRole(true);
      const data = await semuaRole({token: tokenAccess}); 
      const roleId = data.map((role: RoleType) => role.id)
      setValidRoles(roleId);
      setRoles(data)
      setLoadingRole(false);
    }

    useEffect(() => {
      if(open && token) {
        fetchDataRole(token);
      }

      if(open == false) {
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "",
          profilePhoto: null,
          previewPhoto: "",
        });
        setErrorMessages({});
        setErrorForm('')
        setModalType("create")
      }
    }, [open, token])

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
            fetchDataUser(token);
          } else {
            route.push("/login");
          }
        }

        fetchToken();
    }, [])

    async function handleDelete(id: number) {
      if(confirm("Apakah Anda Yakin Ingin Menghapus User Ini?")) {
        const deluser = await deleteUser({id, token})

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

        fetchDataUser(token);
      }
    }
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setFormData({
          ...formData,
          profilePhoto: file,
          previewPhoto: URL.createObjectURL(file),
        }); 
      }
    };
  
    const handleSubmitForm = async (e: React.FormEvent) => {
      e.preventDefault();
      const validRolesNumber = validRoles.map(String);
      setLoadingSave(true);

      if(modalType == "create") {
        const schema = userValidationCreate(validRolesNumber);
        const result = schema.safeParse(formData);

        if(!result.success) {
          const errors = result.error.flatten().fieldErrors;
          setErrorMessages(Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value?.[0] || ""])));
          setLoadingSave(false);
          return;
        }

        const image = await Helper.convertImageToBase64(result.data.profilePhoto);      
        const dataSend = {
          name: result.data.name,
          email: result.data.email,
          password: result.data.password,
          profil: image,
          role_id: Number(result.data.role),
          token: token
        }

        const fetchCreateUser = await createUser(dataSend);

        if(fetchCreateUser.errors !== undefined || fetchCreateUser.status == false || fetchCreateUser.success == false) {
          setErrorForm(fetchCreateUser.message || fetchCreateUser.pesan || "Error Tidak Diketahui");
          setLoadingSave(false);
          return;
        }

        setSukses(fetchCreateUser.pesan);
        setAlertCountdown(timeDeleteAlert / 1000);
        setTimeout(() => {
          setSukses("");
          setAlertCountdown(0);
        }, timeDeleteAlert);

      } else if(modalType == "update") {
        const schema = userValidationEdit(validRolesNumber);
        const result = schema.safeParse(formData);

        if(!result.success) {
          const errors = result.error.flatten().fieldErrors;
          setErrorMessages(Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value?.[0] || ""])));
          return;
        }

        const image = result.data.profilePhoto ? await Helper.convertImageToBase64(result.data.profilePhoto) : null;     
        const dataSend = {
          name: result.data.name,
          email: result.data.email,
          role_id: Number(result.data.role),
          token: token,
          id: idData,
          ...(image !== null && { profil: image })
        }

        const fetchEditUser = await editUser(dataSend);

        if(fetchEditUser.errors !== undefined || fetchEditUser.status == false || fetchEditUser.success == false) {
          setErrorForm(fetchEditUser.message || fetchEditUser.pesan || "Error Tidak Diketahui");
          setLoadingSave(false);
          return;
        }

        setSukses(fetchEditUser.pesan || "Berhasil Edit Data User");
        setAlertCountdown(timeDeleteAlert / 1000);
        setTimeout(() => {
          setSukses("");
          setAlertCountdown(0);
        }, timeDeleteAlert);

      } else {
        console.error("Mode Tidak Diketahui");
      }
      
      setLoadingSave(false);
      setOpen(false);
      fetchDataUser(token);
    };

    async function handleEditClick(id: number) {
      setIddata(id)
      setOpenEditLoading(true);
      const user: UserType = await byIdUser({id, token});
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: String(user.role_id),
        profilePhoto: null,
        previewPhoto: process.env.NEXT_PUBLIC_BASE_URL_IMAGE + user.profil
      })
      
      setModalType("update");
      setOpen(true);
      setOpenEditLoading(false);
    }

    return (
        <div className="p-2 md:p-4">
          {/* Header Table */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
            <h2 className="text-xl font-semibold">Data User</h2>
            <div className="flex items-center gap-x-2 w-full md:w-auto">
              <button 
                onClick={() => fetchDataUser(token)} 
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 h-10 rounded-md transition flex-shrink-0"
              >
                <RefreshCcw size={18}/>
              </button>
              
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 h-10 rounded-md transition flex-1 md:flex-none text-sm md:text-base" 
                  >
                    Buat User
                  </Button>
                </DialogTrigger>

                <DialogContent className="text-gray-100 bg-gray-800 border-gray-700 max-w-[95%] md:max-w-[80%] lg:max-w-[50%] rounded-lg">
                  <DialogHeader>
                    <DialogTitle className="text-lg">{modalType == "create" ? "Tambah User Baru" : "Edit Data User"}</DialogTitle>
                  </DialogHeader>

                  {/* Form */}
                  <form onSubmit={handleSubmitForm}>
                    {errorForm != "" && 
                    <div className="bg-red-500/10 px-3 py-2 rounded mb-2 text-sm">
                      {errorForm} {alertCountdown > 0 && `(${alertCountdown}s)`}
                    </div>}
                    <div className="space-y-4 px-1 max-h-[60vh] overflow-y-auto">
                      {/* Nama */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Nama</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          autoComplete="off"
                        />
                        {errorMessages.name && <p className="text-red-400 mt-1 text-sm">{errorMessages.name}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          autoComplete="off"
                        />
                        {errorMessages.email && <p className="text-red-400 mt-1 text-sm">{errorMessages.email}</p>}
                      </div>

                      {/* Password */}
                      {modalType == "create" && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Password</label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            autoComplete="off"
                          />
                          {errorMessages.password && <p className="text-red-400 mt-1 text-sm">{errorMessages.password}</p>}
                        </div>
                      )}

                      {/* Role Select */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">{loadingRole ? "Memuat..." : "Pilih Role"}</option>
                          {roles && roles.map((role, index) => (
                            <option key={index} value={role.id}>
                              {role.role}
                            </option>
                          ))}
                        </select>
                        {errorMessages.role && <p className="text-red-400 mt-1 text-sm">{errorMessages.role}</p>}
                      </div>

                      {/* Upload Foto Profil */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Foto Profil</label>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoChange} 
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                        {formData.previewPhoto && (
                          <div className="mt-2">
                            <img 
                              src={formData.previewPhoto} 
                              alt="Preview" 
                              className="w-32 h-32 object-cover rounded-md border border-gray-600"
                            />
                          </div>
                        )}
                        {errorMessages.profilePhoto && <p className="text-red-400 mt-1 text-sm">{errorMessages.profilePhoto}</p>}
                      </div>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
                      <DialogClose asChild>
                        <Button 
                          variant="outline" 
                          className="bg-gray-700 hover:bg-gray-600 text-white transition w-full sm:w-auto"
                        >
                          Batal
                        </Button>
                      </DialogClose>
                      <Button 
                        type="submit" 
                        disabled={loadingSave} 
                        className="bg-blue-600 hover:bg-blue-700 transition w-full sm:w-auto"
                      >
                        {loadingSave ? <LoadingCircle className="mr-2"/> : null} 
                        Simpan
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
    
          {/* Table */}
          <div className="overflow-x-auto p-2 md:p-4 rounded-lg shadow-lg bg-gray-800">
            {error != "" && 
              <div className="bg-red-500/10 px-3 py-2 rounded mb-2 text-sm">{error} {alertCountdown > 0 && `(${alertCountdown}s)`}</div>}
            {sukses != "" && 
              <div className="bg-green-500/10 px-3 py-2 rounded mb-2 text-sm">{sukses} {alertCountdown > 0 && `(${alertCountdown}s)`}</div>}
            
            <div className="min-w-full">
              <table className="w-full border-collapse">
                {/* Table Head */}
                <thead>
                  <tr className="bg-gray-700 text-left">
                    <th className="px-2 py-2 md:px-4 md:py-3 text-sm md:text-base">No.</th>
                    <th className="px-2 py-2 md:px-4 md:py-3 text-sm md:text-base">Nama</th>
                    <th className="px-2 py-2 md:px-4 md:py-3 text-sm md:text-base">Email</th>
                    <th className="px-2 py-2 md:px-4 md:py-3 text-sm md:text-base">Role</th>
                    <th className="px-2 py-2 md:px-4 md:py-3 text-sm md:text-base">Aksi</th>
                  </tr>
                </thead>
    
                {/* Table Body */}
                <tbody>
                  {loadingPage ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        <LoadingText text="Memuat..."/>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {userData.length > 0 ? 
                        userData
                        .filter(userD => showAdminAccountDefault || userD.id != adminAccountDefaultID)
                        .map((userD, no_index) => (
                          <tr key={userD.id} className="border-t border-gray-600 hover:bg-gray-700/50 transition">
                            <td className="px-2 py-2 md:px-4 md:py-3 text-sm md:text-base">{no_index + 1}</td>
                            <td className="px-2 py-2 md:px-4 md:py-3 text-sm md:text-base">
                              <div className="flex items-center gap-2">
                                <Image 
                                  alt="Image Profile User" 
                                  src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${userD.profil}`} 
                                  width={30} 
                                  height={30}
                                  className="rounded-full object-cover w-[30px] h-[30px]"
                                />
                                {Helper.potongText(userD.name, window.innerWidth < 640 ? 10 : 20)}
                              </div>
                            </td>
                            <td className="px-2 py-2 md:px-4 md:py-3 text-sm md:text-base">
                              {Helper.potongText(userD.email, window.innerWidth < 640 ? 15 : 20)}
                            </td>
                            <td className="px-2 py-2 md:px-4 md:py-3 text-sm md:text-base">
                              {userD.role?.role}
                            </td>
                            <td className="px-2 py-2 md:px-4 md:py-3 text-sm md:text-base">
                              <div className="flex items-center gap-1">
                                <button
                                  disabled={openEditLoading} 
                                  className="flex items-center bg-green-600 hover:bg-green-700 p-1 md:px-2 md:py-1 rounded mr-1 md:mr-2 text-xs md:text-sm"
                                  onClick={() => handleEditClick(userD.id)}
                                >
                                  {(openEditLoading && userD.id == idData) ? (
                                    <LoadingCircle className="mr-1 border-gray-300"/>
                                  ) : (
                                    <Edit size={14} className="md:mr-1"/>
                                  )}
                                  <span className="hidden md:inline">Edit</span>
                                </button>
                                <button
                                  className="flex items-center bg-red-600 hover:bg-red-700 p-1 md:px-2 md:py-1 rounded text-xs md:text-sm"
                                  onClick={() => handleDelete(userD.id)}
                                >
                                  <Trash2 size={14} className="md:mr-1"/>
                                  <span className="hidden md:inline">Hapus</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                        <tr>
                          <td colSpan={5} className="text-center py-4">Data User Tidak Ada</td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    );
}