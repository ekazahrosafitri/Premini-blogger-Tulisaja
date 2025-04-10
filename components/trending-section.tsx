"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArtikelType } from "@/lib/typedata"
import Helper from "@/lib/Helper"

export default function TrendingSection() {
  const [data, setData] = useState<ArtikelType[] | null>([]);

  let dataKirim = {
    limit: 5
  }

  useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/artikel/trending`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-HTTP-Method-Override": "GET"
        },
        body: JSON.stringify(dataKirim)
      })
      .then((res) => res.json())
      .then(({data}) => setData(data))
      .catch(err => console.error(err))
    }, []);

  return (
    <section className="trending-section section">
      <div className="section-header">
        <h2 className="section-title font-bold">Trending 24 Jam</h2>
        <Link href="/artikels" className="view-all">
          Lihat Semua
        </Link>
      </div>
      <div className="trending-list">
        {data && data.length != 0 ? data.map((item) => (
          <a href={`/detailartikel/${item.id}`} key={item.id} className="trending-item">
            <div className="trending-image">
              <Image
                src={process.env.NEXT_PUBLIC_BASE_URL_IMAGE + item.banner || "/artikels/artikel.jpeg"}
                alt={item.judul_artikel}
                width={1000}
                height={800}
                // layout="responsive"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="trending-content">
              <span className="trending-category font-medium">{item.kategori?.kategori}</span>
              <h3 className="trending-title font-semibold">{item.judul_artikel}</h3>
              <div className="trending-date">{Helper.dateConvert(item.created_at)}</div>
            </div>
          </a>
        )) : <div className="text-center w-full"><h1 className="font-bold text-2xl">Data Artikel Tidak Ada</h1></div>}
      </div>
    </section>
  )
}

