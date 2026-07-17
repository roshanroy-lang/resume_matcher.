import React, { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "How does the InterviewReady Checker calculate the scores?",
    a: "The tool evaluates resumes using two scanning metrics: Keyword Match Rate (which semantically scans your resume content against job qualifications) and ATS Formatting Readiness (which verifies layout structure, section headings, and contact info). Together, they define your overall compatibility rating."
  },
  {
    q: "Will columns, tables, or graphics cause an ATS to reject my resume?",
    a: "Yes. Many older parsers (such as Workday, Taleo, or Greenhouse) scan text left-to-right across the page. In multi-column or table layouts, this mixes text from different sections together, resulting in unreadable content. To ensure compatibility, use a standard, single-column text layout without tables."
  },
  {
    q: "Does Google Careers use an Applicant Tracking System (ATS)?",
    a: "Google uses its own proprietary applicant tracking and parsing system. Like Workday or other major ATS engines, it is designed to extract professional headers, education history, and key tools. Optimizing your resume format ensures Google's algorithms index your skills correctly."
  },
  {
    q: "What document format is best for ATS compatibility?",
    a: "A standard PDF or Microsoft Word (.docx) file is best. Always ensure your PDF has selectable, highlightable text (not scanned as an image). Plain text (.txt) files are also 100% readable but lack visual styling for human reviewers."
  }
];

export default function FaqAccordion() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <section className="mt-12 border-t border-[#1A1A1A]/10 pt-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-bold text-[#1A1A1A] text-center tracking-tight mb-1">
          Frequently Asked Questions &amp; ATS Guidelines
        </h2>
        <p className="text-xs text-slate-500 text-center mb-6">
          Learn how applicant tracking systems read resumes and improve your compatibility rating.
        </p>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, index) => (
            <div key={index} className="rounded-lg border border-[#1A1A1A]/10 bg-white overflow-hidden transition-all duration-200 hover:border-[#1A1A1A]/20 shadow-sm">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-[#1A1A1A] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-[#008080] font-extrabold text-base leading-none ml-4 select-none">
                  {expandedFaq === index ? '−' : '+'}
                </span>
              </button>
              {expandedFaq === index && (
                <div className="p-4 pt-0 text-xs text-slate-500 leading-relaxed border-t border-slate-100 bg-slate-50 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
