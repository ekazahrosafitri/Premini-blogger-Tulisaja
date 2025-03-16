"use client"
import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [activeLink, setActiveLink] = useState("Beranda")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="header">
      <div className="header-main">
        <div className="container">
          <div className="header-content">
            <Link href="/" className="logo">
              Tulis<span>Aja</span>
            </Link>
            <div className="search-bar">
              <form className="search-form">
                <input type="text" className="search-input" placeholder="Cari berita..." />
                <button type="submit" className="search-button">
                  Cari
                </button>
              </form>
            </div>
            <div className="user-actions">
              <Link href="/login" className="btn btn-outline">
                Masuk
              </Link>
              <Link href="/register" className="btn btn-primary">
                Daftar
              </Link>
              <Link href="/dashboard" className="btn btn-primary">
                Dashboard
              </Link>
            </div>
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      <nav className={`main-nav ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="container">
          <ul className="nav-list">
            {[
              "Beranda",
              "Politik",
              "Ekonomi",
              "Teknologi",
              "Olahraga",
              "Hiburan",
              "Gaya Hidup",
              "Pendidikan",
              "Kesehatan",
            ].map((item) => (
              <li key={item} className="nav-item">
                <Link
                  href={item === "Beranda" ? "/" : `/category/${item.toLowerCase()}`}
                  className={`nav-link ${activeLink === item ? "active" : ""}`}
                  onClick={() => {
                    setActiveLink(item)
                    setMobileMenuOpen(false)
                  }}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

