"use client"
import Link from "next/link"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "fas fa-tachometer-alt" },
    { id: "editProfile", label: "Edit Profil", icon: "fas fa-user-edit" },
    { id: "myArticles", label: "My Artikel", icon: "fas fa-file-alt" },
    { id: "createArticle", label: "Buat Artikel", icon: "fas fa-plus" },
  ]

  return (
    <div className="dashboard-sidebar">
      <div>
        <div className="sidebar-logo">
          Tulis<span>Aja</span>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <a
              key={item.id}
              className={`sidebar-nav-item ${activeTab === item.id ? "active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setActiveTab(item.id)
              }}
            >
              <i className={item.icon}></i>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="sidebar-footer">
        <Link href="/" className="sidebar-nav-item">
          <i className="fas fa-home"></i>
          Back to Home
        </Link>
      </div>
    </div>
  )
}

