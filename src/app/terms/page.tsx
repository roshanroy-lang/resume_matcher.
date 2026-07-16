'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-500/25 selection:text-teal-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
        
        {/* Navigation back */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#008080] hover:text-[#006666] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-8">
          <div className="h-10 w-10 bg-teal-50 rounded-lg flex items-center justify-center text-[#008080]">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Terms of Service</h1>
            <p className="text-xs text-slate-400">Last updated: July 15, 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-normal">
          <p>
            By accessing and using the InterviewReady website and parsing engine, you agree to comply with and be bound by the following terms and conditions. Please read these terms carefully before utilizing our services.
          </p>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Acceptance of Terms</h2>
            <p>
              By accessing this web application, you represent that you accept these terms in full. If you disagree with any portion of these Terms of Service, you must discontinue your use of InterviewReady.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. Permitted Use &amp; Limitations</h2>
            <p>
              InterviewReady provides a free toolkit designed to help job applicants analyze keyword density and review resume structure. You may use this tool for personal, non-commercial purposes. 
            </p>
            <p>
              You agree not to attempt to scrape, reverse engineer, flood, or abuse our backend API routes, or use the tool to programmatically generate spam resumes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">3. Disclaimer of Warranties</h2>
            <p>
              The match scores, compatibility ratings, and bullet tailoring provided by InterviewReady are simulated results based on statistical keyword checks and semantic AI algorithms. We do not guarantee that using this tool will result in job offers, hiring approvals, or passing real corporate applicant tracking filters.
            </p>
            <p>
              The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">4. Limitation of Liability</h2>
            <p>
              In no event shall <strong>Roshan Roy</strong> or any affiliates be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use this service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">5. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with standard civil and corporate laws, without regard to conflict of law provisions.
            </p>
          </section>
        </div>

        {/* Footer info */}
        <div className="mt-12 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          <p>&copy; 2026 Roshan Roy. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}
