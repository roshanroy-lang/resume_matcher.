import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "ResumeMatch AI - AI-Powered Resume Matcher & Tailor Engine",
  description: "Optimize your resume for applicant tracking systems (ATS). Check keywords compatibility, get real-time match scores, and tailor bullet points instantly.",
  keywords: [
    "resume matcher",
    "ats checker",
    "resume optimizer",
    "resume tailor",
    "cv scanner",
    "job description match",
    "ai resume review",
    "ats compatibility"
  ],
  authors: [{ name: "ResumeMatch AI" }],
  openGraph: {
    title: "ResumeMatch AI - AI-Powered Resume Matcher & Tailor Engine",
    description: "Compare your resume against any job description with real-time match scores and tailored suggestions.",
    url: "https://resumematch-ai.vercel.app",
    siteName: "ResumeMatch AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeMatch AI - Optimize Your Resume for ATS",
    description: "Compare your resume against job descriptions with real-time matching and tailored rewrite suggestions.",
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

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-[#0f172a] font-sans selection:bg-teal-500/25 selection:text-teal-900">
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
      </body>
    </html>
  );
}
