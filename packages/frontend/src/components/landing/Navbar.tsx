'use client';

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 border-4 border-black bg-yellow-300 px-2 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:scale-105 hover:bg-linear-to-r hover:from-yellow-300 hover:to-yellow-500 ease-in-out duration-200 transition-all">
          <span className="font-black text-xl tracking-tight">
            Uni<span className="text-pink-500">Serve</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/services" className="font-bold text-sm hover:text-pink-500 transition-colors">
            Services
          </Link>
          <Link to="/announcements" className="font-bold text-sm hover:text-pink-500 transition-colors">
            Announcements
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/auth/sign-in" className="font-bold text-sm hover:text-pink-500 transition-colors">
            Log In
          </Link>
          <Link to="/auth/sign-up" className="font-bold text-sm hover:text-pink-500 transition-colors hidden sm:inline">
            Sign Up
          </Link>
          <Link
            to="/auth/sign-up"
            className="bg-black text-white px-5 py-2 font-black text-sm border-2 border-black 
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
            hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
             transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
