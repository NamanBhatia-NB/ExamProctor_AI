"use client";
import { AlertTriangle } from 'lucide-react';

interface SuspicionIndicatorProps {
  score: number;
  warningCount: number;
}

export default function SuspicionIndicator({ score, warningCount }: SuspicionIndicatorProps) {
  // console.log(score);

  const getColor = () => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 50) return 'bg-orange-500';
    if (score >= 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getTextColor = () => {
    if (score >= 80) return 'text-red-600';
    if (score >= 50) return 'text-orange-600';
    if (score >= 30) return 'text-yellow-600';
    // console.log(score*100);
    return 'text-green-600';
  };
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-800 mb-4 border-b pb-2">Monitoring Status</h3>
      
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-slate-600">Suspicion Level</span>
          <span className={`text-sm font-bold ${getTextColor()}`}>{Math.round(score)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full ${getColor()} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
        <span className="text-sm text-slate-600">Warnings</span>
        <span className={`font-bold ${warningCount >= 15 ? 'text-red-600' : 'text-slate-800'}`}>
          {warningCount} / 20
        </span>
      </div>
      
      {score >= 80 && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2 text-sm">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <p>High suspicion detected! Warning issued.</p>
        </div>
      )}
      
      {warningCount >= 15 && (
        <div className="mt-2 p-3 bg-orange-50 text-orange-700 rounded-lg text-sm">
          <p className="font-semibold">⚠️ {20 - warningCount} warnings remaining</p>
          <p className="text-xs mt-1">Exam will auto-submit at 20 warnings</p>
        </div>
      )}
    </div>
  );
}
