import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#1A1A1A]/10 py-6 bg-[#FAF7F2] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>&copy; 2026 InterviewReady. Built for recruitment engineering.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:underline hover:text-[#1A1A1A] transition-colors cursor-pointer">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline hover:text-[#1A1A1A] transition-colors cursor-pointer">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
