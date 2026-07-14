'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  RefreshCw, 
  Briefcase, 
  Code,
  FileCheck2,
  Plus
} from 'lucide-react';

// Pre-filled mock data for easier testing
const MOCK_JOB_DESCRIPTION = `We are looking for a Senior Frontend Engineer with 4+ years of experience building scalable web applications. 

Required Skills:
- Strong experience with React, Next.js, and TypeScript
- Expertise in Tailwind CSS and responsive design
- Experience implementing CI/CD pipelines and Docker
- Knowledge of GraphQL and RESTful APIs
- Strong collaboration and communication skills`;

const MOCK_RESUME_CONTENT = `John Doe - Frontend Developer
Experience:
- Built web pages using React and CSS.
- Maintained web applications and worked with APIs.
- Collaborated with QA team to fix bugs.

Skills: React, JavaScript, HTML, CSS, Git.`;

const MOCK_KEYWORDS = [
  { text: 'Next.js', type: 'hard' },
  { text: 'TypeScript', type: 'hard' },
  { text: 'GraphQL', type: 'hard' },
  { text: 'CI/CD Pipelines', type: 'tool' },
  { text: 'Docker', type: 'tool' },
  { text: 'RESTful APIs', type: 'hard' },
  { text: 'Responsive Design', type: 'soft' }
];

const MOCK_TAILORED_BULLETS = [
  {
    id: 1,
    original: 'Built web pages using React and CSS.',
    tailored: 'Architected and built 15+ responsive web pages using React, Next.js, and Tailwind CSS, increasing page load speed by 35%.',
    reason: 'Highlights experience with requested framework (Next.js) and styling tool (Tailwind CSS) while adding quantifiable metrics.'
  },
  {
    id: 2,
    original: 'Maintained web applications and worked with APIs.',
    tailored: 'Integrated complex RESTful and GraphQL APIs with robust error-handling, reducing application runtime exceptions by 18%.',
    reason: 'Addresses the specific requirement for RESTful APIs and GraphQL expertise.'
  },
  {
    id: 3,
    original: 'Collaborated with QA team to fix bugs.',
    tailored: 'Collaborated across cross-functional engineering and QA teams, establishing CI/CD pipeline automation and Docker deployments to streamline release cycles.',
    reason: 'Demonstrates communication, CI/CD experience, and Docker usage as requested.'
  }
];

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeContent, setResumeContent] = useState('');
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  // Custom inputs for missing keywords interaction
  const [keywords, setKeywords] = useState(MOCK_KEYWORDS);
  const [newKeyword, setNewKeyword] = useState('');
  const [showAddKeyword, setShowAddKeyword] = useState(false);

  // Load prefilled examples
  const loadMockData = () => {
    setJobDescription(MOCK_JOB_DESCRIPTION);
    setResumeContent(MOCK_RESUME_CONTENT);
    setFileName(null);
    setActiveTab('paste');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      // Simulate reading resume text
      setResumeContent(`[Uploaded Document: ${file.name}]\n\nJohn Doe\nExperienced React developer specialized in building modern user interfaces.\n\nTechnical Skills: React, Redux, JavaScript, HTML, CSS, Git, Node.js.\nExperience:\n- Developed responsive frontend applications.\n- Collaborated on agile team products.`);
    }
  };

  const startAnalysis = () => {
    if (!jobDescription.trim() || (!resumeContent.trim() && !fileName)) {
      alert('Please fill out both the Job Description and your Resume before analyzing.');
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisCompleted(false);
    setAnimatedScore(0);

    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisCompleted(true);
    }, 1500);
  };

  // Animate the match score percentage gauge once completed
  useEffect(() => {
    if (analysisCompleted) {
      const targetScore = 74; // Mock score percentage
      let current = 0;
      const interval = setInterval(() => {
        current += 2;
        if (current >= targetScore) {
          setAnimatedScore(targetScore);
          clearInterval(interval);
        } else {
          setAnimatedScore(current);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [analysisCompleted]);

  // Copy helper
  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Keyword operations
  const removeKeyword = (idx: number) => {
    setKeywords(keywords.filter((_, i) => i !== idx));
  };

  const addKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim()) {
      setKeywords([...keywords, { text: newKeyword.trim(), type: 'hard' }]);
      setNewKeyword('');
      setShowAddKeyword(false);
    }
  };

  // SVG parameters for progress ring
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <>
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo element matches InvoiceRescue branding */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="ResumeMatch Logo"
              width={36}
              height={36}
              className="rounded-lg shadow-sm"
            />
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              ResumeMatch
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Action pill matches InvoiceRescue subtext badges */}
            <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-100/80 px-3 py-1 text-xs font-medium text-[#008080]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Automated resume optimization</span>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 pl-4 border-l border-slate-200">
              <a href="#" className="text-slate-900 font-semibold transition-colors">Dashboard</a>
              <a href="#" className="hover:text-slate-900 transition-colors">History</a>
              <button 
                onClick={loadMockData} 
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer font-medium"
              >
                <RefreshCw className="h-3 w-3" />
                Load Sample
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-grow flex flex-col gap-10 relative z-10">
        
        {/* Title area matches InvoiceRescue spacing and layout hierarchy */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/60 pb-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Optimize your resume <br />
              <span className="text-[#008080]">for applicant tracking systems.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-500 max-w-2xl font-normal leading-relaxed">
              ResumeMatch compares your profile content against key job description terms in real-time, delivering a match score percentage and instant tailored bullet-point modifications.
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={loadMockData}
              className="md:hidden flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Load Sample Data
            </button>
          </div>
        </div>

        {/* Dashboard Grid split screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Inputs */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="glass-panel rounded-xl p-6 shadow-sm bg-white flex flex-col gap-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Briefcase className="h-5 w-5 text-[#008080]" />
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">Inputs</h2>
              </div>

              {/* Job Description Textarea */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description here..."
                  className="w-full h-48 rounded-lg border border-slate-200 bg-[#f8fafc]/50 p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#008080] focus:border-[#008080] transition-all resize-none"
                />
              </div>

              {/* Resume Input - Paste or File Tab */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Resume Content
                  </label>
                  
                  {/* Tabs */}
                  <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                    <button
                      onClick={() => setActiveTab('paste')}
                      className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                        activeTab === 'paste' 
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Paste Text
                    </button>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                        activeTab === 'upload' 
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                {/* Tab content */}
                {activeTab === 'paste' ? (
                  <textarea
                    value={resumeContent}
                    onChange={(e) => setResumeContent(e.target.value)}
                    placeholder="Paste the current version of your resume here..."
                    className="w-full h-48 rounded-lg border border-slate-200 bg-[#f8fafc]/50 p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#008080] focus:border-[#008080] transition-all resize-none"
                  />
                ) : (
                  <div className="relative group flex flex-col items-center justify-center w-full h-48 border border-dashed border-slate-300 rounded-lg bg-[#f8fafc]/30 hover:bg-[#f8fafc]/60 transition-all p-6 text-center cursor-pointer">
                    <input 
                      type="file" 
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload} 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    
                    {fileName ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-teal-50 text-[#008080] rounded-lg border border-teal-100">
                          <FileCheck2 className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 truncate max-w-xs">{fileName}</p>
                          <p className="text-xs text-slate-500 mt-1">Successfully attached. Click to replace.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-slate-100 text-slate-500 rounded-lg group-hover:text-[#008080] group-hover:bg-teal-50 transition-colors">
                          <UploadCloud className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Drag &amp; drop your resume, or browse</p>
                          <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, or TXT (Max 5MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button matches InvoiceRescue solid teal look */}
              <button
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="w-full mt-2 group py-3 px-6 rounded-lg font-semibold bg-[#008080] hover:bg-[#006666] text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-85 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Analyzing Resume...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze &amp; Match</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel: Analysis View */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="glass-panel rounded-xl p-6 shadow-sm bg-white flex flex-col gap-6 min-h-[516px] relative">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Code className="h-5 w-5 text-[#008080]" />
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">Analysis View</h2>
              </div>

              {!isAnalyzing && !analysisCompleted ? (
                // Empty state view
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center my-auto">
                  <div className="h-14 w-14 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Awaiting matching instructions</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
                    Provide the job description and your resume on the left, then click <strong className="text-[#008080]">"Analyze &amp; Match"</strong> to generate your real-time score and keywords optimization suggestions.
                  </p>
                </div>
              ) : isAnalyzing ? (
                // Analyzing state view
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center my-auto gap-4">
                  <div className="relative flex items-center justify-center h-16 w-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-[#008080] border-r-[#008080] animate-spin"></div>
                    <Sparkles className="h-5 w-5 text-[#008080] animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Running semantic analysis...</h3>
                    <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                      Comparing resume bullets with job key terms to verify ATS compatibility.
                    </p>
                  </div>
                </div>
              ) : (
                // Analysis Completed view
                <div className="flex flex-col gap-6 animate-fadeIn">
                  
                  {/* Top Stats: Score & Summary Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-slate-50 rounded-xl p-5 border border-slate-200">
                    
                    {/* Score (circular progress) */}
                    <div className="sm:col-span-5 flex flex-col items-center justify-center gap-1">
                      <div className="relative flex items-center justify-center">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            className="stroke-slate-200"
                            strokeWidth="6"
                            fill="transparent"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            className="stroke-[#008080] transition-all duration-500 ease-out"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center text-center">
                          <span className="text-xl font-black text-slate-900">{animatedScore}%</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Score</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick feedback message */}
                    <div className="sm:col-span-7 flex flex-col gap-2 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#008080] text-sm font-semibold">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>ATS Verification Approved</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Your layout matches core requirements well. Inject the missing keywords and optimize your bullets to push this matching score above <span className="text-[#008080] font-bold">90%</span>.
                      </p>
                    </div>
                  </div>

                  {/* Missing Keywords Box */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-[#008080]" />
                        Missing Keywords ({keywords.length})
                      </h3>
                      
                      {!showAddKeyword && (
                        <button
                          onClick={() => setShowAddKeyword(true)}
                          className="text-[10px] text-[#008080] hover:text-[#006666] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" /> Add keyword
                        </button>
                      )}
                    </div>

                    {/* Add Keyword inline form */}
                    {showAddKeyword && (
                      <form onSubmit={addKeyword} className="flex gap-2 mb-1">
                        <input
                          type="text"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="e.g. Kubernetes"
                          className="flex-grow rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#008080] focus:border-[#008080]"
                          autoFocus
                        />
                        <button 
                          type="submit"
                          className="bg-[#008080] hover:bg-[#006666] text-white rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer"
                        >
                          Add
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setShowAddKeyword(false); setNewKeyword(''); }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </form>
                    )}

                    <div className="flex flex-wrap gap-2 p-4 rounded-lg bg-slate-50 border border-slate-200 max-h-36 overflow-y-auto">
                      {keywords.length > 0 ? (
                        keywords.map((kw, idx) => (
                          <div 
                            key={idx} 
                            className="group flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 hover:bg-teal-100/70 px-3 py-0.5 text-xs text-teal-800 transition-all font-medium"
                          >
                            <span>{kw.text}</span>
                            <button
                              onClick={() => removeKeyword(idx)}
                              className="text-teal-600 hover:text-rose-600 transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                              title="Delete tag"
                            >
                              &times;
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No missing keywords! You have a full match.</p>
                      )}
                    </div>
                  </div>

                  {/* Tailored Bullet Point Suggestions */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#008080]" />
                      Tailored Bullet Point Suggestions
                    </h3>

                    <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1">
                      {MOCK_TAILORED_BULLETS.map((bullet) => (
                        <div key={bullet.id} className="rounded-lg border border-slate-200 bg-white p-4.5 flex flex-col gap-3">
                          
                          {/* Original line */}
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              Original
                            </span>
                            <p className="text-xs text-slate-500 pl-2.5 border-l border-rose-200 strike-through line-through opacity-85">
                              {bullet.original}
                            </p>
                          </div>

                          {/* Tailored suggestion */}
                          <div className="flex flex-col gap-1.5 mt-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-[#008080]" /> Tailored AI Rewrite
                              </span>
                              <button
                                onClick={() => handleCopy(bullet.id, bullet.tailored)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-[10px] text-slate-600 transition-all cursor-pointer font-medium"
                              >
                                {copiedId === bullet.id ? (
                                  <>
                                    <Check className="h-3 w-3 text-[#008080]" />
                                    <span className="text-[#008080]">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span>Copy rewrite</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <p className="text-xs font-semibold text-slate-800 pl-2.5 border-l-2 border-[#008080]">
                              {bullet.tailored}
                            </p>
                          </div>

                          {/* Rationale explanation */}
                          <div className="text-[11px] text-slate-600 bg-slate-50 rounded-md p-2.5 border border-slate-200">
                            <span className="font-semibold text-slate-900">Why:</span> {bullet.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 py-6 bg-white mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; 2026 ResumeMatch AI. Built for recruitment engineering.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}
