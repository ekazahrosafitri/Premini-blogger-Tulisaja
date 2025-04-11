"use client"
import { Logout } from "@/lib/Authenticate"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image" // Tambahkan import Image
import { 
  ArrowLeft, 
  DoorOpen, 
  Home, 
  UserPen, 
  Newspaper, 
  Users, 
  UserCog, 
  Boxes, 
  Tag,
  Menu 
} from "lucide-react"
import { UserLogin } from '@/lib/typedata'
import { useState, useEffect } from "react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  user: UserLogin
}

export default function Sidebar({ activeTab, setActiveTab, user }: SidebarProps) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isHomeLinkHovered, setIsHomeLinkHovered] = useState(false)
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} />, isadmin: false, href: "#" },
    { id: "datauser", label: "Data User", icon: <Users size={20} />, isadmin: true, href: "dashboard/user" },
    { id: "editProfile", label: "Edit Profil", icon: <UserPen size={20}/>, isadmin: false, href: "#" },
    { id: "datarole", label: "Data Role", icon: <UserCog size={20} />, isadmin: true, href: "dashboard/role" },
    { id: "dataartikel", label: "Data Artikel", icon: <Newspaper size={20} />, isadmin: true, href: "dashboard/artikel" },
    { id: "datakategori", label: "Data Kategori", icon: <Boxes size={20} />, isadmin: true, href: "dashboard/kategori" },
    { id: "datatag", label: "Data Tag", icon: <Tag size={20} />, isadmin: true, href: "dashboard/tag" },
  ]

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleNavClick = (id: string) => {
    setActiveTab(id)
    if (isMobile) {
      setIsOpen(false)
    }
  }

  async function handleLogout(e: React.FormEvent) {
    e.preventDefault()
    const confirmation = confirm("Anda yakin ?")
    
    if (confirmation) {
      await Logout()
      router.push("/login")
    } 
  }

  const sidebarStyles = {
    container: {
      transition: 'transform 0.3s ease',
      position: isMobile ? 'fixed' : 'sticky' as 'fixed' | 'sticky',
      width: '250px',
      display: 'flex',
      flexDirection: 'column' as 'column',
      justifyContent: 'space-between',
      backgroundColor: '#201f1f',
      height: '100vh',
      padding: '1rem',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      top: 0,
      left: 0,
      zIndex: 40,
    },
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      width: '100%'
    },
    welcomeMessage: {
      color: 'white',
      fontSize: '14px',
      marginTop: '10px',
      marginBottom: '20px'
    },
    navItem: (isActive: boolean) => ({
      display: 'flex',
      alignItems: 'center',
      padding: '12px 10px',
      marginBottom: '8px',
      borderRadius: '4px',
      transition: 'background-color 0.2s',
      textDecoration: 'none',
      color: isActive ? '#2563eb' : 'white',
      fontWeight: isActive ? 'bold' : 'normal',
    }),
    homeLink: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 10px',
      marginBottom: '8px',
      borderRadius: '4px',
      textDecoration: 'none',
      color: isHomeLinkHovered ? '#2563eb' : 'white',
      transition: 'color 0.2s'
    },
    logoutButton: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 10px',
      textAlign: 'left',
      width: '100%',
      background: 'none',
      border: 'none',
      borderRadius: '4px',
      color: '#e53e3e',
      cursor: 'pointer',
    },
    mobileHeader: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: '12px 16px',
      backgroundColor: '#201f1f',
      display: 'flex',
      alignItems: 'center',
      zIndex: 45,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    burgerButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      padding: '8px'
    },
    userProfile: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '10px',
      marginBottom: '20px',
      padding: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      color: 'white'
    },
    avatarContainer: {
      borderRadius: '50%',
      overflow: 'hidden',
      width: '40px',
      height: '40px',
      flexShrink: 0
    },
    userName: {
      marginRight: '10px',
      fontSize: '14px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '150px'
    }
  }

  return (
    <>
      {/* Mobile header with burger menu */}
      {isMobile && (
        <div style={sidebarStyles.mobileHeader}>
          <button 
            onClick={toggleSidebar}
            style={sidebarStyles.burgerButton}
          >
            <Menu size={24} />
          </button>
          <div style={{ 
            marginLeft: '16px',
            color: 'white'
          }}>
            <span style={{ color: '#2563eb' }}>Tulis</span>
            <span style={{ color: '#f44336'}}>Aja</span>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`dashboard-sidebar ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : ''}`}
        style={{
          ...sidebarStyles.container,
          marginTop: isMobile ? '56px' : 0, // Add top margin to account for mobile header
          height: isMobile ? 'calc(100vh - 56px)' : '100vh' // Adjust height for mobile
        }}
      >
        <div>
          {!isMobile && (
            <div className="sidebar-logo" style={sidebarStyles.headerContainer}>
              <div style={{ color: 'white' }}>
                <span style={{ color: '#2563eb' }}>Tulis</span>
                <span style={{ color: '#f44336'}}>Aja</span>
              </div>
              {isMobile && isOpen && (
                <button onClick={toggleSidebar} className="text-gray-500">
                  <DoorOpen size={20} />
                </button>
              )}
            </div>
          )}
          
          {/* Welcome message untuk semua ukuran layar */}
          
          {/* User Profile - hanya tampil saat mobile */}
          {isMobile && (
            <div className="user-profile" style={sidebarStyles.userProfile}>
              <span style={sidebarStyles.userName}>{user.user?.name}</span>
              <div className="avatar-container" style={sidebarStyles.avatarContainer}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${user.user?.profil || "/placeholder.svg"}`}
                  alt="User avatar"
                  width={40}
                  height={40}
                  className="avatar-image"
                />
              </div>
            </div>
          )}
          
          <nav className="sidebar-nav" style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: isMobile ? '10px' : '20px'
          }}>
            {menuItems
              .filter((item) => !item.isadmin || user.role.role.toLowerCase() === "admin")
              .map((item) => (
                <Link
                  key={item.id}
                  className={`sidebar-nav-item ${activeTab === item.id ? "active" : ""}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  style={sidebarStyles.navItem(activeTab === item.id)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))
            }
          </nav>
        </div>
        
        <div className="sidebar-footer" style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 'auto'
        }}>
          <Link 
            href="/" 
            className="sidebar-nav-item" 
            style={sidebarStyles.homeLink}
            onMouseEnter={() => setIsHomeLinkHovered(true)}
            onMouseLeave={() => setIsHomeLinkHovered(false)}
          >
            <span className="mr-3"><ArrowLeft size={20}/></span>
            Kembali ke Beranda
          </Link>
          
          <button 
            type="button" 
            onClick={handleLogout} 
            className="sidebar-nav-item w-full"
          >
            <span className="mr-3"><DoorOpen size={20}/></span>
            Keluar
          </button>
        </div>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 30 }}
        />
      )}
    </>
  )
}