import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import TrendingSection from "@/components/trending-section"
import LatestPopularSection from "@/components/latest-popular-section"
import CategoriesSection from "@/components/categories-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <HeroSection />
          <TrendingSection />
          <LatestPopularSection />
          <CategoriesSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}

