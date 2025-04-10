"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ArtikelType, UserLogin, UserType, UserTypeOnlyName } from '@/lib/typedata';
import {semuaArtikel} from "@/lib/backend/Artikel";
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

export default function DashboardContent({user} : Props) {
  const route = useRouter();
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
  const timeDeleteAlert = 5000; // 5 detik
  const [alertCountdown, setAlertCountdown] = useState<number>(0);
  const [token, setToken] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [openEditLoading, setOpenEditLoading] = useState(false);
  const [modalType, setModalType] = useState<"create" | "update">("create");
  const [artikelIdEdit, setArtikelIdEdit] = useState<number | undefined>(undefined);


  useEffect(() => {
      async function fetchToken() {
        const token = await Token();
        if(token != "") {
          setToken(token);
        } else {
          route.push("/login");
        }
      }

      fetchToken();
  }, [])

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
    const artikels: ArtikelType[] | [] = await semuaArtikel({fixfilters: {user_id: user.user.id}}); 
    setDataArtikelMu(artikels);
    
    setLoadingGetArtikelMu(false);
  }

  useEffect(() => {
    getCountArtikel()
    getCountPenulis()
    getArtikelMu();

  }, []);

  async function handleDeleteArtikel(id: number) {
    if(confirm("Apakah Anda Yakin Ingin Menghapus Artikel Ini?")) {
      const delArtikel = await deleteArtikel({id, token})

      if(delArtikel.success) {
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
    <div>
      <ArtikelProp modalType={modalType} idArtikel={artikelIdEdit} openModal={open} user={user} onClose={() => {setOpen(false); setModalType("create"); setArtikelIdEdit(undefined); getArtikelMu();}}  setSukses={setSukses} setAlertCountdown={setAlertCountdown} timeDeleteAlert={timeDeleteAlert} dariList={false}/>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Selamat datang, {user.user.name}</h1>
          <p className="dashboard-subtitle">Berikut sekilas informasi tentang performa blog dan aktivitas terakhir Anda.</p>
        </div>
        <div className="user-profile">
          <span>{user.user.name}</span>
          <div className="avatar-container">
            <Image
              src={process.env.NEXT_PUBLIC_BASE_URL_IMAGE + user.user.profil || "/placeholder.svg"}
              alt="User avatar"
              width={40}
              height={40}
              className="avatar-image"
            />
          </div>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stats-card">
          <h2 className="stats-title">Total Artikel</h2>
          {loadingGetArtikel ? <LoadingCircle/> : <p className="stats-value">{stats.totalPosts}</p>}
        </div>
        <div className="stats-card">
          <h2 className="stats-title">Total Penulis</h2>
          {loadingGetPenulis ? <LoadingCircle/> : <p className="stats-value">{stats.totalPenulis}</p>}
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">Artikel Anda</h2>
          <div className="flex items-center gap-x-3 flex-row-reverse">

              <button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 h-10 rounded-md transition" style={{borderRadius: "5px"}}>
                Buat Artikel
              </button>

              <button onClick={getArtikelMu} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 h-10 rounded-md transition" style={{borderRadius: "5px"}}>
                <RefreshCcw size={18}/>
              </button>
            </div>
        </div>

        <div className="mt-2">
          {error != "" && 
            <div className="bg-red-500/10 px-3 py-2 rounded mb-2 text-sm">{error} {alertCountdown > 0 && `(${alertCountdown}s)`}</div>}
          {sukses != "" && 
            <div className="bg-green-500/10 px-3 py-2 rounded mb-2 text-sm">{sukses} {alertCountdown > 0 && `(${alertCountdown}s)`}</div>}
        </div>
            
        {loadingGetArtikelMu ? <LoadingText text="Memuat Data Artikel..."/> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {dataArtikelMu && dataArtikelMu.length != 0 ? dataArtikelMu.map((item, i) => (
              <div key={i} className="bg-[#222222] text-white rounded-2xl shadow-md overflow-hidden flex flex-col relative">
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
                    <h3 className="text-lg font-semibold mb-1">{item.judul_artikel}</h3>
                    <h6 className="text-sm font-medium mb-1">Kategori : {item.kategori?.kategori}</h6>
                    <p className="text-sm text-gray-300">{Helper.potongText(Helper.hilangkanHTMLTAG(item.isi), 50)}</p>
                    <span className="text-gray-100 text-[12px] font-semibold">{Helper.dateConvert(item.created_at)}</span>
                  </div>
                </div>

                {/* Tombol aksi kanan bawah */}
                <div className="flex gap-2 p-3 justify-end">
                  <button onClick={() => handleEditArtikel(item.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm" style={{borderRadius: "5px"}} disabled={openEditLoading}>
                    {(openEditLoading && item.id == artikelIdEdit) && <LoadingCircle className={"mr-1 border-gray-300"}/>}
                    Edit
                  </button>
                  <button onClick={() => handleDeleteArtikel(item.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm" style={{borderRadius: "5px"}}>
                    Hapus
                  </button>
                </div>
              </div>
            )): (
              <div className="text-center text-lg font-bold text-nowrap">Data Artikel Anda Tidak Ada</div>
            )}
          </div>
        )}
      </div>

    </div>
  )
}

