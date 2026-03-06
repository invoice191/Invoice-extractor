
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Clock, 
  Filter as FilterIcon, 
  ChevronDown, 
  X,
  RotateCcw
} from 'lucide-react';

interface DateRangePickerProps {
  onApply: (start: Date, end: Date, compare: boolean) => void;
  initialStart?: Date;
  initialEnd?: Date;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onApply, initialStart, initialEnd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(initialStart || new Date(2025, 4, 1, 0, 0));
  const [endDate, setEndDate] = useState(initialEnd || new Date(2025, 4, 31, 23, 59));
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [compare, setCompare] = useState(false);
  const [activePreset, setActivePreset] = useState('This Month');
  const [currentViewMonth, setCurrentViewMonth] = useState(new Date(2025, 4, 1)); // May 2025
  const containerRef = useRef<HTMLDivElement>(null);

  const presets = [
    'Today', 'Yesterday', 'This Week', 'Last 30 Days', 'This Month', 'Last Month', 'This Year'
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toTimeString().slice(0, 5);
  };

  const handlePresetClick = (preset: string) => {
    setActivePreset(preset);
    const today = new Date();
    let start = new Date();
    let end = new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    switch (preset) {
      case 'Today': break;
      case 'Yesterday':
        start.setDate(today.getDate() - 1);
        end.setDate(today.getDate() - 1);
        break;
      case 'This Week':
        const day = today.getDay();
        start.setDate(today.getDate() - day + (day === 0 ? -6 : 1));
        break;
      case 'Last 30 Days':
        start.setDate(today.getDate() - 30);
        break;
      case 'This Month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'Last Month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'This Year':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        end.setHours(23, 59, 59, 999);
        break;
    }
    setStartDate(start);
    setEndDate(end);
    setCurrentViewMonth(new Date(start.getFullYear(), start.getMonth(), 1));
  };

  const handleDateClick = (date: Date) => {
    setActivePreset('Custom');
    // If we have a range or haven't started one, start fresh
    if (startDate && endDate && (startDate.getTime() !== endDate.getTime())) {
      setStartDate(date);
      setEndDate(date);
    } else if (date < startDate) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const handleTimeChange = (type: 'start' | 'end', timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (type === 'start') {
      const newDate = new Date(startDate);
      newDate.setHours(hours, minutes);
      setStartDate(newDate);
    } else {
      const newDate = new Date(endDate);
      newDate.setHours(hours, minutes);
      setEndDate(newDate);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    return { firstDay: (firstDay === 0 ? 6 : firstDay - 1), days }; // Adjusted for Monday start
  };

  const CalendarGrid = ({ monthDate }: { monthDate: Date }) => {
    const { firstDay, days } = getDaysInMonth(monthDate);
    const dayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6 px-1">
          <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">
            {monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {dayLabels.map(d => (
            <span key={d} className="text-[10px] font-black text-slate-400 text-center py-2 uppercase tracking-tighter">{d}</span>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: days }).map((_, i) => {
            const dayNum = i + 1;
            const current = new Date(monthDate.getFullYear(), monthDate.getMonth(), dayNum);
            const isStart = startDate && current.toDateString() === startDate.toDateString();
            const isEnd = endDate && current.toDateString() === endDate.toDateString();
            const isInRange = startDate && endDate && current > startDate && current < endDate;
            const isHovering = hoverDate && startDate && current > startDate && current <= hoverDate && (startDate.getTime() === endDate.getTime());

            return (
              <button
                key={dayNum}
                onMouseEnter={() => setHoverDate(current)}
                onMouseLeave={() => setHoverDate(null)}
                onClick={() => handleDateClick(current)}
                className={`relative h-10 w-full flex items-center justify-center text-[11px] font-bold transition-all rounded-lg
                  ${isStart || isEnd ? 'bg-blue-600 text-white z-10 shadow-lg scale-110' : ''}
                  ${isInRange || isHovering ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}
                  ${isStart ? 'rounded-r-none' : ''}
                  ${isEnd ? 'rounded-l-none' : ''}
                  ${isInRange ? 'rounded-none' : ''}
                `}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const nextMonth = new Date(currentViewMonth.getFullYear(), currentViewMonth.getMonth() + 1, 1);

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* User Friendly Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-4 bg-white dark:bg-slate-900 border px-5 py-3.5 rounded-2xl text-sm font-bold shadow-sm transition-all group ${
          isOpen ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200 dark:border-slate-800 hover:shadow-lg'
        }`}
      >
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <FilterIcon className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col items-start leading-none pr-8">
          <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-black mb-1">Active Range</span>
          <span className="text-slate-800 dark:text-slate-100 tracking-tight font-black text-sm">
             {formatDate(startDate)} <span className="text-slate-300 dark:text-slate-600 mx-1">→</span> {formatDate(endDate)}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Modern Popover */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-4 w-[850px] bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 z-[100] flex flex-col overflow-hidden animate-slide-up">
          <div className="flex">
            {/* Presets Sidebar */}
            <div className="w-[200px] bg-slate-50/50 dark:bg-slate-800/20 border-r border-slate-100 dark:border-slate-800 p-8 flex flex-col gap-1.5">
              <h5 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4">Quick Select</h5>
              {presets.map(p => (
                <button
                  key={p}
                  onClick={() => handlePresetClick(p)}
                  className={`text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activePreset === p 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600'
                  }`}
                >
                  {p}
                </button>
              ))}
              
              <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
                 <button 
                  onClick={() => {
                    handlePresetClick('This Month');
                    setCompare(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" /> Reset Filter
                </button>
              </div>
            </div>

            {/* Calendar Main View */}
            <div className="flex-1 p-10">
              <div className="flex justify-between items-center mb-10">
                <button 
                  onClick={() => setCurrentViewMonth(new Date(currentViewMonth.getFullYear(), currentViewMonth.getMonth() - 1, 1))}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 transition-all border border-slate-100 dark:border-slate-700"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-400" />
                </button>
                <div className="flex items-center gap-2">
                   <CalendarIcon className="h-5 w-5 text-blue-600" />
                   <span className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Select Date Range</span>
                </div>
                <button 
                  onClick={() => setCurrentViewMonth(new Date(currentViewMonth.getFullYear(), currentViewMonth.getMonth() + 1, 1))}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 transition-all border border-slate-100 dark:border-slate-700"
                >
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-16">
                <CalendarGrid monthDate={currentViewMonth} />
                <CalendarGrid monthDate={nextMonth} />
              </div>
            </div>
          </div>

          {/* Precision Footer */}
          <div className="bg-slate-50/80 dark:bg-slate-800/50 p-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex gap-8">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Start Time</p>
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 shadow-sm">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <input 
                    type="time" 
                    value={formatTime(startDate)} 
                    onChange={(e) => handleTimeChange('start', e.target.value)}
                    className="bg-transparent border-none text-xs font-black text-slate-700 dark:text-slate-200 focus:ring-0 outline-none cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">End Time</p>
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 shadow-sm">
                  <Clock className="h-4 w-4 text-rose-500" />
                  <input 
                    type="time" 
                    value={formatTime(endDate)} 
                    onChange={(e) => handleTimeChange('end', e.target.value)}
                    className="bg-transparent border-none text-xs font-black text-slate-700 dark:text-slate-200 focus:ring-0 outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer group bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-all">
                <div 
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${compare ? 'bg-blue-600 border-blue-600 shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`} 
                  onClick={(e) => { e.preventDefault(); setCompare(!compare); }}
                >
                  {compare && <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />}
                </div>
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Compare to previous</span>
              </label>

              <button 
                onClick={() => {
                  onApply(startDate, endDate, compare);
                  setIsOpen(false);
                }}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 shadow-2xl transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
