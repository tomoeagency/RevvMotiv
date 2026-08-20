import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-[85dvh] flex items-center justify-center bg-canvas overflow-hidden px-4 sm:px-6 lg:px-12">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
        
        {/* Police Sirens reflecting in the background */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-red-600/10 dark:bg-red-600/20 rounded-full blur-[120px] animate-[pulse_2s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] animate-[pulse_2s_ease-in-out_infinite_1s]" />
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-10 lg:py-16">
        
        {/* Left: Text Content */}
        <div className="flex flex-col items-start text-left order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-xs uppercase tracking-widest mb-6">
            <AlertCircle className="w-4 h-4" />
            Page Not Found
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-black uppercase tracking-tighter text-ink leading-[0.9] drop-shadow-2xl mb-6">
            404 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-700 to-black dark:to-zinc-800">
              Off Track
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-ink-muted font-bold tracking-tight mb-4">
            Looks like you took a wrong turn.
          </p>
          
          <p className="text-base text-ink-subtle leading-relaxed max-w-xl mb-10">
            The page or component you are looking for has been moved, renamed, or is currently unavailable in our garage. Let's get you back on the road.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/"
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-ink text-canvas font-bold uppercase tracking-widest text-sm rounded hover:scale-105 transition-transform shadow-xl"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
            <Link 
              href="/shop"
              className="group relative flex items-center justify-center gap-3 px-8 py-4 border border-hairline-strong text-ink font-bold uppercase tracking-widest text-sm rounded hover:bg-hover transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Browse Shop
            </Link>
          </div>
        </div>

        {/* Right: Merged Car Image */}
        <div className="relative order-1 lg:order-2 w-full flex justify-center lg:justify-end">
          {/* Transparent PNG allows the car to blend perfectly without any masks */}
          <div className="relative w-[70vw] h-[70vw] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] pointer-events-none">
            <Image 
              src="/police-error.png" 
              alt="Police Interceptor"
              fill
              className="object-contain opacity-90 dark:opacity-80 scale-110"
              priority
              unoptimized
            />
            {/* Dynamic siren overlay matching the car's position */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-32 h-10 bg-gradient-to-r from-blue-500/40 to-red-500/40 blur-xl animate-pulse mix-blend-screen scale-110" />
          </div>
        </div>

      </div>
    </main>
  );
}
