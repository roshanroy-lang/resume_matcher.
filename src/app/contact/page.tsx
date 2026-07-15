'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert("Please fill out all fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-500/25 selection:text-teal-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
        
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
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Contact Us</h1>
            <p className="text-xs text-slate-400">Have questions? Get in touch with us.</p>
          </div>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center text-center py-8 gap-4 animate-fadeIn">
            <div className="h-12 w-12 bg-teal-50 rounded-full flex items-center justify-center text-[#008080] border border-teal-100">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Message Sent!</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
                Thank you for contacting us. We have received your inquiry and our support team will review it shortly.
              </p>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-4 px-4 py-2 bg-[#008080] hover:bg-[#006666] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#008080] focus:border-[#008080] transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#008080] focus:border-[#008080] transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                rows={5}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#008080] focus:border-[#008080] transition-all resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-lg font-semibold bg-[#008080] hover:bg-[#006666] text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-85 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>Sending message...</span>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="h-3.5 w-3.5" />
                </>
              )}
            </button>

          </form>
        )}

        {/* Footer info */}
        <div className="mt-12 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          <p>&copy; 2026 Roshan Roy. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}
