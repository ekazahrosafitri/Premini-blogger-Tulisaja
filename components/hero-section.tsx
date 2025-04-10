"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Image from "next/image"
import { ChevronLeft, ChevronRight, Heading1, Link } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ArtikelType } from "@/lib/typedata"
import Helper from "@/lib/Helper"



export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [data, setData] = useState<ArtikelType[] | null>([]);
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (data ? data.length : 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + (data ? data.length : 1)) % (data ? data.length : 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left
      nextSlide()
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Swipe right
      prevSlide()
    }
  }

  // Fetching Untuk Ambil Data Pertama Kali
  let dataKirim = {
    sort: "created_at",
    order: "desc",
    start: 0,
    end: 3,
  }

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/artikel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-HTTP-Method-Override": "GET"
      },
      body: JSON.stringify(dataKirim),
    })
    .then((res) => res.json())
    .then(({data}) => setData(data))
    .catch(err => console.error(err))
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {  
      const interval = setInterval(nextSlide, 5000);
  
      return () => clearInterval(interval);
    }
  }, [data])

  function handleRedirectDetail(id: number) {
    window.location.href = `/detailartikel/${id}`
  }

  return (
    <section className="hero-section">
      <div
        className="carousel"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="carousel-items">
          {data && data.length != 0 ? data.map((item, index) => (
            <div onClick={() => handleRedirectDetail(item.id)} key={item.id} className={`carousel-item cursor-pointer ${index == currentIndex ? "active" : ""}`}>
              <Image
                src={process.env.NEXT_PUBLIC_BASE_URL_IMAGE + item.banner || "/placeholder.svg"}
                alt={item.judul_artikel}
                width={1200}
                height={600}
                className="carousel-image object-cover"
                priority={index === 0}
              />
              <div className="carousel-caption">
                <span className="carousel-category">{item.kategori?.kategori}</span>
                <h2 className="carousel-title">{item.judul_artikel}</h2>
                <div className="carousel-meta">
                  <span>Oleh: {item.user?.name}</span>
                  <span>{Helper.dateConvert(item.created_at)}</span>
                </div>
              </div>
            </div>
          )) : <div className="text-center w-full"><h1 className="font-bold mt-52 text-2xl">Data Artikel Tidak Ada</h1></div>}
        </div>

        {!isMobile && (
          <div className="carousel-controls">
            <div className="carousel-arrow prev" onClick={prevSlide}>
              <ChevronLeft size={24} />
            </div>
            <div className="carousel-arrow next" onClick={nextSlide}>
              <ChevronRight size={24} />
            </div>
          </div>
        )}
        <div className="carousel-dots">
          {data && data.map((_, index) => (
            <div
              key={index}
              className={`carousel-dot ${index == currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            ></div>
          ))}
        </div>
      </div>
    </section>
  )
}

