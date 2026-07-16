'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
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
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-400">Last updated: July 15, 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-normal">
          <p>
            Welcome to InterviewReady. Your privacy is critically important to us. This Privacy Policy details how we handle the data you input when using our resume checking tools.
          </p>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Data Collection &amp; Privacy</h2>
            <p>
              InterviewReady is built as a client-first parsing utility. We do not save, store, or harvest any resumes, CV texts, job descriptions, or personal information uploaded or pasted onto our dashboard. 
            </p>
            <p>
              Any text uploaded to the site is processed in temporary runtime memory solely for the purpose of generating your compatibility rating and tailored AI recommendations. Once you close or reload the browser session, your data is permanently cleared.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. Third-Party Integrations</h2>
            <p>
              Our application uses Google Gemini API to analyze CV compatibility and offer rephrasing suggestions. The contents of your resume are transmitted securely via HTTPS to Google's API endpoints for processing. This data transmission is governed by Google’s standard AI services developer terms and is not used to train Google's models.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">3. Web Analytics &amp; Cookies</h2>
            <p>
              We use lightweight analytics tools (like Google Analytics) to monitor aggregate traffic levels, system load, and page utilization parameters. These analytics gather non-personally identifiable information such as browser type, operating system, and referral links.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">4. Policy Changes</h2>
            <p>
              We reserve the right to modify this privacy policy at any time. Any changes will be posted on this page with an updated timestamp.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">5. Legal Entity</h2>
            <p>
              This website and tool are owned and operated by <strong>Roshan Roy</strong>. For legal inquiries or policy questions, please contact us through the official contact portal on our homepage dashboard.
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
