import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/landing/Hero"
import HHGoaBackground from "@/components/landing/HHGoaBackground"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-hh-forest">
      <HHGoaBackground />
      <div className="relative z-30">
        <Navbar />
        <main className="flex-1">
          <Hero />
        </main>
        <Footer />
      </div>
    </div>
  )
}