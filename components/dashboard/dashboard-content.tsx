"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArtikelType, UserLogin, UserTypeOnlyName } from '@/lib/typedata';
import { semuaArtikel } from "@/lib/backend/Artikel";
import { LoadingCircle, LoadingText } from '../ui/Loading';
import { semuaUserPenulis } from "@/lib/backend/User";
import Helper from "@/lib/Helper";
import { RefreshCcw } from "lucide-react";
import { deleteArtikel } from "@/lib/backend/Artikel";
import { Token } from "@/lib/Authenticate";
import { useRouter } from "next/navigation";
import ArtikelProp from "@/components/dashboard/data/ArtikelProp";

type Props = {
  user: UserLogin
}

export default function DashboardContent({ user }: Props) {
  const route = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalPenulis: 0,
  });
  const [dataArtikelMu, setDataArtikelMu] = useState<ArtikelType[] | []>([]);
  const [loadingGetArtikel, setLoadingGetArtikel] = useState(false);
  const [loadingGetPenulis, setLoadingGetPenulis] = useState(false);
  const [loadingGetArtikelMu, setLoadingGetArtikelMu] = useState(false);
  const [sukses, setSukses] = useState<string>("");
  const [error, setError] = useState<string>("");
  const timeDeleteAlert = 5000;
  const [alertCountdown, setAlertCountdown] = useState<number>(0);
  const [token, setToken] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [openEditLoading, setOpenEditLoading] = useState(false);
  const [modalType, setModalType] = useState<"create" | "update">("create");
  const [artikelIdEdit, setArtikelIdEdit] = useState<number | undefined>(undefined);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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
  }, []);

  async function getCountArtikel() {
    setLoadingGetArtikel(true);
    const artikel: ArtikelType[] | [] = await semuaArtikel({});
    setStats((prevStats) => ({
      ...prevStats,
      totalPosts: artikel.length,
    }));
    setLoadingGetArtikel(false);
  }

  async function getCountPenulis() {
    setLoadingGetPenulis(true);
    const penulis: UserTypeOnlyName[] | [] = await semuaUserPenulis({});
    setStats((prevStats) => ({
      ...prevStats,
      totalPenulis: penulis.length,
    }));
    setLoadingGetPenulis(false);
  }

  async function getArtikelMu() {
    setLoadingGetArtikelMu(true);
    const artikels: ArtikelType[] | [] = await semuaArtikel({ fixfilters: { user_id: user.user.id } });
    setDataArtikelMu(artikels);
    setLoadingGetArtikelMu(false);
  }

  useEffect(() => {
    getCountArtikel();
    getCountPenulis();
    getArtikelMu();
  }, []);

  async function handleDeleteArtikel(id: number) {
    if (confirm("Apakah Anda Yakin Ingin Menghapus Artikel Ini?")) {
      const delArtikel = await deleteArtikel({ id, token });

      if (delArtikel.success) {
        setSukses(delArtikel.pesan);
        getArtikelMu();
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

  async function handleEditArtikel(id: number) {
    setOpenEditLoading(true);
    setArtikelIdEdit(id);
    setModalType("update");
    setOpen(true);
    setOpenEditLoading(false);
  }

  return (
    <div className="p-4 md:p-6">
      <ArtikelProp
        modalType={modalType}
        idArtikel={artikelIdEdit}
        openModal={open}
        user={user}
        onClose={() => {
          setOpen(false);
          setModalType("create");
          setArtikelIdEdit(undefined);
          getArtikelMu();
        }}
        setSukses={setSukses}
        setAlertCountdown={setAlertCountdown}
        timeDeleteAlert={timeDeleteAlert}
        dariList={false}
      />

      {/* Header with enhanced mobile padding */}
      <div className={`flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 ${isMobile ? 'pt-4' : ''}`}>
        <div className={isMobile ? 'pb-4' : ''}>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {isMobile ? `Selamat datang, ${user.user.name}` : "Selamat datang"}
          </h1>
          <p className="text-gray-300 text-sm md:text-base mt-1 md:mt-2">
            {isMobile ? "Ayo lihat aktivitas terakhir Anda" : "Berikut sekilas informasi tentang performa blog dan aktivitas terakhir Anda."}
          </p>
        </div>

        {!isMobile && (
          <div className="flex items-center gap-3">
            <span className="text-white">{user.user.name}</span>
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={process.env.NEXT_PUBLIC_BASE_URL_IMAGE + user.user.profil || "/placeholder.svg"}
                alt="User avatar"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#222222] p-4 rounded-lg">
          <h2 className="text-gray-300 text-sm md:text-base">Total Artikel</h2>
          {loadingGetArtikel ? (
            <LoadingCircle className="mt-2" />
          ) : (
            <p className="text-white text-xl md:text-2xl font-bold mt-1">{stats.totalPosts}</p>
          )}
        </div>
        <div className="bg-[#222222] p-4 rounded-lg">
          <h2 className="text-gray-300 text-sm md:text-base">Total Penulis</h2>
          {loadingGetPenulis ? (
            <LoadingCircle className="mt-2" />
          ) : (
            <p className="text-white text-xl md:text-2xl font-bold mt-1">{stats.totalPenulis}</p>
          )}
        </div>
      </div>

      {/* Articles Section */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-0">Artikel Anda</h2>
          <div className="flex gap-3 justify-end">
            <button
              onClick={getArtikelMu}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition"
            >
              <RefreshCcw size={18} />
            </button>
            <button
              onClick={() => setOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition text-sm md:text-base"
            >
              Buat Artikel
            </button>
          </div>
        </div>

        {/* Alerts */}
        <div className="mt-2 mb-4">
          {error && (
            <div className="bg-red-500/10 px-3 py-2 rounded text-sm">
              {error} {alertCountdown > 0 && `(${alertCountdown}s)`}
            </div>
          )}
          {sukses && (
            <div className="bg-green-500/10 px-3 py-2 rounded text-sm">
              {sukses} {alertCountdown > 0 && `(${alertCountdown}s)`}
            </div>
          )}
        </div>

        {/* Articles Grid */}
        {loadingGetArtikelMu ? (
          <LoadingText text="Memuat Data Artikel..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {dataArtikelMu && dataArtikelMu.length > 0 ? (
              dataArtikelMu.map((item, i) => (
                <div key={i} className="bg-[#222222] text-white rounded-lg shadow-md overflow-hidden flex flex-col border-radius-20px">
                  <div className="h-48 relative">
                    <Image
                      src={process.env.NEXT_PUBLIC_BASE_URL_IMAGE + item.banner || "/artikels/artikel.jpeg"}
                      alt={item.judul_artikel}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold mb-1 line-clamp-2">{item.judul_artikel}</h3>
                    <h6 className="text-sm font-medium mb-1">Kategori: {item.kategori?.kategori}</h6>
                    <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                      {Helper.potongText(Helper.hilangkanHTMLTAG(item.isi), 50)}
                    </p>
                    <span className="text-gray-400 text-xs mt-auto">
                      {Helper.dateConvert(item.created_at)}
                    </span>
                  </div>

                  <div className="flex gap-2 p-3 justify-end border-t border-gray-700">
                    <button
                      onClick={() => handleEditArtikel(item.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
                      disabled={openEditLoading}
                    >
                      {(openEditLoading && item.id == artikelIdEdit) && (
                        <LoadingCircle className="border-gray-300 size-14" />
                      )}
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteArtikel(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-lg font-bold text-gray-400">Data Artikel Anda Tidak Ada</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}