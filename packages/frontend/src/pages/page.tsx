import Hero from "@/components/landing/hero"
import Navbar from "@/components/landing/Navbar"
import Features from "@/components/landing/features"
import Footer from "@/components/landing/footer";
import Testimonials from "@/components/landing/testimonials";
import FAQ from "@/components/landing/FAQ";
import { LandingOnlyWhenGuest } from "@/components/landing-only-when-guest";

export default function Home() {
  return (
    <LandingOnlyWhenGuest>
      <div className="bg-white min-h-screen relative min-w-0 overflow-x-hidden">
        <Navbar />
        <Hero />
        <Features />
        <Testimonials />
        <FAQ />
        <Footer />
      </div>
    </LandingOnlyWhenGuest>
  );
}
