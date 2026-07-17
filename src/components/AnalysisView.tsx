import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ListChecks, 
  Check, 
  X, 
  AlertTriangle, 
  Copy, 
  Download, 
  Edit3, 
  Save 
} from 'lucide-react';
import ScoreRing from './ScoreRing';

interface AnalysisViewProps {
  isAnalyzing: boolean;
  analysisCompleted: boolean;
  score: number;
  animatedScore: number;
  formattingScore: number;
  animatedFormattingScore: number;
  missingKeywords: { text: string; type: string }[];
  setMissingKeywords: (val: { text: string; type: string }[]) => void;
  bullets: { id: number; original: string; tailored: string; reason: string }[];
  isInferred: boolean;
  inferredTitle: string | null;
  hasEmail: boolean;
  hasPhone: boolean;
  hasLinkedIn: boolean;
  sectionsFound: string[];
  formattingIssues: { issue: string; severity: 'error' | 'warning'; fix: string }[];
  isSingleColumn: boolean;
  hasStandardHeaders: boolean;
  hasConsistentDates: boolean;
  noGraphicsOrCharts: boolean;
  fileName: string | null;
}

export default function AnalysisView({
  isAnalyzing,
  analysisCompleted,
  score,
  animatedScore,
  formattingScore,
  animatedFormattingScore,
  missingKeywords,
  setMissingKeywords,
  bullets,
  isInferred,
  inferredTitle,
  hasEmail,
  hasPhone,
  hasLinkedIn,
  sectionsFound,
  formattingIssues,
  isSingleColumn,
  hasStandardHeaders,
  hasConsistentDates,
  noGraphicsOrCharts,
  fileName
}: AnalysisViewProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showAddKeyword, setShowAddKeyword] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  
  // Interactive Bullets Editor State
  const [editableBullets, setEditableBullets] = useState<typeof bullets>([]);
  const [editingBulletId, setEditingBulletId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    setEditableBullets(bullets);
  }, [bullets]);

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const removeKeyword = (idx: number) => {
    setMissingKeywords(missingKeywords.filter((_, i) => i !== idx));
  };

  const addKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim()) {
      setMissingKeywords([...missingKeywords, { text: newKeyword.trim(), type: 'hard' }]);
      setNewKeyword('');
      setShowAddKeyword(false);
    }
  };

  const startEditing = (id: number, currentText: string) => {
    setEditingBulletId(id);
    setEditingText(currentText);
  };

  const saveEditing = (id: number) => {
    setEditableBullets(editableBullets.map(b => b.id === id ? { ...b, tailored: editingText } : b));
    setEditingBulletId(null);
  };

  const handleExportReport = () => {
    const reportText = `=================================================
INTERVIEWREADY ATS CV COMPATIBILITY REPORT
=================================================
File Name: ${fileName || 'Pasted Content'}
Date of Scan: ${new Date().toLocaleDateString()}
Keyword Match score: ${score}%
ATS Formatting Readiness: ${formattingScore}%
${isInferred && inferredTitle ? `Inferred Job Target: ${inferredTitle}\n` : ''}
-------------------------------------------------
MISSING KEYWORDS / SKILLS:
${missingKeywords.length > 0 
  ? missingKeywords.map((kw, i) => `  [ ] ${kw.text}`).join('\n') 
  : '  [✓] No missing keywords! Excellent match.'}

-------------------------------------------------
ATS FORMATTING AUDIT DETAILS:
  - Email Address: ${hasEmail ? 'Detected' : 'Missing'}
  - Phone Number: ${hasPhone ? 'Detected' : 'Missing'}
  - LinkedIn Profile: ${hasLinkedIn ? 'Detected' : 'Missing'}
  - Experience Section: ${sectionsFound.includes('experience') ? 'Detected' : 'Missing'}
  - Single-Column Layout: ${isSingleColumn ? 'Yes' : 'No'}
  - Standard Headers: ${hasStandardHeaders ? 'Yes' : 'No'}
  - Date Consistency: ${hasConsistentDates ? 'Yes' : 'No'}
  - Clean of Graphics: ${noGraphicsOrCharts ? 'Yes' : 'No'}

WARNINGS & ACTION ITEMS:
${formattingIssues.length > 0 
  ? formattingIssues.map((issue, i) => `  ${i + 1}. [${issue.severity.toUpperCase()}] ${issue.issue}\n     Fix: ${issue.fix}`).join('\n\n') 
  : '  ✓ No warnings found! Your formatting is fully ATS-friendly.'}

-------------------------------------------------
TAILORED AI RESUME BULLET POINTS:
${editableBullets.map((b, i) => `  ${i + 1}. Original:
        "${b.original}"
     Tailored:
        "${b.tailored}"
     Rationale:
        ${b.reason}`).join('\n\n')}

=================================================
Optimized with InterviewReady Career Suite
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `InterviewReady-ATS-Report-${fileName ? fileName.split('.')[0] : 'Resume'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel rounded-xl p-6 bg-card-bg flex flex-col gap-6 min-h-[516px] relative border border-[#1A1A1A]/10">
      
      {!isAnalyzing && !analysisCompleted ? (
        // Empty State View
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center my-auto">
          <div className="h-14 w-14 bg-slate-50 rounded-xl border border-[#1A1A1A]/10 flex items-center justify-center text-slate-400 mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-[#1A1A1A]">Awaiting matching instructions</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
            Provide the job description and your resume on the left, then click <strong className="text-[#008080]">&quot;Analyze &amp; Match&quot;</strong> to generate your real-time score and keywords optimization suggestions.
          </p>
        </div>
      ) : isAnalyzing ? (
        // Analyzing State View
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center my-auto gap-4">
          <div className="relative flex items-center justify-center h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-[#008080] border-r-[#008080] animate-spin"></div>
            <Sparkles className="h-5 w-5 text-[#008080] animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1A1A1A]">Running semantic analysis...</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
              Comparing resume bullets with role requirements to verify ATS compatibility.
            </p>
          </div>
        </div>
      ) : (
        // Analysis Completed View
        <div className="flex flex-col gap-6 animate-fadeIn">
          
          {/* Job Title Inference Banner */}
          {isInferred && inferredTitle && (
            <div className="flex items-start gap-3 rounded-lg border border-teal-100 bg-teal-50/50 p-3.5 text-xs text-slate-700">
              <Sparkles className="h-4 w-4 text-[#008080] shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="font-bold text-slate-900">Matcher Inference Mode:</span> We detected a brief input and dynamically generated industry requirements for <strong className="text-[#008080] font-bold">"{inferredTitle}"</strong> to compare your resume.
              </div>
            </div>
          )}

          {/* Score Rings and Feedback */}
          <div className="flex flex-col gap-4 bg-slate-50 rounded-xl p-5 border border-[#1A1A1A]/10">
            <div className="grid grid-cols-2 gap-4 items-center justify-items-center">
              
              <ScoreRing 
                score={animatedScore} 
                label="Match" 
                strokeColorClass="stroke-[#008080]" 
                subLabel="Keyword Match"
              />

              <ScoreRing 
                score={animatedFormattingScore} 
                label="Format" 
                strokeColorClass="stroke-[#006666]" 
                subLabel="ATS Format"
              />

            </div>

            <div className="flex flex-col gap-1 pt-3 border-t border-slate-200/60 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#008080] text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>ATS Audit Completed</span>
              </div>
              <p className="text-xs text-slate-600 leading-normal font-normal">
                {animatedScore >= 80 && animatedFormattingScore >= 80 
                  ? "Excellent! Your resume has very high keyword match alignment and meets standard ATS formatting rules."
                  : "Improve your scoring by addressing the formatting checklist and missing keywords below."}
              </p>
            </div>
          </div>

          {/* Social Share & Report Download Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border border-teal-100 bg-teal-50/30">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#008080] shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800">Review Actions</span>
                <span className="text-[10px] text-slate-500">Download report or share your scorecard.</span>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportReport}
                className="flex-grow sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded border border-[#008080]/30 hover:border-[#008080] bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-900 text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
                title="Download full report as text file"
              >
                <Download className="h-3.5 w-3.5 text-[#008080]" />
                <span>Export Report</span>
              </button>
              <button
                onClick={() => {
                  const bragText = `🎯 I just audited my resume using InterviewReady and got a ${animatedScore}% Match & ${animatedFormattingScore}% ATS formatting score! Check your compatibility for free: https://resume-matcher-sepia.vercel.app/ #InterviewReady #ATSChecker`;
                  navigator.clipboard.writeText(bragText);
                  alert("Brag post copied successfully! Paste on LinkedIn or X/Twitter.");
                }}
                className="flex-grow sm:flex-none px-3.5 py-1.5 rounded bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
              >
                Brag on Socials
              </button>
            </div>
          </div>

          {/* Missing Keywords Box */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-[#008080]" />
                Missing Keywords ({missingKeywords.length})
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
                  placeholder="e.g. Communication"
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
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs cursor-pointer border border-[#1A1A1A]/10"
                >
                  Cancel
                </button>
              </form>
            )}

            <div className="flex flex-wrap gap-2 p-4 rounded-lg bg-slate-50 border border-slate-200 max-h-36 overflow-y-auto">
              {missingKeywords.length > 0 ? (
                missingKeywords.map((kw, idx) => (
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
                score === 0 ? (
                  <p className="text-xs text-slate-400 italic font-normal">
                    No keywords matched. Please enter a detailed job description or configure your Gemini API Key in Vercel settings for dynamic role requirements generation.
                  </p>
                ) : (
                  <p className="text-xs text-[#008080] italic font-semibold">No missing keywords! You have a full match.</p>
                )
              )}
            </div>
          </div>

          {/* ATS Formatting Checklist */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ListChecks className="h-3.5 w-3.5 text-[#008080]" />
              ATS Readability Checklist ({formattingIssues.length} warnings)
            </h3>
            
            <div className="flex flex-col gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 pb-3.5 border-b border-slate-200/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                  {hasEmail ? <Check className="h-3.5 w-3.5 text-[#008080] font-black" /> : <X className="h-3.5 w-3.5 text-rose-500 font-bold" />}
                  <span>Email address</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                  {hasPhone ? <Check className="h-3.5 w-3.5 text-[#008080] font-black" /> : <X className="h-3.5 w-3.5 text-rose-500 font-bold" />}
                  <span>Phone number</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                  {hasLinkedIn ? <Check className="h-3.5 w-3.5 text-[#008080] font-black" /> : <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                  <span>LinkedIn Link</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                  {sectionsFound.includes('experience') ? <Check className="h-3.5 w-3.5 text-[#008080] font-black" /> : <X className="h-3.5 w-3.5 text-rose-500 font-bold" />}
                  <span>Experience Section</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                  {isSingleColumn ? <Check className="h-3.5 w-3.5 text-[#008080] font-black" /> : <X className="h-3.5 w-3.5 text-rose-500 font-bold" />}
                  <span>Single-Column Layout</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                  {hasStandardHeaders ? <Check className="h-3.5 w-3.5 text-[#008080] font-black" /> : <X className="h-3.5 w-3.5 text-rose-500 font-bold" />}
                  <span>Standard Headers</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                  {hasConsistentDates ? <Check className="h-3.5 w-3.5 text-[#008080] font-black" /> : <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                  <span>Consistent Dates Format</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                  {noGraphicsOrCharts ? <Check className="h-3.5 w-3.5 text-[#008080] font-black" /> : <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                  <span>No Graphics/Bar Charts</span>
                </div>
              </div>

              {/* Formatting warnings list */}
              <div className="flex flex-col gap-2.5 max-h-[180px] overflow-y-auto pr-1">
                {formattingIssues.length > 0 ? (
                  formattingIssues.map((issue, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-slate-600 bg-white rounded border border-slate-200 p-2.5 shadow-sm">
                      {issue.severity === 'error' ? (
                        <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-900 text-[11px]">{issue.issue}</span>
                        <p className="text-[10px] text-slate-500 leading-normal font-normal">{issue.fix}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#008080] italic flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>No formatting warnings found! Document is fully ATS-readable.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tailored Bullet Point Suggestions */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#008080]" />
              Tailored Bullet Point Suggestions (Click text to edit)
            </h3>

            <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1">
              {editableBullets.map((bullet) => (
                <div key={bullet.id} className="rounded-lg border border-slate-200 bg-white p-4.5 flex flex-col gap-3 hover:border-slate-300 transition-all">
                  
                  {/* Original Bullet */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Original
                    </span>
                    <p className="text-xs text-slate-500 pl-2.5 border-l border-rose-200 strike-through line-through opacity-85">
                      {bullet.original}
                    </p>
                  </div>

                  {/* Tailored Bullet */}
                  <div className="flex flex-col gap-1.5 mt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-[#008080] uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-[#008080]" /> Tailored AI Rewrite
                      </span>
                      
                      <div className="flex items-center gap-1">
                        {editingBulletId === bullet.id ? (
                          <button
                            onClick={() => saveEditing(bullet.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded border border-teal-200 bg-teal-50 hover:bg-teal-100 hover:text-teal-900 text-[10px] text-teal-800 transition-all cursor-pointer font-medium"
                          >
                            <Save className="h-3 w-3 text-[#008080]" />
                            <span>Save</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => startEditing(bullet.id, bullet.tailored)}
                            className="flex items-center gap-1 px-2 py-1 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-[10px] text-slate-600 transition-all cursor-pointer font-medium"
                            title="Edit this rewrite"
                          >
                            <Edit3 className="h-3 w-3 text-slate-600" />
                            <span>Edit</span>
                          </button>
                        )}
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
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {editingBulletId === bullet.id ? (
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full rounded border border-slate-200 p-2 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#008080] resize-y"
                        rows={3}
                      />
                    ) : (
                      <p className="text-xs font-semibold text-slate-800 pl-2.5 border-l-2 border-[#008080]">
                        {bullet.tailored}
                      </p>
                    )}
                  </div>

                  {/* Why Rationale */}
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
  );
}
