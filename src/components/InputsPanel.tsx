import React, { useState } from 'react';
import { UploadCloud, FileCheck2, RefreshCw, ArrowRight } from 'lucide-react';
import { extractTextFromPdf, extractTextFromDocx } from '../utils/parsers';

interface InputsPanelProps {
  jobDescription: string;
  setJobDescription: (val: string) => void;
  resumeContent: string;
  setResumeContent: (val: string) => void;
  fileName: string | null;
  setFileName: (val: string | null) => void;
  activeTab: 'paste' | 'upload';
  setActiveTab: (tab: 'paste' | 'upload') => void;
  startAnalysis: () => void;
  isAnalyzing: boolean;
}

export default function InputsPanel({
  jobDescription,
  setJobDescription,
  resumeContent,
  setResumeContent,
  fileName,
  setFileName,
  activeTab,
  setActiveTab,
  startAnalysis,
  isAnalyzing
}: InputsPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleFileUpload = async (file: File) => {
    setFileName(file.name);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'txt') {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setResumeContent(event.target.result as string);
          setActiveTab('paste');
        }
      };
      reader.readAsText(file);
    } else {
      setIsExtracting(true);
      try {
        let extractedText = '';
        if (fileExtension === 'pdf') {
          extractedText = await extractTextFromPdf(file);
        } else if (fileExtension === 'docx') {
          extractedText = await extractTextFromDocx(file);
        } else {
          throw new Error('Unsupported file format');
        }
        setResumeContent(extractedText);
        setActiveTab('paste');
      } catch (error) {
        console.error('Failed to extract text from file:', error);
        alert('Failed to extract text from your file. Please ensure it is a readable document, or try copying and pasting the text directly.');
      } finally {
        setIsExtracting(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const isExtractionPending = isExtracting || isAnalyzing;

  return (
    <div className="glass-panel rounded-xl p-6 bg-card-bg flex flex-col gap-5 border border-[#1A1A1A]/10">
      
      {/* Job Description Textarea */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Target Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description or role requirements here..."
          className="w-full h-48 rounded-lg border border-[#1A1A1A]/10 bg-white p-4 text-sm text-[#1A1A1A] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#008080] focus:border-[#008080] transition-all resize-none"
        />
      </div>

      {/* Resume Input - Paste or File Tab */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Your Current Resume
          </label>
          
          {/* Tabs */}
          <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-3 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'paste' 
                  ? 'bg-white text-[#008080] border border-[#008080] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'upload' 
                  ? 'bg-white text-[#008080] border border-[#008080] shadow-sm' 
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
            placeholder="Paste the current text of your CV / Resume..."
            className="w-full h-48 rounded-lg border border-[#1A1A1A]/10 bg-white p-4 text-sm text-[#1A1A1A] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#008080] focus:border-[#008080] transition-all resize-none"
          />
        ) : (
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative group flex flex-col items-center justify-center w-full h-48 border border-dashed rounded-lg bg-white transition-all p-6 text-center cursor-pointer ${
              isDragging 
                ? 'border-[#008080] bg-teal-50/20 scale-[1.01]' 
                : 'border-[#1A1A1A]/20 hover:bg-slate-50/50'
            }`}
          >
            <input 
              type="file" 
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
            
            {fileName ? (
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-teal-50 text-[#008080] rounded-lg border border-teal-100">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A] truncate max-w-xs">{fileName}</p>
                  <p className="text-xs text-slate-500 mt-1">Successfully attached. Click or drop to replace.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className={`p-3 rounded-lg border transition-colors ${
                  isDragging 
                    ? 'bg-teal-50 text-[#008080] border-[#008080]' 
                    : 'bg-slate-50 text-slate-400 border-[#1A1A1A]/10 group-hover:text-[#008080] group-hover:bg-teal-50'
                }`}>
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

      {/* Action Button */}
      <button
        onClick={startAnalysis}
        disabled={isExtractionPending}
        className="w-full mt-2 group py-3 px-6 rounded-lg font-semibold bg-[#008080] hover:bg-[#006666] text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-85 disabled:cursor-not-allowed"
      >
        {isExtractionPending ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>{isExtracting ? 'Extracting text from file...' : 'Comparing documents...'}</span>
          </>
        ) : (
          <>
            <span>Analyze &amp; Match</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </div>
  );
}
