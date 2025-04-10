"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { KategoriType } from "@/lib/typedata"
import { useAuth } from "@/lib/useAuth"
import Loading from "@/components/ui/Loading"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeLink, setActiveLink] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [kategoriData, setKategoriData] = useState<KategoriType[] | null>([]);
  const {user, loading} = useAuth();
  const [loadingData, setLoadingData] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null)
  
  let dataKirim = {
    start: 0,
    end: 10
  }

  useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/kategori`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-HTTP-Method-Override": "GET"
        },
        body: JSON.stringify(dataKirim),
      })
      .then((res) => res.json())
      .then(({data}) => setKategoriData(data))
      .catch(err => console.error(err))
      .finally(() => {
        if(loading) setLoadingData(false);
    });

    }, []);

    useEffect(() => {
      const kategoriParam = searchParams.get("kategori") || ""

      if(kategoriParam != "") {
          setActiveLink(kategoriParam ? parseInt(kategoriParam) : 0);
      }
  }, [searchParams]) 

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  if(loadingData) {
    return <Loading text={"Memuat"} />
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    // const searchInput = document.querySelector(".search-input") as HTMLInputElement
    const searchValue = inputRef.current?.value.trim()
    if (searchValue) {
      router.push(`/artikels?q=${searchValue}`)
    } else {
      router.push("/artikels")
    }
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
                <input ref={inputRef} type="text" className="search-input bg-gray-800" placeholder="Cari berita..." />
                <button type="submit" className="search-button" onClick={handleSearch}>
                    <Search size={20}/>
                </button>
              </form>
            </div>
            <div className="user-actions">
              {!user ? (
                <>
                  <Link href="/login" className="btn btn-outline">
                    Masuk
                  </Link>
                  <Link href="/register" className="btn btn-primary">
                    Daftar
                  </Link>
                </>
              ) : (
                <Link href="/dashboard" className="btn btn-primary">
                  Dashboard
                </Link>
              )}
            </div>
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      <nav className={`main-nav ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="container justify-center flex">
          <ul className="nav-list">
          <li className="nav-item">
                <Link
                  href={`/`}
                  className={`nav-link ${activeLink === 0 ? "active" : ""}`}
                  onClick={() => {
                    setActiveLink(0)
                    setMobileMenuOpen(false)
                  }}
                >
                  Beranda
                </Link>
              </li>
            {kategoriData && kategoriData.length != 0 ? kategoriData.map((item) => (
              <li key={item.id} className="nav-item">
                <Link
                  href={`/artikels?kategori=${item.id}`}
                  className={`nav-link ${activeLink === item.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveLink(item.id)
                    setMobileMenuOpen(false)
                  }}
                >
                  {item.kategori}
                </Link>
              </li>
            )) : ""}
          </ul>
        </div>
      </nav>
    </header>
  )
}

