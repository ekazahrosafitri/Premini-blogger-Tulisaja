"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function TrendingSection() {
  const [trendingItems] = useState([
    {
      id: 1,
      image: "https://placehold.co/100x80",
      category: "Ekonomi",
      title: "Inflasi Turun ke Level Terendah dalam 5 Tahun Terakhir",
      date: "15 Maret 2025",
    },
    {
      id: 2,
      image: "https://placehold.co/100x80",
      category: "Teknologi",
      title: "Perusahaan Lokal Luncurkan Smartphone dengan Fitur AI Terbaru",
      date: "14 Maret 2025",
    },
    {
      id: 3,
      image: "https://placehold.co/100x80",
      category: "Olahraga",
      title: "Tim Nasional Indonesia Melaju ke Semifinal Piala AFF 2025",
      date: "13 Maret 2025",
    },
    {
      id: 4,
      image: "https://placehold.co/100x80",
      category: "Pendidikan",
      title: "Pemerintah Revisi Kurikulum Pendidikan untuk Tingkatkan Kualitas SDM",
      date: "12 Maret 2025",
    },
  ])

  return (
    <section className="trending-section section">
      <div className="section-header">
        <h2 className="section-title">Trending</h2>
        <Link href="/category/trending" className="view-all">
          Lihat Semua
        </Link>
      </div>
      <div className="trending-list">
        {trendingItems.map((item) => (
          <div key={item.id} className="trending-item">
              { item.image }
            <div className="trending-image">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                width={100}
                height={80}
                layout="responsive"
              />
            </div>
            <div className="trending-content">
              <span className="trending-category">{item.category}</span>
              <h3 className="trending-title">{item.title}</h3>
              <div className="trending-date">{item.date}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

