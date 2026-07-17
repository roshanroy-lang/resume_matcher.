'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Briefcase, RefreshCw, FileText, Mail, Compass } from 'lucide-react';

// Sub-components
import Header from '../components/Header';
import Footer from '../components/Footer';
import InputsPanel from '../components/InputsPanel';
import AnalysisView from '../components/AnalysisView';
import FaqAccordion from '../components/FaqAccordion';
import CoverLetterWriter from '../components/CoverLetterWriter';
import InterviewPrepRoom from '../components/InterviewPrepRoom';

// Data & Utilities
import { MOCK_DATA } from '../data/mockTemplates';
import { runLocalFallbackMatching } from '../utils/matcher';

export default function Home() {
  // Navigation View State
  const [activeView, setActiveView] = useState<'audit' | 'cover-letter' | 'interview-prep'>('audit');

  // Global inputs workspace states (shared across tabs)
  const [jobDescription, setJobDescription] = useState('');
  const [resumeContent, setResumeContent] = useState('');
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [fileName, setFileName] = useState<string | null>(null);
  
  // Selected industry template key
  const [industryKey, setIndustryKey] = useState<keyof typeof MOCK_DATA>('tech');

  // Loading/Running states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);

  // Analysis result scores & animations
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [formattingScore, setFormattingScore] = useState(0);
  const [animatedFormattingScore, setAnimatedFormattingScore] = useState(0);
  
  // Audit detailed attributes
  const [missingKeywords, setMissingKeywords] = useState<{text: string, type: string}[]>([]);
  const [bullets, setBullets] = useState<{id: number, original: string, tailored: string, reason: string}[]>([]);
  const [isInferred, setIsInferred] = useState(false);
  const [inferredTitle, setInferredTitle] = useState<string | null>(null);

  const [hasEmail, setHasEmail] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);
  const [hasLinkedIn, setHasLinkedIn] = useState(false);
  const [sectionsFound, setSectionsFound] = useState<string[]>([]);
  const [formattingIssues, setFormattingIssues] = useState<{issue: string, severity: 'error' | 'warning', fix: string}[]>([]);
  const [isSingleColumn, setIsSingleColumn] = useState(true);
  const [hasStandardHeaders, setHasStandardHeaders] = useState(true);
  const [hasConsistentDates, setHasConsistentDates] = useState(true);
  const [noGraphicsOrCharts, setNoGraphicsOrCharts] = useState(true);

  // Load selected industry template
  const handleLoadMockData = (key: keyof typeof MOCK_DATA) => {
    const data = MOCK_DATA[key];
    setJobDescription(data.jobDescription);
    setResumeContent(data.resumeContent);
    setFileName(null);
    setActiveTab('paste');
    setAnalysisCompleted(false);
    setAnimatedScore(0);
    setAnimatedFormattingScore(0);
    setIsInferred(false);
    setInferredTitle(null);
    setScore(0);
    setFormattingScore(0);
    setHasEmail(false);
    setHasPhone(false);
    setHasLinkedIn(false);
    setSectionsFound([]);
    setFormattingIssues([]);
    setIsSingleColumn(true);
    setHasStandardHeaders(true);
    setHasConsistentDates(true);
    setNoGraphicsOrCharts(true);
  };

  // Perform document analysis
  const startAnalysis = async () => {
    if (!jobDescription.trim() || (!resumeContent.trim() && !fileName)) {
      alert('Please fill out both the Job Description and your Resume before analyzing.');
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisCompleted(false);
    setAnimatedScore(0);
    setAnimatedFormattingScore(0);
    setIsInferred(false);
    setInferredTitle(null);
    setScore(0);
    setFormattingScore(0);
    setMissingKeywords([]);
    setBullets([]);
    setHasEmail(false);
    setHasPhone(false);
    setHasLinkedIn(false);
    setSectionsFound([]);
    setFormattingIssues([]);

    try {
      // 1. Call upgraded Gemini 2.0 API Route
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription, resumeContent }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (!data.fallback) {
          setScore(data.score);
          setFormattingScore(data.formattingScore ?? 80);
          setMissingKeywords((data.missingKeywords || []).map((kw: string) => ({
            text: kw,
            type: 'hard'
          })));
          setHasEmail(!!data.hasEmail);
          setHasPhone(!!data.hasPhone);
          setHasLinkedIn(!!data.hasLinkedIn);
          setSectionsFound(data.sectionsFound || []);
          setFormattingIssues(data.formattingIssues || []);
          setBullets(data.bullets || []);
          setIsInferred(!!data.isInferred);
          setInferredTitle(data.inferredTitle || null);
          setIsSingleColumn(data.isSingleColumn !== false);
          setHasStandardHeaders(data.hasStandardHeaders !== false);
          setHasConsistentDates(data.hasConsistentDates !== false);
          setNoGraphicsOrCharts(data.noGraphicsOrCharts !== false);
          
          setIsAnalyzing(false);
          setAnalysisCompleted(true);
          return;
        }
      }
    } catch (err) {
      console.warn('API Route error, running local fallback algorithm...', err);
    }

    // 2. FALLBACK: Client-side local matching engine
    setTimeout(() => {
      const result = runLocalFallbackMatching(jobDescription, resumeContent);
      
      setScore(result.score);
      setFormattingScore(result.formattingScore);
      setHasEmail(result.hasEmail);
      setHasPhone(result.hasPhone);
      setHasLinkedIn(result.hasLinkedIn);
      setSectionsFound(result.sectionsFound);
      setFormattingIssues(result.formattingIssues);
      setMissingKeywords(result.missingKeywords);
      setBullets(result.bullets);
      setIsSingleColumn(result.isSingleColumn);
      setHasStandardHeaders(result.hasStandardHeaders);
      setHasConsistentDates(result.hasConsistentDates);
      setNoGraphicsOrCharts(result.noGraphicsOrCharts);
      setIsInferred(result.isInferred);
      setInferredTitle(result.inferredTitle);

      setIsAnalyzing(false);
      setAnalysisCompleted(true);
    }, 1200);
  };

  // Animate Match Score and Formatting Score from 0 to target scores
  useEffect(() => {
    if (analysisCompleted) {
      let currentScore = 0;
      let currentFmt = 0;
      const interval = setInterval(() => {
        let updated = false;
        if (currentScore < score) {
          currentScore += 2;
          if (currentScore >= score) {
            setAnimatedScore(score);
          } else {
            setAnimatedScore(currentScore);
            updated = true;
          }
        }
        if (currentFmt < formattingScore) {
          currentFmt += 2;
          if (currentFmt >= formattingScore) {
            setAnimatedFormattingScore(formattingScore);
          } else {
            setAnimatedFormattingScore(currentFmt);
            updated = true;
          }
        }
        if (!updated) {
          clearInterval(interval);
        }
      }, 15);
      return () => clearInterval(interval);
    }
  }, [analysisCompleted, score, formattingScore]);

  return (
    <>
      <Header />

      {/* Main Content Dashboard */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-grow flex flex-col gap-10 relative z-10">
        
        {/* Banner Headline */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#1A1A1A]/10 pb-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black text-[#1A1A1A] tracking-tight leading-tight">
              Optimize your career <br />
              <span className="text-[#008080]">with AI-powered recruitment tools.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              Verify ATS resume compatibility, write tailored cover letters, and train in mock interview prep loops in one unified dashboard workspace.
            </p>
          </div>
          
          {/* Quick industry selector widget */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[#FAF7F2] p-3 rounded-xl border border-[#1A1A1A]/10 shadow-sm self-start lg:self-auto">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Briefcase className="h-3.5 w-3.5 text-[#008080]" />
              <span>Load Template Inputs:</span>
            </div>
            <select
              value={industryKey}
              onChange={(e) => {
                const key = e.target.value as keyof typeof MOCK_DATA;
                setIndustryKey(key);
                handleLoadMockData(key);
              }}
              className="bg-white border border-[#1A1A1A]/10 text-xs font-semibold text-[#1A1A1A] rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#008080] cursor-pointer"
            >
              <option value="tech">Technology / Software Dev</option>
              <option value="marketing">Marketing / Growth Sales</option>
              <option value="management">Project Management / Leadership</option>
              <option value="healthcare">Healthcare / Registered Nursing</option>
            </select>
            
            <button
              onClick={() => handleLoadMockData(industryKey)}
              className="flex items-center gap-1.5 rounded-lg border border-[#1A1A1A]/10 bg-white hover:bg-slate-50 px-3 py-2 text-xs text-[#1A1A1A] font-bold transition-all cursor-pointer"
              title="Reset sample data for selected industry"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Load Template</span>
            </button>
          </div>
        </div>

        {/* Unified Tool Selection Tabs */}
        <div className="flex border-b border-[#1A1A1A]/10 gap-2 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveView('audit')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
              activeView === 'audit'
                ? 'border-[#008080] text-[#008080]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Resume Matcher</span>
          </button>
          <button
            onClick={() => setActiveView('cover-letter')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
              activeView === 'cover-letter'
                ? 'border-[#008080] text-[#008080]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="h-4 w-4" />
            <span>Cover Letter Writer</span>
          </button>
          <button
            onClick={() => setActiveView('interview-prep')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
              activeView === 'interview-prep'
                ? 'border-[#008080] text-[#008080]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Interview Prep Room</span>
          </button>
        </div>

        {/* Global Inputs state summary reminder for Cover Letter and Interview Prep pages */}
        {activeView !== 'audit' && (
          <div className="rounded-lg border border-[#1A1A1A]/10 bg-slate-50 p-3 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[#008080]" />
              <span>
                Workspace inputs: <strong>{jobDescription.trim() ? `${jobDescription.trim().split(/\s+/).length} words JD` : 'No JD'}</strong>, <strong>{resumeContent.trim() ? `${resumeContent.trim().split(/\s+/).length} words Resume` : 'No Resume'}</strong>.
              </span>
            </div>
            <button 
              onClick={() => setActiveView('audit')} 
              className="text-[#008080] hover:text-[#006666] font-bold hover:underline cursor-pointer"
            >
              Modify inputs in Resume Matcher &rarr;
            </button>
          </div>
        )}

        {/* Tab Views rendering */}
        {activeView === 'audit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Panel: Inputs (Textareas and File Uploader) */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="flex items-center gap-2 pb-1 border-b border-[#1A1A1A]/10">
                <Briefcase className="h-5 w-5 text-[#008080]" />
                <h2 className="text-base font-bold text-[#1A1A1A] uppercase tracking-wider text-xs">Inputs</h2>
              </div>
              <InputsPanel 
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                resumeContent={resumeContent}
                setResumeContent={setResumeContent}
                fileName={fileName}
                setFileName={setFileName}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                startAnalysis={startAnalysis}
                isAnalyzing={isAnalyzing}
              />
            </div>

            {/* Right Panel: Analysis Result Views */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="flex items-center gap-2 pb-1 border-b border-[#1A1A1A]/10">
                <Sparkles className="h-5 w-5 text-[#008080]" />
                <h2 className="text-base font-bold text-[#1A1A1A] uppercase tracking-wider text-xs">Analysis View</h2>
              </div>
              <AnalysisView 
                isAnalyzing={isAnalyzing}
                analysisCompleted={analysisCompleted}
                score={score}
                animatedScore={animatedScore}
                formattingScore={formattingScore}
                animatedFormattingScore={animatedFormattingScore}
                missingKeywords={missingKeywords}
                setMissingKeywords={setMissingKeywords}
                bullets={bullets}
                isInferred={isInferred}
                inferredTitle={inferredTitle}
                hasEmail={hasEmail}
                hasPhone={hasPhone}
                hasLinkedIn={hasLinkedIn}
                sectionsFound={sectionsFound}
                formattingIssues={formattingIssues}
                isSingleColumn={isSingleColumn}
                hasStandardHeaders={hasStandardHeaders}
                hasConsistentDates={hasConsistentDates}
                noGraphicsOrCharts={noGraphicsOrCharts}
                fileName={fileName}
              />
            </div>

          </div>
        )}

        {activeView === 'cover-letter' && (
          <CoverLetterWriter 
            jobDescription={jobDescription}
            resumeContent={resumeContent}
          />
        )}

        {activeView === 'interview-prep' && (
          <InterviewPrepRoom 
            jobDescription={jobDescription}
            resumeContent={resumeContent}
          />
        )}

        {/* FAQ Section */}
        <FaqAccordion />

      </main>

      <Footer />
    </>
  );
}
