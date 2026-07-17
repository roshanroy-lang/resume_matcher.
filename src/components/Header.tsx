import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1A1A1A]/10 bg-[#FAF7F2]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="InterviewReady Logo"
            width={36}
            height={36}
            className="rounded-lg shadow-sm"
          />
          <span className="text-xl font-serif font-black text-[#1A1A1A] tracking-tight">
            InterviewReady
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200/60 px-3 py-1 text-xs font-semibold text-teal-800">
            <Sparkles className="h-3.5 w-3.5 text-[#008080]" />
            <span>Universal Career Matcher</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500 pl-4 border-l border-[#1A1A1A]/10">
            <a href="#" className="text-[#1A1A1A] font-semibold transition-colors">Dashboard</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
