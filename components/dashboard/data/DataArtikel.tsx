"use client"

import { useState, useEffect } from "react";
import { semuaArtikel, deleteArtikel, byIdArtikel } from "@/lib/backend/Artikel";
import { LoadingText, LoadingCircle } from "@/components/ui/Loading";
import { RefreshCcw, Edit, Trash2 } from "lucide-react";
import Helper from '@/lib/Helper';
import { ArtikelType, UserLogin } from '@/lib/typedata';
import { Token } from "@/lib/Authenticate";
import { useRouter } from "next/navigation";
import ArtikelProp from '@/components/dashboard/data/ArtikelProp';

export default function DataUser({ user }: { user: UserLogin }) {
    const route = useRouter();
    const [artikel, setArtikel] = useState<ArtikelType[] | []>([]);
    const [loadingPage, setLoadingPage] = useState(true);
    const [token, setToken] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [sukses, setSukses] = useState<string>("");
    const timeDeleteAlert = 5000; // 5 detik
    const [alertCountdown, setAlertCountdown] = useState<number>(0);
    const [open, setOpen] = useState(false);
    const [openEditLoading, setOpenEditLoading] = useState(false);
    const [modalType, setModalType] = useState<"create" | "update">("create");
    const [artikelIdEdit, setArtikelIdEdit] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (user == null) route.push("/login");
    }, [user])

    async function fetchDataArtikel() {
        setLoadingPage(true);
        const data = await semuaArtikel({});
        setArtikel(data);
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
            if (token != "") {
                setToken(token);
            } else {
                route.push("/login");
            }
        }

        fetchToken();
        fetchDataArtikel();
    }, [])

    async function handleDelete(id: number) {
        if (confirm("Apakah Anda Yakin Ingin Menghapus Artikel Ini?")) {
            const delArtikel = await deleteArtikel({ id, token })

            if (delArtikel.success) {
                setSukses(delArtikel.pesan);
                fetchDataArtikel();
                setAlertCountdown(timeDeleteAlert / 1000);
                setTimeout(() => {
                    setSukses("");
                    setAlertCountdown(0);
                }, timeDeleteAlert);

            } else {
                setError(delArtikel.pesan);
                setAlertCountdown(timeDeleteAlert / 1000);
                setTimeout(() => {
                    setError("");
                    setAlertCountdown(0);
                }, timeDeleteAlert);
            }
        }
    }

    function handleEditClick(id: number) {
        setOpenEditLoading(true);
        setModalType("update");
        setArtikelIdEdit(id);
        setOpen(true);
        setOpenEditLoading(false);
    }

    return (
        <div className="p-2 md:p-4">
            {/* Header Table */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                <h2 className="text-xl font-semibold">Data Artikel</h2>
                <div className="flex items-center gap-x-2 w-full md:w-auto">
                    <button
                        onClick={() => setOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 h-10 rounded-md transition flex-1 md:flex-none text-sm md:text-base"
                    >
                        Buat Artikel
                    </button>

                    <button
                        onClick={fetchDataArtikel}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 h-10 rounded-md transition"
                    >
                        <RefreshCcw size={18} />
                    </button>
                </div>
            </div>

            <ArtikelProp
                modalType={modalType}
                idArtikel={artikelIdEdit}
                openModal={open}
                user={user}
                onClose={() => {
                    setOpen(false);
                    setModalType("create");
                    setArtikelIdEdit(undefined);
                }}
                onSaveReload={fetchDataArtikel}
                setSukses={setSukses}
                setAlertCountdown={setAlertCountdown}
                timeDeleteAlert={timeDeleteAlert}
            />

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
                                <th className="px-2 py-2 md:px-4 md:py-3 text-sm md:text-base">Judul</th>
                                <th className="px-2 py-2 md:px-4 md:py-3 hidden sm:table-cell text-sm md:text-base">Kategori</th>
                                <th className="px-2 py-2 md:px-4 md:py-3 hidden md:table-cell text-sm md:text-base">Pembuat</th>
                                <th className="px-2 py-2 md:px-4 md:py-3 text-sm md:text-base">Aksi</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {loadingPage ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4">
                                        <LoadingText text="Memuat..." />
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {artikel.length > 0 && artikel ? artikel.map((artikel, no_index) => (
                                        <tr key={artikel.id} className="border-t border-gray-600 hover:bg-gray-500/10 transition">
                                            <td className="px-2 py-2 md:px-4 md:py-3 text-sm md:text-base">{no_index + 1}</td>
                                            <td className="px-2 py-2 md:px-4 md:py-3 text-sm md:text-base">
                                                {Helper.potongText(artikel.judul_artikel, window.innerWidth < 640 ? 15 : 20)}
                                            </td>
                                            <td className="px-2 py-2 md:px-4 md:py-3 hidden sm:table-cell text-sm md:text-base">
                                                {artikel.kategori?.kategori}
                                            </td>
                                            <td className="px-2 py-2 md:px-4 md:py-3 hidden md:table-cell text-sm md:text-base">
                                                {artikel.user?.name}
                                            </td>
                                            <td className="px-2 py-2 md:px-4 md:py-3 text-sm md:text-base">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        disabled={openEditLoading}
                                                        className="flex items-center bg-green-600 hover:bg-green-700 p-1 md:px-2 md:py-1 rounded mr-1 md:mr-2 text-xs md:text-sm"
                                                        onClick={() => handleEditClick(artikel.id)}
                                                    >
                                                        {(openEditLoading && artikel.id == artikelIdEdit) ? (
                                                            <LoadingCircle className={"mr-1 border-gray-300"} />
                                                        ) : (
                                                            <Edit size={14} className="md:mr-1" />
                                                        )}
                                                        <span className="hidden md:inline">Edit</span>
                                                    </button>
                                                    <button
                                                        className="flex items-center bg-red-600 hover:bg-red-700 p-1 md:px-2 md:py-1 rounded text-xs md:text-sm"
                                                        onClick={() => handleDelete(artikel.id)}
                                                    >
                                                        <Trash2 size={14} className="md:mr-1" />
                                                        <span className="hidden md:inline">Hapus</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4">Data Artikel Tidak Ada</td>
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