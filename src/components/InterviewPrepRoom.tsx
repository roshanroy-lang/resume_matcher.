import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  AlertCircle,
  Play,
  CheckCircle2,
  Lock,
  Compass,
  CornerDownRight,
  TrendingUp
} from 'lucide-react';
import ScoreRing from './ScoreRing';

interface Question {
  id: number;
  question: string;
  type: 'technical' | 'behavioral' | 'situational';
  idealGuidelines: string;
}

interface EvaluationResult {
  score: number;
  feedback: string;
  modelAnswer: string;
}

interface InterviewPrepRoomProps {
  jobDescription: string;
  resumeContent: string;
}

export default function InterviewPrepRoom({ jobDescription, resumeContent }: InterviewPrepRoomProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Navigation states
  const [activeIdx, setActiveIdx] = useState(0);

  // User input answers
  const [answers, setAnswers] = useState<{ [id: number]: string }>({});
  
  // Grading evaluation states
  const [evaluatingIds, setEvaluatingIds] = useState<{ [id: number]: boolean }>({});
  const [feedbacks, setFeedbacks] = useState<{ [id: number]: EvaluationResult }>({});

  const handleGenerateQuestions = async () => {
    if (!jobDescription.trim() || !resumeContent.trim()) {
      alert('Please make sure you have filled in both the Job Description and your Resume in the Inputs section first.');
      return;
    }

    setIsGenerating(true);
    setQuestions([]);
    setActiveIdx(0);
    setAnswers({});
    setFeedbacks({});
    setEvaluatingIds({});

    try {
      const response = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription, resumeContent }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.questions && Array.isArray(data.questions)) {
          setQuestions(data.questions);
        } else {
          throw new Error('Invalid interview questions format');
        }
      } else {
        throw new Error('Server returned an error');
      }
    } catch (error) {
      console.error('Failed to generate interview questions:', error);
      alert('Failed to connect to the generator. Please verify your GEMINI_API_KEY is configured in your environment.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEvaluateAnswer = async (questionId: number) => {
    const userAnswer = answers[questionId] || '';
    if (!userAnswer.trim()) {
      alert('Please type in your answer before submitting it for evaluation.');
      return;
    }

    const currentQuestion = questions.find(q => q.id === questionId);
    if (!currentQuestion) return;

    setEvaluatingIds(prev => ({ ...prev, [questionId]: true }));

    try {
      const response = await fetch('/api/interview-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          userAnswer,
          jobDescription
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.score !== undefined) {
          setFeedbacks(prev => ({
            ...prev,
            [questionId]: {
              score: data.score,
              feedback: data.feedback,
              modelAnswer: data.modelAnswer
            }
          }));
        } else {
          throw new Error('Evaluation parsing error');
        }
      } else {
        throw new Error('Server returned an error');
      }
    } catch (error) {
      console.error('Failed to evaluate answer:', error);
      alert('Failed to score answer. Please verify your internet connection or API settings.');
    } finally {
      setEvaluatingIds(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const hasInputs = jobDescription.trim().length > 0 && resumeContent.trim().length > 0;
  const currentQuestion = questions[activeIdx];
  
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      
      {questions.length === 0 ? (
        // Empty State: Launch interview simulator
        <div className="glass-panel rounded-xl p-12 bg-card-bg border border-[#1A1A1A]/10 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 bg-teal-50 rounded-2xl border border-teal-100 flex items-center justify-center text-[#008080] mb-6">
            <Compass className="h-8 w-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">AI Interview Simulator</h2>
          <p className="text-sm text-slate-500 max-w-lg mt-3 leading-relaxed font-normal">
            Generate 5 mock interview questions customized specifically for your resume and the target job description. Rehearse your answers, get scored, and study optimized, structured responses.
          </p>

          {!hasInputs && (
            <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-3.5 max-w-md mt-6 text-left">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
              <span>Make sure to add your target Job Description and Resume details in the main <strong>Inputs</strong> dashboard to enable simulator.</span>
            </div>
          )}

          <button
            onClick={handleGenerateQuestions}
            disabled={isGenerating || !hasInputs}
            className="mt-6 group py-3 px-8 rounded-lg font-semibold bg-[#008080] hover:bg-[#006666] text-white shadow-sm flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Generating interview questions...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Start Mock Session</span>
              </>
            )}
          </button>
        </div>
      ) : (
        // Active Interview Prep view
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: questions step list */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="glass-panel rounded-xl p-5 bg-card-bg border border-[#1A1A1A]/10 flex flex-col gap-4">
              <div className="pb-3 border-b border-[#1A1A1A]/10 flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Prep Questions</h3>
                <button 
                  onClick={handleGenerateQuestions}
                  className="text-[10px] text-[#008080] hover:text-[#006666] font-bold flex items-center gap-1 cursor-pointer"
                  title="Generate new questions"
                >
                  <RefreshCw className="h-3 w-3" /> Reset
                </button>
              </div>

              {/* Steps navigation */}
              <div className="flex flex-col gap-2.5">
                {questions.map((q, idx) => {
                  const hasAnswer = (answers[q.id] || '').trim().length > 0;
                  const isEvaluated = feedbacks[q.id] !== undefined;
                  const scoreVal = feedbacks[q.id]?.score;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setActiveIdx(idx)}
                      className={`w-full text-left p-3.5 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${
                        activeIdx === idx 
                          ? 'border-[#008080] bg-teal-50/20 text-[#008080] font-bold' 
                          : 'border-[#1A1A1A]/10 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
                          activeIdx === idx 
                            ? 'bg-[#008080] text-white font-black' 
                            : 'bg-slate-100 text-slate-500 font-bold'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="truncate">{q.question}</span>
                      </div>
                      
                      {/* State tag icons */}
                      <div className="shrink-0 pl-2">
                        {isEvaluated ? (
                          <span className="rounded bg-teal-100 text-[#008080] px-1.5 py-0.5 text-[9px] font-black">
                            {scoreVal}%
                          </span>
                        ) : hasAnswer ? (
                          <span className="rounded bg-amber-50 border border-amber-100 text-amber-700 px-1 py-0.5 text-[8px] font-black uppercase tracking-wider">
                            Ready
                          </span>
                        ) : (
                          <Lock className="h-3 w-3 text-slate-300" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right panel: Active question screen */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="glass-panel rounded-xl p-6 bg-card-bg border border-[#1A1A1A]/10 flex flex-col gap-5 min-h-[480px]">
              
              {/* Question Headline header */}
              <div className="pb-4 border-b border-[#1A1A1A]/10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] rounded-full border border-teal-200 bg-teal-50 text-[#008080] px-3 py-1 font-bold uppercase tracking-wider">
                    {currentQuestion.type} Question
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Question {activeIdx + 1} of 5
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#1A1A1A] mt-2 leading-snug">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Guidelines tips */}
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
                <HelpCircle className="h-4 w-4 text-[#008080] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block mb-0.5">Answer Strategy tips:</strong>
                  {currentQuestion.idealGuidelines}
                </div>
              </div>

              {/* Answer writing area */}
              <div className="flex flex-col gap-2 mt-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Type your mock answer:
                </label>
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                  placeholder="In my previous role at... (Try to detail actions, metrics, and technologies)"
                  className="w-full h-36 rounded-lg border border-[#1A1A1A]/10 bg-white p-4 text-xs text-[#1A1A1A] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#008080] focus:border-[#008080] transition-all resize-none"
                  disabled={evaluatingIds[currentQuestion.id]}
                />
              </div>

              {/* Evaluate grade submission */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveIdx(prev => Math.max(0, prev - 1))}
                    disabled={activeIdx === 0}
                    className="flex items-center gap-1 border border-[#1A1A1A]/10 bg-white rounded px-3 py-2 text-xs text-[#1A1A1A] font-bold hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    onClick={() => setActiveIdx(prev => Math.min(questions.length - 1, prev + 1))}
                    disabled={activeIdx === questions.length - 1}
                    className="flex items-center gap-1 border border-[#1A1A1A]/10 bg-white rounded px-3 py-2 text-xs text-[#1A1A1A] font-bold hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleEvaluateAnswer(currentQuestion.id)}
                  disabled={evaluatingIds[currentQuestion.id] || !(answers[currentQuestion.id] || '').trim()}
                  className="group py-2 px-5 rounded font-semibold bg-[#008080] hover:bg-[#006666] text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  {evaluatingIds[currentQuestion.id] ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Grading response...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Submit for Evaluation</span>
                    </>
                  )}
                </button>
              </div>

              {/* Evaluation score result display (shown if graded) */}
              {feedbacks[currentQuestion.id] && (
                <div className="mt-5 pt-5 border-t border-dashed border-[#1A1A1A]/10 flex flex-col gap-4 animate-fadeIn">
                  
                  {/* Evaluation title */}
                  <div className="flex items-center gap-4 bg-teal-50/30 rounded-xl p-4 border border-teal-100/60">
                    <ScoreRing 
                      score={feedbacks[currentQuestion.id].score} 
                      label="Grade" 
                      strokeColorClass="stroke-[#008080]" 
                      subLabel=""
                    />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-[#008080] uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4" /> Score assessment
                      </span>
                      <p className="text-[11px] text-slate-500 leading-normal font-normal">
                        {feedbacks[currentQuestion.id].score >= 80 
                          ? "Outstanding answer! Your structural pacing matches industry expectations." 
                          : "Constructive feedback provided below to help improve score."}
                      </p>
                    </div>
                  </div>

                  {/* Feedback points */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Constructive AI Mentorship:
                    </span>
                    <div className="text-xs text-slate-700 bg-slate-50 rounded-lg p-4 border border-slate-200 leading-relaxed whitespace-pre-line font-normal">
                      {feedbacks[currentQuestion.id].feedback}
                    </div>
                  </div>

                  {/* Model Answer */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-[#008080] uppercase tracking-wider flex items-center gap-1">
                      <CornerDownRight className="h-3.5 w-3.5 text-[#008080]" /> Sample Model Answer:
                    </span>
                    <div className="text-xs text-slate-800 bg-white rounded-lg p-4 border border-[#008080]/20 leading-relaxed whitespace-pre-line font-mono font-medium shadow-sm">
                      {feedbacks[currentQuestion.id].modelAnswer}
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
