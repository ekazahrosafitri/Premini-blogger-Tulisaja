"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArtikelType } from "@/lib/typedata"
import Helper from "@/lib/Helper"

export default function LatestPopularSection() {
  const [data, setData] = useState<ArtikelType[] | null>([]);
  const [dataPop, setDataPop] = useState<ArtikelType[] | null>([]);

  let dataKirim = {
    limit: 5
  }

  let dataKirimIndex = {
    start: 0,
    end: 5,
  }

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/artikel/populer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-HTTP-Method-Override": "GET"
      },
      body: JSON.stringify(dataKirim),
    })
    .then((res) => res.json())
    .then(({data}) => setDataPop(data))
    .catch(err => console.error(err))

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/artikel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-HTTP-Method-Override": "GET"
      },
      body: JSON.stringify(dataKirimIndex),
    })
    .then((res) => res.json())
    .then(({data}) => setData(data))
    .catch(err => console.error(err))
  }, []);

  return (
    <div className="two-column-layout">
      {/* Latest News */}
      <section className="latest-section section">
        <div className="section-header">
          <h2 className="section-title font-bold">Berita Terbaru</h2>
          <Link href="/artikels" className="view-all">
            Lihat Semua
          </Link>
        </div>
        <div className="latest-list">
          {data && data.length != 0 ? data.map((item) => (
            <a href={`/detailartikel/${item.id}`} key={item.id} className="latest-item">
              <div className="latest-image">
                <Image
                  src={process.env.NEXT_PUBLIC_BASE_URL_IMAGE + item.banner || "/artikels/artikel.jpeg"}
                  alt={item.judul_artikel}
                  width={300}
                  height={200}
                  // layout="responsive"
                />
              </div>
              <div className="latest-content">
                <span className="news-category">{item.kategori?.kategori}</span>
                <h3 className="latest-title font-bold">{item.judul_artikel}</h3>
                <p className="latest-excerpt">{Helper.potongText(Helper.hilangkanHTMLTAG(item.isi), 100)}</p>
                <div className="news-meta">
                  <span>Oleh: {item.user?.name}</span>
                  <span>{Helper.dateConvert(item.created_at)}</span>
                </div>
              </div>
            </a>
          )) : <div className="text-center w-full"><h1 className="font-bold text-xl">Data Artikel Tidak Ada</h1></div>}
        </div>
      </section>

      {/* Popular News */}
      <section className="popular-section section">
        <div className="section-header">
          <h2 className="section-title font-bold">Terpopuler</h2>
          <Link href="/artikels" className="view-all">
            Lihat Semua
          </Link>
        </div>
        <div className="popular-list">
          {dataPop && dataPop.length != 0 ? dataPop.map((item, index) => (
            <a href={`/detailartikel/${item.id}`} key={item.id} className="popular-item">
              <div className="popular-number">{(index + 1).toString().padStart(2, "0")}</div>
              <h3 className="popular-title font-semibold">{item.judul_artikel}</h3>
            </a>
          )) : <div className="text-center w-full"><h1 className="font-bold text-xl">Data Artikel Tidak Ada</h1></div>}
        </div>
      </section>
    </div>
  )
}

