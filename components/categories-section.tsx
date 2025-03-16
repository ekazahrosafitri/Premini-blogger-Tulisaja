"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function CategoriesSection() {
  const [categoryItems] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/400x300",
      category: "Politik",
      title: "Presiden Hadiri KTT ASEAN di Singapura",
      excerpt:
        "Presiden Indonesia akan menghadiri Konferensi Tingkat Tinggi (KTT) ASEAN yang akan diselenggarakan di Singapura pada minggu depan.",
      date: "15 Maret 2025",
      readTime: "5 menit baca",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/400x300",
      category: "Ekonomi",
      title: "Rupiah Menguat ke Level Rp14.500 per Dolar AS",
      excerpt:
        "Nilai tukar rupiah terhadap dolar Amerika Serikat (AS) menguat ke level Rp14.500 pada perdagangan hari ini.",
      date: "15 Maret 2025",
      readTime: "3 menit baca",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/400x300",
      category: "Teknologi",
      title: "Peneliti Indonesia Kembangkan Robot Pendeteksi Sampah di Laut",
      excerpt:
        "Tim peneliti dari salah satu perguruan tinggi di Indonesia berhasil mengembangkan robot yang dapat mendeteksi sampah di laut.",
      date: "14 Maret 2025",
      readTime: "4 menit baca",
    },
  ])

  return (
    <section className="categories-section section">
      <div className="section-header">
        <h2 className="section-title">Kategori</h2>
        <Link href="/categories" className="view-all">
          Lihat Semua
        </Link>
      </div>
      <div className="news-grid">
        {categoryItems.map((item) => (
          <div key={item.id} className="news-card">
            <div className="news-image-container">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                width={400}
                height={300}
                className="news-image"
                layout="responsive"
              />
            </div>
            <div className="news-content">
              <span className="news-category">{item.category}</span>
              <h3 className="news-title">{item.title}</h3>
              <p className="news-excerpt">{item.excerpt}</p>
              <div className="news-meta">
                <span>{item.date}</span>
                <span>{item.readTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

