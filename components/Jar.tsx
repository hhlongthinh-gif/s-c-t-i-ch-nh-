
import React from 'react';

interface JarProps {
  label: string;
  amount: number;
  color: string;
  maxAmount: number;
}

const Jar: React.FC<JarProps> = ({ label, amount, color, maxAmount }) => {
  const percentage = Math.min(100, (amount / Math.max(1, maxAmount)) * 100);
  
  return (
    <div className="flex flex-col items-center space-y-2 flex-1">
      <div className="relative w-full h-40 bg-gray-200 rounded-t-3xl rounded-b-xl border-4 border-gray-300 overflow-hidden shadow-inner">
        <div 
          className={`absolute bottom-0 w-full jar-animate ${color}`}
          style={{ height: `${percentage}%` }}
        >
          <div className="absolute top-0 w-full h-2 bg-white/20"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] md:text-xs font-bold bg-white/90 px-1 py-0.5 rounded shadow-sm text-slate-800">
            {amount}k
          </span>
        </div>
      </div>
      <span className="font-bold text-slate-600 text-[10px] md:text-xs uppercase tracking-tighter text-center h-8 flex items-center">{label}</span>
    </div>
  );
};

export default Jar;
