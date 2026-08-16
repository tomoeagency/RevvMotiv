import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Zap, ArrowRight, Crosshair, ChevronRight } from 'lucide-react';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1599818814713-39d67bc8d4db?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543465077-3e3bfbfecba7?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1610884447640-42b8ec61a933?q=80&w=1200&auto=format&fit=crop"
];

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 w-full z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/10"
    >
      <div className="flex items-center justify-between px-6 h-20 max-w-screen-2xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <motion.img
            whileHover={{ scale: 1.1, rotate: 5 }}
            src="/logo.webp" alt="RevvMotiv Logo"
            className="w-10 h-10 object-contain rounded"
          />
          <span className="text-2xl font-bold tracking-tight text-white uppercase">
            Revv<span className="text-chrome">Motiv</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-xs font-semibold tracking-[0.1em] text-gray-400 uppercase">
          {['Aero Kits', 'Carbon Components', 'Lighting', 'Performance'].map((link, i) => (
            <motion.a
              key={link}
              href="#"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="relative group hover:text-white transition-colors"
            >
              {link}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-blue-500 group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden md:block text-xs font-semibold tracking-[0.1em] text-white uppercase hover:text-blue-400 transition-colors"
          >
            Sign In
          </motion.button>
          <button className="md:hidden text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full border-b border-white/10 overflow-hidden bg-[#050505]">
      {/* Structural Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
      
      {/* Sharp Diagonal Steel-Blue Accent — now with glow pulse */}
      <div className="absolute top-0 left-1/4 w-[1px] h-[150%] bg-blue-500 shadow-[0_0_15px_#3b82f6] rotate-[35deg] origin-top-left animate-glow-pulse" />
      <div className="absolute top-0 left-[27%] w-[1px] h-[150%] bg-blue-400/30 rotate-[35deg] origin-top-left opacity-30" />

      <div className="relative max-w-screen-2xl mx-auto flex flex-col md:flex-row min-h-[85vh]">
        
        {/* Left Column - Main Copy */}
        <div className="flex-1 flex flex-col justify-center px-6 py-20 md:border-r border-white/10 relative">
          {/* Engineering Crosshairs */}
          <Crosshair className="absolute top-6 left-6 text-white/20 w-4 h-4" />
          <Crosshair className="absolute bottom-6 left-6 text-white/20 w-4 h-4" />
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="w-8 h-[1px] bg-blue-600" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase">Spec 01 / Aerodynamics</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl lg:text-[85px] font-black uppercase tracking-tighter leading-[0.9] text-white mb-6"
          >
            Driven by Passion.<br />
            <span className="text-chrome">Built for Performance.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="text-gray-400 text-sm sm:text-base max-w-md font-medium leading-relaxed mb-10"
          >
            Precision-engineered carbon fiber styling and aerodynamic enhancements. Upgrade your stance with components designed for the true automotive enthusiast.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ opacity: 0.9, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-[#c9182b] to-[#1a5bb8] text-white text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-10 py-4 border border-white/20 text-white text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4 fill-white" /> View Film
            </motion.button>
          </motion.div>
        </div>

        {/* Right Column - Technical Data / Visual Balance */}
        <div className="hidden md:flex flex-col w-[45%] relative">
          <Crosshair className="absolute top-6 right-6 text-white/20 w-4 h-4 z-20" />
          <Crosshair className="absolute bottom-6 right-6 text-white/20 w-4 h-4 z-20" />
          
          <div className="absolute inset-0 z-0">
            {HERO_IMAGES.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt="Hero"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
                  idx === currentSlide ? 'opacity-70' : 'opacity-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#050505]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
          </div>

          <div className="flex-1 border-b border-white/10 p-10 flex flex-col justify-end relative z-10">
            <span className="text-[10px] text-gray-400 font-mono tracking-widest mb-2 block backdrop-blur-sm bg-black/20 w-fit px-2 py-1">MAT // PRE-PREG CARBON</span>
            <span className="text-[10px] text-gray-400 font-mono tracking-widest block backdrop-blur-sm bg-black/20 w-fit px-2 py-1">WEAVE // 2X2 TWILL</span>
          </div>
          <div className="h-48 p-10 flex flex-col justify-center bg-black/40 backdrop-blur-md border-t border-white/10 relative overflow-hidden z-10">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-2xl rounded-full" />
             <div className="relative z-10">
                <span className="text-4xl font-black text-white block leading-none mb-2">CFD</span>
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Aerodynamically Tested</span>
             </div>
             
             {/* Slide indicators */}
             <div className="absolute bottom-10 right-10 flex gap-2">
               {HERO_IMAGES.map((_, idx) => (
                 <motion.div
                   key={idx}
                   animate={{ width: idx === currentSlide ? 32 : 8 }}
                   className={`h-1 transition-colors duration-500 ${idx === currentSlide ? 'bg-blue-500' : 'bg-white/20'}`}
                 />
               ))}
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function CategoryStrip() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-b border-white/10 bg-[#020202]"
    >
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row">
        {['Exterior Styling', 'Carbon Fiber', 'Performance Exhaust', 'Lighting Upgrades'].map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            className="flex-1 p-6 border-b md:border-b-0 md:border-r border-white/10 last:border-r-0 transition-colors cursor-pointer group flex items-center justify-between"
          >
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest group-hover:text-white transition-colors">{cat}</span>
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

const PRODUCTS = [
  { id: 1, name: 'V-Style Carbon Front Lip', category: 'Aero', price: '₹28,500', img: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=600&auto=format&fit=crop' },
  { id: 2, name: 'Forged Carbon Mirror Caps', category: 'Exterior', price: '₹14,999', img: 'https://images.unsplash.com/photo-1555512255-a2f07fc0b298?q=80&w=600&auto=format&fit=crop' },
  { id: 3, name: 'High-Flow Downpipe', category: 'Performance', price: '₹42,000', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600&auto=format&fit=crop' },
  { id: 4, name: 'OLED Sequential Tails', category: 'Lighting', price: '₹35,500', img: 'https://images.unsplash.com/photo-1543465077-3e3bfbfecba7?q=80&w=600&auto=format&fit=crop' },
];

function FeaturedProducts() {
  return (
    <section className="py-24 px-6 max-w-screen-2xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6"
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-2">
            Engineered Parts
          </h2>
          <p className="text-sm text-gray-400 font-medium tracking-wide">Select upgrades for maximum visual and functional impact.</p>
        </div>
        <a href="#" className="text-xs font-bold text-white uppercase tracking-widest hover:text-blue-400 transition-colors border-b border-blue-500 pb-1">
          View Catalog
        </a>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRODUCTS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group cursor-pointer shimmer-card"
          >
            <div className="aspect-square bg-[#0a0a0a] border border-white/10 mb-4 flex items-center justify-center relative overflow-hidden">
               <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover object-center opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
               
               {/* Hover Overlay */}
               <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-black px-2 py-1">View Details</span>
                  </div>
               </div>

               {/* Blue border glow on hover */}
               <div className="absolute inset-0 border border-blue-500/0 group-hover:border-blue-500/40 transition-all duration-500" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{item.category}</div>
              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{item.name}</h3>
              <div className="text-sm font-bold text-gray-300">{item.price}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const REELS = [
  { id: 1, title: 'Carbon Lip Install', views: '124K', img: 'https://images.unsplash.com/photo-1503378370162-811c0f0d2cde?q=80&w=600&h=900&auto=format&fit=crop' },
  { id: 2, title: 'Night Run Aesthetics', views: '89K', img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=600&h=900&auto=format&fit=crop' },
  { id: 3, title: 'Exhaust Sound Check', views: '210K', img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600&h=900&auto=format&fit=crop' },
  { id: 4, title: 'Track Day Prep', views: '95K', img: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=600&h=900&auto=format&fit=crop' },
];

function ReelsSection() {
  return (
    <section className="border-t border-white/10 py-24 bg-[#020202]">
      <div className="max-w-screen-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            From Our Garage
          </h2>
          <p className="text-sm text-gray-400 mt-2">Real builds. Real performance.</p>
        </motion.div>
        
        <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-8 snap-x snap-mandatory">
          {REELS.map((reel, i) => (
            <motion.div 
              key={reel.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
              className="relative flex-none w-[280px] h-[500px] bg-[#0a0a0a] border border-white/10 snap-center group cursor-pointer overflow-hidden rounded-xl"
            >
              {/* Abstract Video Background */}
              <img src={reel.img} alt={reel.title} className="absolute inset-0 w-full h-full object-cover object-center opacity-70 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/40 to-transparent z-10" />
              {/* Blue border glow on hover */}
              <div className="absolute inset-0 border border-blue-500/0 group-hover:border-blue-500/30 transition-all duration-500 z-20" />

              {/* Play Button */}
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 12 }}
                  className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                >
                  <Play className="w-5 h-5 ml-1 fill-black text-black" />
                </motion.div>
              </div>

              {/* Metadata */}
              <div className="absolute bottom-0 left-0 w-full p-6 z-30">
                <h3 className="text-lg font-bold text-white leading-tight mb-2">{reel.title}</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Play className="w-3 h-3" /> {reel.views}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505] pt-16 pb-8">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-16">
          <div>
            <span className="text-xl font-bold tracking-tight text-white uppercase block mb-4">
              RevvMotiv
            </span>
            <p className="text-xs text-gray-400 max-w-xs font-medium leading-relaxed">
              India's premier destination for high-quality, precision-engineered automotive styling and performance accessories.
            </p>
          </div>
          
          <div className="flex gap-16">
            <div>
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Support</h4>
              <ul className="space-y-3 text-xs font-bold text-gray-300">
                <li><a href="#" className="hover:text-white hover:text-blue-400 transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Social</h4>
              <ul className="space-y-3 text-xs font-bold text-gray-300">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            &copy; 2026 RevvMotiv. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-carbon relative font-sans antialiased text-white">
      <Navbar />
      <main>
        <Hero />
        <CategoryStrip />
        <FeaturedProducts />
        <ReelsSection />
      </main>
      <Footer />
    </div>
  );
}
