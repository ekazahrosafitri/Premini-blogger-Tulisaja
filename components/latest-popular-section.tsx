"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function LatestPopularSection() {
  const [latestItems] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/300x200",
      category: "Politik",
      title: "DPR Setujui Rancangan Undang-Undang Energi Terbarukan",
      excerpt:
        "Dewan Perwakilan Rakyat (DPR) akhirnya menyetujui Rancangan Undang-Undang tentang Energi Terbarukan yang telah diajukan sejak tahun lalu.",
      author: "Admin",
      date: "15 Maret 2025",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/300x200",
      category: "Ekonomi",
      title: "Bank Indonesia Pertahankan Suku Bunga Acuan di Level 4.75%",
      excerpt:
        "Bank Indonesia (BI) memutuskan untuk mempertahankan suku bunga acuan atau BI Rate di level 4,75% dalam Rapat Dewan Gubernur (RDG).",
      author: "Admin",
      date: "14 Maret 2025",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/300x200",
      category: "Teknologi",
      title: "Startup Lokal Raih Pendanaan Seri B Senilai Rp500 Miliar",
      excerpt:
        "Sebuah startup teknologi finansial (fintech) asal Indonesia berhasil mendapatkan pendanaan Seri B senilai Rp500 miliar dari sejumlah investor global.",
      author: "Admin",
      date: "13 Maret 2025",
    },
  ])

  const [popularItems] = useState([
    {
      id: 1,
      number: "01",
      title: "Warga Keluhkan Kenaikan Harga Sembako di Beberapa Daerah",
    },
    {
      id: 2,
      number: "02",
      title: "Kementerian PUPR Resmikan Jalan Tol Baru Sepanjang 50 KM",
    },
    {
      id: 3,
      number: "03",
      title: "Film Karya Anak Bangsa Raih Penghargaan di Festival Film Internasional",
    },
    {
      id: 4,
      number: "04",
      title: "Ini Daftar 10 Universitas Terbaik di Indonesia Tahun 2025",
    },
    {
      id: 5,
      number: "05",
      title: "Pemerintah Luncurkan Program Bantuan untuk UMKM Terdampak Pandemi",
    },
  ])

  return (
    <div className="two-column-layout">
      {/* Latest News */}
      <section className="latest-section section">
        <div className="section-header">
          <h2 className="section-title">Berita Terbaru</h2>
          <Link href="/category/latest" className="view-all">
            Lihat Semua
          </Link>
        </div>
        <div className="latest-list">
          {latestItems.map((item) => (
            <div key={item.id} className="latest-item">
              <div className="latest-image">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  width={300}
                  height={200}
                  layout="responsive"
                />
              </div>
              <div className="latest-content">
                <span className="news-category">{item.category}</span>
                <h3 className="latest-title">{item.title}</h3>
                <p className="latest-excerpt">{item.excerpt}</p>
                <div className="news-meta">
                  <span>Oleh: {item.author}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular News */}
      <section className="popular-section section">
        <div className="section-header">
          <h2 className="section-title">Terpopuler</h2>
          <Link href="/category/popular" className="view-all">
            Lihat Semua
          </Link>
        </div>
        <div className="popular-list">
          {popularItems.map((item) => (
            <div key={item.id} className="popular-item">
              <div className="popular-number">{item.number}</div>
              <h3 className="popular-title">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

