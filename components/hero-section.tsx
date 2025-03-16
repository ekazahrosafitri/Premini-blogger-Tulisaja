"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

const carouselItems = [
  {
    id: 1,
    image: "https://via.placeholder.com/1200x600",
    category: "Politik",
    title: "Kebijakan Baru Pemerintah untuk Ekonomi",
    author: "Admin",
    date: "15 Maret 2025",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/1200x600",
    category: "Teknologi",
    title: "Peluncuran Smartphone AI Terbaru",
    author: "Admin",
    date: "14 Maret 2025",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/1200x600",
    category: "Olahraga",
    title: "Timnas Indonesia Melaju ke Final",
    author: "Admin",
    date: "13 Maret 2025",
  },
]

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length)
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

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="hero-section">
      <div
        className="carousel"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="carousel-items">
          {carouselItems.map((item, index) => (
            <div key={item.id} className={`carousel-item ${index === currentIndex ? "active" : ""}`}>
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                width={1200}
                height={600}
                className="carousel-image"
                priority={index === 0}
              />
              <div className="carousel-caption">
                <span className="carousel-category">{item.category}</span>
                <h2 className="carousel-title">{item.title}</h2>
                <div className="carousel-meta">
                  <span>Oleh: {item.author}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
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
          {carouselItems.map((_, index) => (
            <div
              key={index}
              className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            ></div>
          ))}
        </div>
      </div>
    </section>
  )
}

