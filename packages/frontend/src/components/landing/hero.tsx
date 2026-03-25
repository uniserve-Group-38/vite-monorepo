"use client"

import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      tl.from(".hero-title", {
        x: -60,
        opacity: 0,
        duration: 0.8,
      })
        .from(".hero-sub", {
          y: 24,
          opacity: 0,
          duration: 0.6,
        }, "-=0.4")
        .from(".hero-cta", {
          scale: 0.95,
          opacity: 0,
          duration: 0.5,
        }, "-=0.3")
    },
    { scope: heroRef }
  )

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center z-50 bg-cyan-700 bg-opacity-50 overflow-hidden border-b-8 border-black pt-16"
    >
        <div className="absolute inset-0 bg-[url('/landing_assets/togetherness.jpg')] bg-cover bg-center opacity-30" />
                

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 text-center z-10">

        {/* Heading */}
        <h1 className="hero-title font-black mb-6 sm:mb-8 leading-none tracking-tighter">
          <span className="
            inline-block bg-white border-4 sm:border-8 border-black
            px-3 py-1.5 sm:px-5 sm:py-2
            -rotate-1
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
            mb-4 sm:mb-6
            text-4xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl
          ">
            CAMPUS LIFE
          </span>
          <br />
          <span className="
            inline-block bg-pink-400 border-4 sm:border-8 border-black
            px-3 py-1.5 sm:px-5 sm:py-2
            rotate-1
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
            mt-4 sm:mt-6
            text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl
          ">
            SIMPLIFIED!
          </span>
        </h1>

        {/* Subtext */}
        <p className="hero-sub text-base text-amber-50 sm:text-xl md:text-2xl font-bold max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed px-2 sm:px-0">
          Everything you need on campus — laundry, food, tech fixes — all in one place.
          No BS, just services that work. 
        </p>

        {/* CTA */}
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link to="/services" className="group w-full sm:w-auto">
            <div className="
              bg-black text-white font-black
              text-base sm:text-lg md:text-xl
              px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6
              border-4 sm:border-[6px] border-black
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
              hover:-translate-y-1 hover:text-black hover:bg-amber-100
              transition-all duration-200
              flex items-center justify-center gap-3
              w-full sm:w-auto
            ">
              BROWSE SERVICES
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-200" />
            </div>
          </Link>

          <Link to="/auth/sign-up" className="w-full sm:w-auto">
            <div className="
              bg-cyan-300 text-black font-black
              text-base sm:text-lg md:text-xl
              px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6
              border-4 sm:border-[6px] border-black
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
              hover:-translate-y-1
              transition-all duration-200
              flex items-center justify-center
              w-full sm:w-auto
            ">
              SIGN UP FREE
            </div>
          </Link>

          <Link to="/apply" className="w-full sm:w-auto">
            <div className="
              bg-yellow-400 text-black font-black
              text-base sm:text-lg md:text-xl
              px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6
              border-4 sm:border-[6px] border-black
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
              hover:-translate-y-1
              transition-all duration-200
              flex items-center justify-center
              w-full sm:w-auto
            ">
              BECOME A PROVIDER
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
