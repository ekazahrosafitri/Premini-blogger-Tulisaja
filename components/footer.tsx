"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { KategoriType } from "@/lib/typedata"
import { semuaKategori } from "@/lib/backend/Kategori"

export default function Footer() {
  const [socialLinks] = useState([
    { icon: Facebook, url: "#" },
    { icon: Twitter, url: "#" },
    { icon: Instagram, url: "#" },
    { icon: Youtube, url: "#" },
  ])

  // const [categories] = useState([
  //   { name: "Politik", url: "/category/politik" },
  //   { name: "Ekonomi", url: "/category/ekonomi" },
  //   { name: "Teknologi", url: "/category/teknologi" },
  //   { name: "Olahraga", url: "/category/olahraga" },
  //   { name: "Hiburan", url: "/category/hiburan" },
  // ])

  const [categories, setCategories] = useState<KategoriType[] | []>([]);


  const [links] = useState([
    { name: "Tentang Kami", url: "/about" },
    { name: "Kontak", url: "/contact" },
    { name: "Kebijakan Privasi", url: "/privacy" },
    { name: "Syarat & Ketentuan", url: "/terms" },
    { name: "Peta Situs", url: "/sitemap" },
  ])

  useEffect(() => {
    async function getKategoris() {
      const kategori: KategoriType[] = await semuaKategori({})
      setCategories(kategori)
    }

    getKategoris();
  }, [])

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-widgets">
          <div className="footer-widget footer-about">
            <h3>Tentang Kami</h3>
            <p>
              TulisAja adalah portal berita dan informasi terpercaya di Indonesia yang menyajikan berita-berita terkini
              dari berbagai kategori seperti politik, ekonomi, teknologi, olahraga, dan lainnya.
            </p>
            <div className="footer-social">
              {socialLinks.map((link, index) => (
                <Link key={index} href={link.url}>
                  <link.icon size={18} />
                </Link>
              ))}
            </div>
          </div>
          <div className="footer-widget">
            <h3>Kategori</h3>
            <ul className="footer-links">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link href={`/artikels?kategori=${category.id}`}>{category.kategori}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-widget">
            <h3>Tautan</h3>
            <ul className="footer-links">
              {links.map((link, index) => (
                <li key={index}>
                  <Link href={link.url}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} TulisAja.</p>
        </div>
      </div>
    </footer>
  )
}

