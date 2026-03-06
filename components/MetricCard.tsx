
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number;
  suffix?: string;
  prefix?: string;
  description?: string;
  delay?: number;
  showGST?: boolean;
  gstAmount?: string | number;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, suffix, prefix, description, delay = 0, showGST, gstAmount }) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div
      className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(59,130,246,0.12)] hover:-translate-y-1 transition-all duration-500 group animate-reveal opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors">
          {label}
        </p>
        {trend !== undefined && (
          <div className="flex flex-col items-end gap-1.5">
            <div className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full ${isPositive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
              isNegative ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
              {isPositive ? <TrendingUp className="h-3 w-3 stroke-[3px]" /> :
                isNegative ? <TrendingDown className="h-3 w-3 stroke-[3px]" /> : <Minus className="h-3 w-3 stroke-[3px]" />}
              {Math.abs(trend)}%
            </div>
            {showGST && (
              <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md tracking-tighter">
                GST COMPLIANT
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        {prefix && <span className="text-xl font-bold text-slate-400 dark:text-slate-500">{prefix}</span>}
        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight group-hover:scale-[1.02] origin-left transition-transform duration-500">{value}</h3>
        {suffix && <span className="text-slate-400 dark:text-slate-500 font-bold text-sm ml-1">{suffix}</span>}
      </div>

      {showGST && (
        <div className="mb-4 flex items-center gap-2 group/gst">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[6px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">G</div>
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[6px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">S</div>
            <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-[6px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">T</div>
          </div>
          <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
            {gstAmount ? `Incl. ₹${gstAmount} Tax` : 'Verified GST Data'}
          </span>
          <div className="h-[2px] flex-grow bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-0 group-hover/gst:w-full transition-all duration-1000"></div>
          </div>
        </div>
      )}
      {description && (
        <div className="flex items-center gap-2 pt-3 border-t border-slate-50 dark:border-slate-800 transition-colors">
          <div className={`w-1 h-1 rounded-full ${isPositive ? 'bg-emerald-500' : isNegative ? 'bg-rose-500' : 'bg-slate-300'}`}></div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">{description}</p>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
