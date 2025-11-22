import React, { useMemo, useState } from 'react';
import { format, eachDayOfInterval, subWeeks, addDays, getDay, isSameMonth } from 'date-fns';

interface ActivityMapProps {
  data: Record<string, number>;
  username?: string;
}

export const ActivityMap: React.FC<ActivityMapProps> = ({ data, username }) => {
  const [hoveredDate, setHoveredDate] = useState<{date: string, count: number} | null>(null);
  
  // Configuration
  const weeksToShow = 20;
  
  // Calculate today (start of day) without using date-fns startOfDay to avoid import errors
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Calculate start date: Go back X weeks, then find the Monday of that week
  // GitHub starts weeks on Sunday usually, but Monday is fine for ISO. Let's stick to Sunday start to match calendar rows.
  const startDate = useMemo(() => {
    const d = subWeeks(today, weeksToShow);
    return addDays(d, -getDay(d)); // Go back to Sunday
  }, [today]);

  // Generate all days
  const days = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: today });
  }, [startDate, today]);

  // Group into weeks for Column-based rendering
  const weeks = useMemo(() => {
    const result: Date[][] = [];
    let currentWeek: Date[] = [];
    
    days.forEach(day => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });
    // Push last partial week if exists
    if (currentWeek.length > 0) result.push(currentWeek);
    return result;
  }, [days]);

  // Generate Month Labels
  const monthLabels = useMemo(() => {
    const labels: { text: string, index: number }[] = [];
    weeks.forEach((week, i) => {
      const firstDay = week[0];
      // Logic: Show month label if it's the first week of the month, or if it's the very first column
      if (i === 0 || !isSameMonth(week[0], weeks[i-1][0])) {
         labels.push({ text: format(firstDay, 'MMM'), index: i });
      }
    });
    return labels;
  }, [weeks]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-800/40'; 
    if (count === 1) return 'bg-green-900/80 ring-1 ring-inset ring-green-900';
    if (count <= 3) return 'bg-green-700 ring-1 ring-inset ring-green-700';
    if (count <= 5) return 'bg-green-500 ring-1 ring-inset ring-green-500';
    return 'bg-green-400 ring-1 ring-inset ring-green-400';
  };

  const handleDayClick = (dateStr: string) => {
    if (!username) return;
    // Opens the specific day on GitHub profile. 
    // Note: GitHub uses the 'to' and 'from' parameters to filter the contribution activity stream.
    // This will show the contributions for that specific day.
    window.open(`https://github.com/${username}?tab=overview&from=${dateStr}&to=${dateStr}`, '_blank');
  };

  return (
    <div className="p-5 bg-gray-900 rounded-2xl border border-gray-800 shadow-xl select-none flex flex-col items-center">
      <div className="flex items-center justify-between mb-6 w-full">
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-300">Contribution Activity</span>
        </div>
        {hoveredDate ? (
            <span className="text-xs text-indigo-300 animate-in fade-in">
                {hoveredDate.count} contributions on {format(new Date(hoveredDate.date), 'MMM d, yyyy')}
            </span>
        ) : (
            <span className="text-xs text-gray-600">
                {username ? 'Click squares for details' : 'Connect GitHub in settings'}
            </span>
        )}
      </div>
      
      <div className="flex flex-col w-full items-center">
        {/* Month Labels - adjusted positioning to be relative to the grid container */}
        <div className="flex mb-2 pl-8 relative h-4 w-max">
           {monthLabels.map((label, idx) => (
               <span 
                 key={idx} 
                 className="absolute text-[10px] font-medium text-gray-500 uppercase"
                 style={{ left: `${label.index * 14}px` }} // 14px = 10px width + 4px gap roughly
               >
                 {label.text}
               </span>
           ))}
        </div>

        <div className="flex justify-center">
            {/* Day Labels */}
            <div className="flex flex-col gap-1 mr-2 pt-[2px]">
                <span className="text-[9px] text-gray-600 h-[10px] leading-[10px] opacity-0">Sun</span>
                <span className="text-[9px] text-gray-600 h-[10px] leading-[10px]">Mon</span>
                <span className="text-[9px] text-gray-600 h-[10px] leading-[10px] opacity-0">Tue</span>
                <span className="text-[9px] text-gray-600 h-[10px] leading-[10px]">Wed</span>
                <span className="text-[9px] text-gray-600 h-[10px] leading-[10px] opacity-0">Thu</span>
                <span className="text-[9px] text-gray-600 h-[10px] leading-[10px]">Fri</span>
                <span className="text-[9px] text-gray-600 h-[10px] leading-[10px] opacity-0">Sat</span>
            </div>

            {/* Grid */}
            <div className="flex gap-1">
                {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1">
                        {week.map((day) => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const count = data[dateStr] || 0;
                            // If day is in future (can happen with week completion), don't render or render invisible
                            if (day > today) return <div key={dateStr} className="w-2.5 h-2.5" />;

                            return (
                                <div
                                    key={dateStr}
                                    onMouseEnter={() => setHoveredDate({date: dateStr, count})}
                                    onMouseLeave={() => setHoveredDate(null)}
                                    onClick={() => handleDayClick(dateStr)}
                                    title={`${count} contributions on ${dateStr}`}
                                    className={`w-2.5 h-2.5 rounded-[2px] ${getColor(count)} cursor-pointer transition-all duration-150 hover:scale-125 hover:z-10 hover:ring-2 hover:ring-white/50`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-2 mt-4 text-[9px] text-gray-600 uppercase font-bold tracking-wider w-full">
        <span>Less</span>
        <div className="flex gap-0.5">
            <div className="w-2.5 h-2.5 bg-gray-800/40 rounded-[1px]"></div>
            <div className="w-2.5 h-2.5 bg-green-900 rounded-[1px]"></div>
            <div className="w-2.5 h-2.5 bg-green-700 rounded-[1px]"></div>
            <div className="w-2.5 h-2.5 bg-green-500 rounded-[1px]"></div>
            <div className="w-2.5 h-2.5 bg-green-400 rounded-[1px]"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};