import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Google ATS Resume Checker & Auditor | Free ATS Score Review",
  description: "Audit your resume for Google Careers and other applicant tracking systems (ATS). Get a free match score, formatting audit checklist, and tailored AI suggestions.",
  keywords: [
    "google careers resume checker",
    "google ats resume checker",
    "free ats resume scanner",
    "resume matcher",
    "ats checker online",
    "resume formatting audit",
    "resume keywords match",
    "ai resume review",
    "ats compatibility rating"
  ],
  authors: [{ name: "Google Careers ATS Assistant" }],
  openGraph: {
    title: "Google ATS Resume Checker & Auditor | Free Compatibility Scan",
    description: "Audit your resume structure and keyword density against top industry criteria with a free real-time ATS match rating.",
    url: "https://resumematch-ai.vercel.app",
    siteName: "Google ATS Assistant",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Google ATS Resume Checker & Auditor",
    description: "Free compatibility scan, formatting audit, and AI bullet rephraser for Google applicant tracking systems.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Sitelinks Search Box JSON-LD Structured Data
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ResumeMatch AI",
    "url": "https://resumematch-ai.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://resumematch-ai.vercel.app/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Software Application JSON-LD Structured Data
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ResumeMatch AI",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "AI-Powered Resume Matcher & Tailor Engine to scan your resume against job descriptions for ATS optimization."
  };

  // FAQ Page JSON-LD Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does the Google ATS Resume Checker calculate the scores?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The tool uses dual-scanning matrices: Keyword Match Rate (comparing your resume's skills with the job description using semantic analysis) and ATS Formatting Readiness (verifying formatting parameters like section headings, contact information presence, and parsing structure). Combined, they calculate your overall ATS compatibility."
        }
      },
      {
        "@type": "Question",
        "name": "Will columns or graphics cause an ATS to reject my resume?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, many older ATS parsers (like Workday, Taleo, and Greenhouse) struggle to scan multi-column layouts, tables, and images. They read text from left-to-right across the entire page, which mixes content from parallel columns. It is highly recommended to use a clean, single-column text layout without tables."
        }
      },
      {
        "@type": "Question",
        "name": "Does Google Hire use an Applicant Tracking System (ATS)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Google Careers uses its own internal applicant tracking and parsing system. Like other premium ATS engines, it scans resumes for contact info (email, phone, LinkedIn), structured section dividers (Experience, Education, Skills), and matching keywords. Standardizing your layout guarantees your text parses accurately."
        }
      },
      {
        "@type": "Question",
        "name": "What document format is best for ATS compatibility?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A standard PDF or a Microsoft Word (.docx) file is best. Ensure your PDF has selectable, copyable text (not scanned as an image). Plain text (.txt) files are also 100% readable but lack professional styling for human reviewers."
        }
      }
    ]
  };

  // Google Analytics ID Configuration
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-TJ530NH7BX";

  // Google AdSense Publisher ID Configuration - Defaulted to your ID
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-8454683847069141";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-[#0f172a] font-sans selection:bg-teal-500/25 selection:text-teal-900">
        
        {/* Google AdSense integration */}
        {adsenseClientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        <div className="relative min-h-screen flex flex-col overflow-hidden">
          {children}
        </div>

        {/* Search Engine Optimization JSON-LD schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Google Analytics */}
        {gaId && (
          <GoogleAnalytics gaId={gaId} />
        )}
      </body>
    </html>
  );
}
