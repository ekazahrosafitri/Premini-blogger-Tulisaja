"use client"
import { useEffect, useRef, useState } from "react"
import Sidebar from "@/components/dashboard/sidebar"
import DashboardContent from "@/components/dashboard/dashboard-content"
import EditProfile from "@/components/dashboard/edit-profile"
import MyArticles from "@/components/dashboard/my-articles"
import { useAuth } from "@/lib/useAuth"
import Loading from "@/components/ui/Loading"
import {useRouter} from "next/navigation" 
import DataArtikel from "@/components/dashboard/data/DataArtikel"
import DataUser from "@/components/dashboard/data/DataUser"
import DataRole from "@/components/dashboard/data/DataRole"
import DataKategori from "@/components/dashboard/data/DataKategori"
import DataTag from "@/components/dashboard/data/DataTag"
import ArtikelProp from "@/components/dashboard/data/ArtikelProp"

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const {user, loading} = useAuth();
  const [loadingPage, setLoadingPage] = useState(true);
  const [sukses, setSukses] = useState<string>("");
  const timeDeleteAlert = 5000; // 5 detik
  const [alertCountdown, setAlertCountdown] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "update">("create");
  const [artikelIdEdit, setArtikelIdEdit] = useState<number | undefined>(undefined);
  const artikelFetchRef = useRef<() => void>(() => {});

  useEffect(() => {
    if(!loading) {
      if(user != null) {
        setLoadingPage(false);
      }

      if(user == null) router.push("/login");

    }
  }, [loading])

  if(loadingPage) {
    return <Loading text={"Memuat"}/>
  }
  

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent user={user}/>
      case "editProfile":
        return <EditProfile />
      case "myArticles":
        return <MyArticles/>
      case "dataartikel":
        return <DataArtikel user={user}/>
      case "datauser":
        return <DataUser user={user}/>
      case "datarole":
        return <DataRole user={user}/>
      case "datakategori":
        return <DataKategori user={user}/>
      case "datatag":
        return <DataTag user={user}/>
      case "createArticle":
        return <DashboardContent user={user}/>
      default:
        return <DashboardContent user={user}/>
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar activeTab={activeTab} setActiveTab={(tab) => setActiveTab(tab)} user={user} />
      <div className="dashboard-content">{renderContent()}</div>
    </div>
  )
}

