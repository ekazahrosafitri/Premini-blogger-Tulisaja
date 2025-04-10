"use client"
import { Logout } from "@/lib/Authenticate"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, DoorOpen, Home, UserPen, Newspaper, Plus, Tag, Users, UserCog, Boxes } from "lucide-react"
import { UserLogin } from '@/lib/typedata';

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void,
  user: UserLogin
}

export default function Sidebar({ activeTab, setActiveTab, user }: SidebarProps) {
  const router = useRouter();
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20}/>, isadmin: false, href: "#" },
    { id: "editProfile", label: "Edit Profil", icon: <UserPen size={20}/>, isadmin: false, href: "#" },
    { id: "createArticle", label: "Buat Artikel", icon: <Plus size={20}/>, isadmin: false, href: "#" },
    { id: "datauser", label: "Data User", icon: <Users size={20}/>, isadmin: true, href: "dashboard/user" },
    { id: "datarole", label: "Data Role", icon: <UserCog size={20}/>, isadmin: true, href: "dashboard/role" },
    { id: "dataartikel", label: "Data Artikel", icon: <Newspaper size={20}/>, isadmin: true, href: "dashboard/artikel" },
    { id: "datakategori", label: "Data Kategori", icon: <Boxes size={20}/>, isadmin: true, href: "dashboard/kategori" },
    { id: "datatag", label: "Data Tag", icon: <Tag size={20}/>, isadmin: true, href: "dashboard/tag" },
  ]

  async function handleLogout(e: React.FormEvent) {
    e.preventDefault();
    const confirmation = confirm("Anda yakin ?");
    
    if (confirmation) {
      await Logout();
      router.push("/login");
    } 
  }

  return (
    <div className="dashboard-sidebar">
      <div>
        <div className="sidebar-logo">
          Tulis<span>Aja</span>
        </div>
        <nav className="sidebar-nav">
          {menuItems.filter((item) => !item.isadmin || user.role.role.toLowerCase() == "admin")
          .map((item) => (
            <Link
              key={item.id}
              className={`sidebar-nav-item ${activeTab === item.id ? "active" : ""}`}
              href={item.href =="#" ? "/dashboard" : item.href}
              onClick={(e) => {
                if(item.href == null || item.href == "#") {
                  e.preventDefault()
                  setActiveTab(item.id)
                } else {
                  router.push(item.href)
                }
              }}
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="sidebar-footer">
        <button type="button" onClick={handleLogout} className="sidebar-nav-item w-full">
          <span className="mr-1"><DoorOpen size={20}/></span>
          
          Logout
        </button>
        <Link href="/" className="sidebar-nav-item">
          <span className="mr-1"><ArrowLeft size={20}/></span>
          
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}

