import React from 'react';

interface ScoreRingProps {
  score: number;
  label: string;
  strokeColorClass: string;
  subLabel: string;
}

export default function ScoreRing({ score, label, strokeColorClass, subLabel }: ScoreRingProps) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative flex items-center justify-center">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle cx="40" cy="40" r={radius} className="stroke-slate-200" strokeWidth="5" fill="transparent" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={`${strokeColorClass} transition-all duration-500 ease-out`}
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-sm font-black text-slate-900">{score}%</span>
          <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">{label}</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">{subLabel}</span>
    </div>
  );
}
