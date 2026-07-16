import type { Metadata } from "next";
import { Playfair_Display, Instrument_Sans } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ATS Resume Checker & Scanner | Free CV Matcher | InterviewReady",
  description: "Audit your resume structure and scan keywords against any job description for free. Get a real-time ATS match rating, readability checklist, and AI rephrasers.",
  keywords: [
    "google careers resume checker",
    "google ats resume checker",
    "free ats resume scanner",
    "interview ready",
    "ats checker online",
    "resume formatting audit",
    "resume keywords match",
    "ai resume review",
    "ats compatibility rating",
    "best free resume checker",
    "ats friendly cv optimizer",
    "ats score test"
  ],
  authors: [{ name: "InterviewReady Team" }],
  openGraph: {
    title: "ATS Resume Checker & Scanner | Free CV Matcher | InterviewReady",
    description: "Scan your resume against any job description in real-time. Get a compatibility score, keyword recommendations, and bullet suggestions.",
    url: "https://resume-matcher-sepia.vercel.app",
    siteName: "InterviewReady",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATS Resume Checker & Scanner | Free CV Matcher",
    description: "Free compatibility scan, formatting audit, and AI bullet rephraser for applicant tracking systems.",
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
    "name": "InterviewReady",
    "url": "https://resume-matcher-sepia.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://resume-matcher-sepia.vercel.app/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Software Application JSON-LD Structured Data
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "InterviewReady",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "342"
    },
    "description": "Free AI-powered ATS resume checker and CV keyword matcher to audit your resume compatibility and optimize keywords for top companies."
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
      className={`${playfair.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A]/10 selection:text-[#1A1A1A]">
        
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
