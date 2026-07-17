import React, { useState } from 'react';
import { Sparkles, Copy, Check, Download, AlertCircle, RefreshCw, Send } from 'lucide-react';

interface CoverLetterWriterProps {
  jobDescription: string;
  resumeContent: string;
}

type ToneType = 'professional' | 'enthusiastic' | 'concise' | 'creative';

export default function CoverLetterWriter({ jobDescription, resumeContent }: CoverLetterWriterProps) {
  const [tone, setTone] = useState<ToneType>('professional');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim() || !resumeContent.trim()) {
      alert('Please make sure you have filled in both the Job Description and your Resume in the Inputs section first.');
      return;
    }

    setIsGenerating(true);
    setCopied(false);
    
    try {
      const response = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription, resumeContent, tone }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.coverLetter) {
          setGeneratedLetter(data.coverLetter);
        } else {
          throw new Error('Failed to generate cover letter');
        }
      } else {
        throw new Error('Server returned an error');
      }
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
      alert('Failed to connect to the generator. Please verify your GEMINI_API_KEY is configured in your environment.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedLetter) return;
    const blob = new Blob([generatedLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tailored-Cover-Letter-${tone}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tones: { id: ToneType; name: string; desc: string }[] = [
    { id: 'professional', name: 'Professional', desc: 'Authoritative, clear, and structured.' },
    { id: 'enthusiastic', name: 'Enthusiastic', desc: 'Passionate, energetic, and highly driven.' },
    { id: 'concise', name: 'Concise', desc: 'Short, direct, and highlighting core values.' },
    { id: 'creative', name: 'Creative', desc: 'Story-driven and conversational tone.' },
  ];

  const hasInputs = jobDescription.trim().length > 0 && resumeContent.trim().length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
      
      {/* Left panel: tone settings & actions */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="glass-panel rounded-xl p-5 bg-card-bg border border-[#1A1A1A]/10 flex flex-col gap-5">
          <div className="pb-3 border-b border-[#1A1A1A]/10">
            <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Cover Letter Config</h3>
            <p className="text-[10px] text-slate-500 mt-1">Select the tone of voice for the AI writer.</p>
          </div>

          {/* Tone Selector */}
          <div className="flex flex-col gap-2">
            {tones.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`w-full text-left p-3.5 rounded-lg border text-xs transition-all cursor-pointer ${
                  tone === t.id 
                    ? 'border-[#008080] bg-teal-50/20 text-[#008080] font-bold shadow-sm' 
                    : 'border-[#1A1A1A]/10 hover:border-[#1A1A1A]/20 bg-white text-slate-700'
                }`}
              >
                <div className="font-semibold">{t.name}</div>
                <div className="text-[10px] font-normal text-slate-400 mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>

          {!hasInputs && (
            <div className="flex items-start gap-2 text-[10px] text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-3">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
              <span>Make sure to add your target Job Description and Resume details in the main <strong>Inputs</strong> dashboard to enable writing.</span>
            </div>
          )}

          {/* Run Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !hasInputs}
            className="w-full group py-3 px-6 rounded-lg font-semibold bg-[#008080] hover:bg-[#006666] text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Writing cover letter...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Cover Letter</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right panel: generated letter view */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="glass-panel rounded-xl p-6 bg-card-bg border border-[#1A1A1A]/10 flex flex-col gap-5 min-h-[480px]">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]/10">
            <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#008080]" />
              Tailored Letter Output
            </h3>
            
            {generatedLetter && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-[10px] text-slate-600 transition-all cursor-pointer font-bold"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#008080]" />
                      <span className="text-[#008080]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Letter</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-3 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-[10px] text-slate-600 transition-all cursor-pointer font-bold"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
              </div>
            )}
          </div>

          {generatedLetter ? (
            <div className="flex-grow rounded-lg border border-[#1A1A1A]/10 bg-white p-6 shadow-sm overflow-auto text-sm text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
              {generatedLetter}
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <div className="h-12 w-12 bg-slate-50 rounded-xl border border-[#1A1A1A]/10 flex items-center justify-center text-slate-400 mb-3">
                <Send className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-[#1A1A1A]">No Cover Letter Generated Yet</p>
              <p className="text-[11px] text-slate-500 max-w-sm mt-1">
                Configure your tone on the left and click "Generate Cover Letter" to build a customized, high-impact introductory statement.
              </p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
