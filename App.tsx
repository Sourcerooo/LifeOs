
import React, { useState, useEffect } from 'react';
import { Icons } from './components/Icons';
import { Task, UserStats, QuickLink, WeeklySchedule, ScheduleBlock, Course, ResourceCategory } from './types';
import { format } from 'date-fns';
import { generateSubtasks } from './services/geminiService';

// --- Initial Data ---

const DEFAULT_LINKS: QuickLink[] = [
  { id: '1', label: 'Google', message: 'Search', url: 'https://www.google.de', hexColor: '4285F4', logo: 'google' },
  { id: '2', label: 'Gemini', message: 'AI Studio', url: 'https://aistudio.google.com/', hexColor: '00A67E', logo: 'googlegemini' },
  { id: '3', label: 'Gmail', message: 'Inbox', url: 'https://mail.google.com', hexColor: 'D14836', logo: 'gmail' },
  { id: '4', label: 'Google Drive', message: 'Files', url: 'https://drive.google.com', hexColor: '34A853', logo: 'googledrive' },
  { id: '5', label: 'Calendar', message: 'Plan', url: 'https://calendar.google.com', hexColor: '4285F4', logo: 'googlecalendar' },
  { id: '6', label: 'Singularity', message: 'News', url: 'https://www.reddit.com/r/singularity/', hexColor: 'FF4500', logo: 'reddit' },
  { id: '7', label: 'Udemy', message: 'Learning', url: 'https://www.udemy.com/home/my-courses/learning/', hexColor: 'A435F0', logo: 'udemy' },
  { id: '8', label: 'LinkedIn', message: 'Network', url: 'https://www.linkedin.com', hexColor: '0077B5', logo: 'linkedin' },
  { id: '9', label: 'YouTube', message: 'Watch', url: 'https://www.youtube.com', hexColor: 'FF0000', logo: 'youtube' },
  { id: '10', label: 'Pokerstrategy', message: 'Forum', url: 'https://www.pokerstrategy.com/de/forum/', hexColor: 'D73430', logo: 'formspree' },
];

const DEFAULT_COURSES: Course[] = [
  { id: '1', title: 'Classes, Interfaces & OOP', category: '.NET', url: 'https://udemy.com', color: 'bg-indigo-600' },
  { id: '2', title: 'Docker & Kubernetes Guide', category: 'Docker', url: 'https://udemy.com', color: 'bg-blue-500' },
  { id: '3', title: 'Git & GitHub Guide', category: 'Git', url: 'https://udemy.com', color: 'bg-orange-600' },
  { id: '4', title: 'Microservices Architecture', category: 'Arch', url: 'https://udemy.com', color: 'bg-gray-600' },
];

const DEFAULT_RESOURCES: ResourceCategory[] = [
  {
      id: '1',
      title: 'Recommended Books',
      items: [
          { id: '101', title: 'Designing Data-Intensive Applications', description: 'Martin Kleppmann - Distributed Systems Architecture', url: 'https://amazon.com' },
          { id: '102', title: 'System Design Interview', description: 'Alex Xu - Visual explanation of complex systems', url: 'https://amazon.com' },
          { id: '103', title: 'Effective Java', description: 'Joshua Bloch - Best Practices', url: 'https://amazon.com' }
      ]
  },
  {
      id: '2',
      title: 'Online Courses & Tutorials',
      items: [
          { id: '201', title: 'Automate the Boring Stuff with Python', description: 'Al Sweigart - Practical Automation', url: 'https://udemy.com' },
          { id: '202', title: 'DeepLearning.AI: AI Agents', description: 'Short course on LangGraph', url: 'https://deeplearning.ai' }
      ]
  }
];

const DEFAULT_SCHEDULE: WeeklySchedule = {
  'Mon': [
      { id: '1', start: '09:00', end: '10:30', title: 'Theorie', description: 'Udemy Kurs', color: 'text-red-400', icon: 'MonitorPlay' },
      { id: '2', start: '10:30', end: '11:00', title: 'Pause / Lüften', description: '', color: 'text-purple-300', icon: 'Wind' },
      { id: '3', start: '11:00', end: '12:30', title: 'Praxis', description: 'Coden & Debuggen', color: 'text-green-400', icon: 'Code' },
      { id: '4', start: '12:30', end: '13:30', title: 'Mittagspause', description: '', color: 'text-orange-300', icon: 'Utensils' },
      { id: '5', start: '13:30', end: '15:30', title: 'System Design', description: 'Architektur / Lesen', color: 'text-blue-400', icon: 'Layers' },
      { id: '6', start: '15:30', end: '16:00', title: 'Prep for Gym', description: '', color: 'text-pink-400', icon: 'Dumbbell' },
      { id: '7', start: '16:00', end: '18:00', title: 'Fitness', description: '', color: 'text-yellow-400', icon: 'Dumbbell' },
      { id: '8', start: '18:00', end: '22:00', title: 'Relax / Gaming', description: '', color: 'text-indigo-300', icon: 'Gamepad2' },
  ],
  'Tue': [
      { id: '1', start: '09:00', end: '10:30', title: 'Theorie', description: 'Udemy Kurs', color: 'text-red-400', icon: 'MonitorPlay' },
      { id: '2', start: '10:30', end: '11:00', title: 'Pause / Lüften', description: '', color: 'text-purple-300', icon: 'Wind' },
      { id: '3', start: '11:00', end: '12:30', title: 'Praxis', description: 'Coden & Debuggen', color: 'text-green-400', icon: 'Code' },
      { id: '4', start: '12:30', end: '13:30', title: 'Mittagspause', description: '', color: 'text-orange-300', icon: 'Utensils' },
      { id: '5', start: '13:30', end: '15:30', title: 'Git Deep Dive', description: 'Konzepte & Workflow', color: 'text-pink-500', icon: 'Github' },
      { id: '6', start: '15:30', end: '16:00', title: 'Tagesabschluss', description: '', color: 'text-gray-400', icon: 'Flag' },
      { id: '7', start: '16:00', end: '18:00', title: 'Gaming / Frei', description: '', color: 'text-indigo-400', icon: 'Gamepad2' },
      { id: '8', start: '18:00', end: '22:00', title: 'Gaming / Frei', description: '', color: 'text-indigo-400', icon: 'Gamepad2' },
  ],
  'Wed': [
      { id: '1', start: '09:00', end: '10:30', title: 'Theorie', description: 'Udemy Kurs', color: 'text-red-400', icon: 'MonitorPlay' },
      { id: '2', start: '10:30', end: '11:00', title: 'Pause / Lüften', description: '', color: 'text-purple-300', icon: 'Wind' },
      { id: '3', start: '11:00', end: '12:30', title: 'Praxis', description: 'Coden & Debuggen', color: 'text-green-400', icon: 'Code' },
      { id: '4', start: '12:30', end: '13:30', title: 'Mittagspause', description: '', color: 'text-orange-300', icon: 'Utensils' },
      { id: '5', start: '13:30', end: '15:30', title: 'System Design', description: 'Architektur / Lesen', color: 'text-blue-400', icon: 'Layers' },
      { id: '6', start: '15:30', end: '16:00', title: 'Prep for Gym', description: '', color: 'text-pink-400', icon: 'Dumbbell' },
      { id: '7', start: '16:00', end: '18:00', title: 'Fitness', description: '', color: 'text-yellow-400', icon: 'Dumbbell' },
      { id: '8', start: '18:00', end: '22:00', title: 'Relax / Gaming', description: '', color: 'text-indigo-300', icon: 'Gamepad2' },
  ],
  'Thu': [
      { id: '1', start: '09:00', end: '10:30', title: 'Theorie', description: 'Udemy Kurs', color: 'text-red-400', icon: 'MonitorPlay' },
      { id: '2', start: '10:30', end: '11:00', title: 'Pause / Lüften', description: '', color: 'text-purple-300', icon: 'Wind' },
      { id: '3', start: '11:00', end: '12:30', title: 'Praxis', description: 'Coden & Debuggen', color: 'text-green-400', icon: 'Code' },
      { id: '4', start: '12:30', end: '13:30', title: 'Mittagspause', description: '', color: 'text-orange-300', icon: 'Utensils' },
      { id: '5', start: '13:30', end: '15:30', title: 'Git Deep Dive', description: 'Konzepte & Workflow', color: 'text-pink-500', icon: 'Github' },
      { id: '6', start: '15:30', end: '16:00', title: 'Tagesabschluss', description: '', color: 'text-gray-400', icon: 'Flag' },
      { id: '7', start: '16:00', end: '18:00', title: 'Gaming / Frei', description: '', color: 'text-indigo-400', icon: 'Gamepad2' },
      { id: '8', start: '18:00', end: '22:00', title: 'Gaming / Frei', description: '', color: 'text-indigo-400', icon: 'Gamepad2' },
  ],
  'Fri': [
      { id: '1', start: '09:00', end: '10:30', title: 'Theorie', description: 'Udemy Kurs', color: 'text-red-400', icon: 'MonitorPlay' },
      { id: '2', start: '10:30', end: '11:00', title: 'Pause / Lüften', description: '', color: 'text-purple-300', icon: 'Wind' },
      { id: '3', start: '11:00', end: '12:30', title: 'Praxis', description: 'Coden & Debuggen', color: 'text-green-400', icon: 'Code' },
      { id: '4', start: '12:30', end: '13:30', title: 'Mittagspause', description: '', color: 'text-orange-300', icon: 'Utensils' },
      { id: '5', start: '13:30', end: '15:30', title: 'Python Lab', description: 'Scripting & Testing', color: 'text-green-300', icon: 'Terminal' },
      { id: '6', start: '15:30', end: '16:00', title: 'Wochenreview', description: '', color: 'text-gray-400', icon: 'Flag' },
      { id: '7', start: '16:00', end: '18:00', title: 'Fitness', description: '', color: 'text-yellow-400', icon: 'Dumbbell' },
      { id: '8', start: '18:00', end: '23:00', title: 'Wochenende', description: 'Cheers', color: 'text-yellow-500', icon: 'Beer' },
  ],
  'Sat': [], 'Sun': []
};

const INITIAL_STATS: UserStats = {
  xp: 0, level: 1, streak: 1, lastLogin: format(new Date(), 'yyyy-MM-dd'),
  commits: {}, 
};

// --- Config ---

const SCHEDULE_ICONS = [
    'Activity', 'Code', 'Dumbbell', 'Gamepad2', 'Utensils', 'Beer', 'Wind', 
    'MonitorPlay', 'Terminal', 'Layers', 'Flag', 'Github', 'CoffeeIcon', 
    'BookOpen', 'Briefcase', 'Mail', 'MessageSquare', 'Globe', 'Music', 'Video'
];

const SCHEDULE_COLORS = [
    { label: 'Red', value: 'text-red-400' },
    { label: 'Orange', value: 'text-orange-300' },
    { label: 'Yellow', value: 'text-yellow-400' },
    { label: 'Green', value: 'text-green-400' },
    { label: 'Teal', value: 'text-teal-400' },
    { label: 'Blue', value: 'text-blue-400' },
    { label: 'Indigo', value: 'text-indigo-300' },
    { label: 'Purple', value: 'text-purple-300' },
    { label: 'Pink', value: 'text-pink-400' },
    { label: 'Gray', value: 'text-gray-400' },
    { label: 'White', value: 'text-gray-200' },
];

const BADGE_COLORS = [
    { label: 'Google Blue', value: '4285F4' },
    { label: 'Gemini Green', value: '00A67E' },
    { label: 'Gmail Red', value: 'D14836' },
    { label: 'Drive Green', value: '34A853' },
    { label: 'Reddit Orange', value: 'FF4500' },
    { label: 'Udemy Purple', value: 'A435F0' },
    { label: 'LinkedIn Blue', value: '0077B5' },
    { label: 'YouTube Red', value: 'FF0000' },
    { label: 'Poker Red', value: 'D73430' },
    { label: 'Dark Gray', value: '555555' },
    { label: 'Black', value: '000000' },
];

const COMMON_LOGOS = [
    'google', 'googlegemini', 'gmail', 'googledrive', 'googlecalendar', 
    'reddit', 'udemy', 'linkedin', 'youtube', 'formspree', 'github', 
    'twitter', 'facebook', 'instagram', 'twitch', 'discord', 'slack', 
    'spotify', 'steam', 'apple', 'android', 'microsoft', 'windows', 
    'linux', 'docker', 'kubernetes', 'react', 'typescript', 'javascript', 
    'node.js', 'python', 'java', 'csharp', 'go', 'rust', 'php'
];

export default function App() {
  // --- State ---
  const [view, setView] = useState<'dashboard' | 'resources'>('dashboard');

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('lifeos_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [schedule, setSchedule] = useState<WeeklySchedule>(() => {
    const saved = localStorage.getItem('lifeos_schedule_v2');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed['Mon'] && parsed['Mon'][0] && !parsed['Mon'][0].color) {
             return DEFAULT_SCHEDULE;
        }
        return parsed;
    }
    return DEFAULT_SCHEDULE;
  });

  const [links, setLinks] = useState<QuickLink[]>(() => {
    const saved = localStorage.getItem('lifeos_links');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Basic migration check: if missing hexColor, reset to default or migrate
            if (parsed.length > 0 && !parsed[0].hexColor) {
                return DEFAULT_LINKS;
            }
            return parsed;
        } catch(e) { return DEFAULT_LINKS; }
    }
    return DEFAULT_LINKS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
      const saved = localStorage.getItem('lifeos_courses');
      return saved ? JSON.parse(saved) : DEFAULT_COURSES;
  });

  const [resources, setResources] = useState<ResourceCategory[]>(() => {
      const saved = localStorage.getItem('lifeos_resources');
      return saved ? JSON.parse(saved) : DEFAULT_RESOURCES;
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('lifeos_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [scheduleDay, setScheduleDay] = useState(format(new Date(), 'EEE'));
  const [searchQuery, setSearchQuery] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [loadingAi, setLoadingAi] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());
  
  // Modals
  const [taskModal, setTaskModal] = useState<Task | null>(null);
  const [scheduleModal, setScheduleModal] = useState<ScheduleBlock | null>(null);
  const [linkModal, setLinkModal] = useState<QuickLink | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScheduleEditMode, setIsScheduleEditMode] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({'1': true, '2': true});

  // Form states
  const [editingCourse, setEditingCourse] = useState<Partial<Course>>({});
  const [newResourceItem, setNewResourceItem] = useState<{catId: string, title: string, url: string, desc: string} | null>(null);

  // --- Effects ---

  useEffect(() => localStorage.setItem('lifeos_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('lifeos_schedule_v2', JSON.stringify(schedule)), [schedule]);
  useEffect(() => localStorage.setItem('lifeos_links', JSON.stringify(links)), [links]);
  useEffect(() => localStorage.setItem('lifeos_courses', JSON.stringify(courses)), [courses]);
  useEffect(() => localStorage.setItem('lifeos_resources', JSON.stringify(resources)), [resources]);
  useEffect(() => localStorage.setItem('lifeos_stats', JSON.stringify(stats)), [stats]);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Handlers ---

  const addTask = (title: string, type: 'daily' | 'kanban' = 'daily', column: Task['column'] = 'todo') => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title, completed: false, column, type, createdAt: Date.now()
    };
    setTasks([...tasks, newTask]);
    setNewTodo('');
  };

  const toggleTaskComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const isNowComplete = !task.completed;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: isNowComplete, column: isNowComplete ? 'done' : 'todo' } : t));
    if (isNowComplete) { gainXp(10); recordActivity(); }
  };

  const moveTask = (taskId: string, direction: 'left' | 'right') => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      const cols = kanbanColumns.map(c => c.id);
      const idx = cols.indexOf(task.column);
      if (idx === -1) return;
      const newIdx = direction === 'left' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= cols.length) return;
      
      const newCol = cols[newIdx];
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, column: newCol as Task['column'] } : t));
      if (newCol === 'done' && task.column !== 'done') { gainXp(50); recordActivity(); }
  };

  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const handleAiBreakdown = async (task: Task) => {
    setLoadingAi(task.id);
    const subtasks = await generateSubtasks(task.title);
    if (subtasks.length > 0) {
        const newTasks: Task[] = subtasks.map((st, idx) => ({
            id: `${Date.now()}-${idx}`, title: st, description: `Subtask of: ${task.title}`,
            completed: false, column: task.column, type: task.type, createdAt: Date.now()
        }));
        setTasks(prev => [...prev, ...newTasks]);
    }
    setLoadingAi(null);
  };

  const gainXp = (amount: number) => {
    setStats(prev => {
      const newXp = prev.xp + amount;
      return { ...prev, xp: newXp, level: Math.floor(Math.sqrt(newXp / 100)) + 1 };
    });
  };

  const recordActivity = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setStats(prev => ({ ...prev, commits: { ...prev.commits, [today]: (prev.commits[today] || 0) + 1 } }));
  };

  const saveLink = () => {
      if (!linkModal || !linkModal.url || !linkModal.label) return;
      setLinks(prev => {
          if (prev.find(l => l.id === linkModal.id)) {
              return prev.map(l => l.id === linkModal.id ? linkModal : l);
          }
          return [...prev, linkModal];
      });
      setLinkModal(null);
  };

  const saveCourse = () => {
      if (!editingCourse.title || !editingCourse.category) return;
      const newCourse = { id: editingCourse.id || Date.now().toString(), title: editingCourse.title, category: editingCourse.category, url: editingCourse.url || '#', color: editingCourse.color || 'bg-indigo-600' } as Course;
      setCourses(prev => editingCourse.id ? prev.map(c => c.id === newCourse.id ? newCourse : c) : [...prev, newCourse]);
      setIsCourseModalOpen(false); setEditingCourse({});
  };
  
  const saveScheduleBlock = () => {
      if (!scheduleModal) return;
      setSchedule(prev => {
          const dayBlocks = prev[scheduleDay] || [];
          const existingIdx = dayBlocks.findIndex(b => b.id === scheduleModal.id);
          let newBlocks;
          if (existingIdx >= 0) {
              newBlocks = dayBlocks.map(b => b.id === scheduleModal.id ? scheduleModal : b);
          } else {
              newBlocks = [...dayBlocks, scheduleModal];
          }
          // Sort by start time
          newBlocks.sort((a,b) => a.start.localeCompare(b.start));
          return { ...prev, [scheduleDay]: newBlocks };
      });
      setScheduleModal(null);
  };

  const addResourceItem = () => {
      if (!newResourceItem) return;
      const { catId, title, url, desc } = newResourceItem;
      setResources(prev => prev.map(cat => {
          if (cat.id === catId) {
              return { ...cat, items: [...cat.items, { id: Date.now().toString(), title, url, description: desc }] };
          }
          return cat;
      }));
      setNewResourceItem(null);
  };
  
  // Helper component for badges to ensure consistent HTML structure
  const Badge = ({ link }: { link: QuickLink }) => (
      <div className="flex w-full h-8 shadow-sm hover:brightness-110 transition-all duration-200">
        {/* Left Side: Gray, Logo, Label - Wider (65%) */}
        <div className="w-[65%] bg-[#555] flex items-center justify-center gap-2 rounded-l-sm px-2 min-w-0">
            {link.logo && <img src={`https://cdn.simpleicons.org/${link.logo}/white`} alt="" className="w-3.5 h-3.5 shrink-0" />}
            <span className="text-[10px] font-bold text-white uppercase tracking-wider truncate">{link.label}</span>
        </div>
        {/* Right Side: Color, Message - Smaller (35%) */}
        <div 
            className="w-[35%] flex items-center justify-center rounded-r-sm px-2 min-w-0"
            style={{ backgroundColor: `#${link.hexColor}` }}
        >
            <span className="text-[10px] font-bold text-white uppercase tracking-wider truncate">{link.message}</span>
        </div>
      </div>
  );

  const kanbanColumns = [{id: 'backlog', label: 'Backlog'}, {id: 'todo', label: 'To Do'}, {id: 'in-progress', label: 'In Progress'}, {id: 'done', label: 'Done'}];

  // --- Render ---

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100 font-sans overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20 gap-8">
           
           {/* Left: Logo & Tabs */}
           <div className="flex items-center gap-6 shrink-0">
               <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                       <Icons.Activity className="text-white" size={18} />
                   </div>
                   <h1 className="text-lg font-bold text-white tracking-tight hidden md:block">LifeOS</h1>
               </div>

               <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg border border-gray-700/50">
                   <button 
                        onClick={() => setView('dashboard')}
                        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${view === 'dashboard' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        Dashboard
                   </button>
                   <button 
                        onClick={() => setView('resources')}
                        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${view === 'resources' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        Library
                   </button>
               </div>
           </div>

           {/* Middle: Search Bar - Centered vertically */}
           <div className="flex-1 max-w-xl flex items-center h-full">
               <form onSubmit={(e) => {e.preventDefault(); if(searchQuery.trim()) window.open(`https://google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank'); setSearchQuery('')}} className="relative w-full">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Google..."
                        className="w-full bg-gray-950 border border-gray-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all shadow-inner"
                    />
               </form>
           </div>

           {/* Right: Stats & Settings */}
           <div className="flex items-center gap-6 shrink-0">
               {/* Clock */}
               <div className="hidden lg:flex flex-col items-end mr-2">
                    <span className="text-lg font-mono font-bold text-white leading-none">{format(now, 'HH:mm')}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">{format(now, 'dd MMM yyyy')}</span>
               </div>

               {/* XP Bar */}
               <div className="hidden sm:flex flex-col w-24 gap-1">
                   <div className="flex justify-between text-[9px] text-gray-400 uppercase font-bold">
                       <span>Lvl {stats.level}</span>
                       <span>{Math.floor(Math.sqrt(stats.xp/100))} XP</span>
                   </div>
                   <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${((stats.xp % 100) / 100) * 100}%` }}></div>
                   </div>
               </div>

               <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white">
                   <Icons.Settings size={18} />
               </button>
           </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="max-w-[1600px] mx-auto h-full">
                
                {view === 'dashboard' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-20">
                        
                        {/* --- LEFT: Quick Access & Courses & Daily --- */}
                        <div className="lg:col-span-3 space-y-6 flex flex-col h-full overflow-hidden">
                            
                            {/* Quick Access */}
                            <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 shadow-lg">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quick Access</h2>
                                    <button onClick={() => { setLinkModal({id: Date.now().toString(), label: 'Google', message: 'Search', url: 'https://google.com', hexColor: '4285F4', logo: 'google'}); }} className="text-indigo-400 hover:text-indigo-300"><Icons.Plus size={14} /></button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {links.map(link => (
                                        <div key={link.id} className="relative group w-full">
                                             <a href={link.url} target="_blank" rel="noreferrer" className="block w-full">
                                                <Badge link={link} />
                                             </a>
                                             <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 bg-gray-900/90 rounded p-0.5 shadow-lg transition-opacity z-10">
                                                  <button onClick={(e) => {e.preventDefault(); setLinkModal(link)}} className="text-gray-400 hover:text-white p-0.5"><Icons.Edit2 size={10}/></button>
                                                  <button onClick={(e) => {e.preventDefault(); setLinks(l => l.filter(x => x.id !== link.id))}} className="text-red-400 hover:text-red-300 p-0.5"><Icons.X size={10}/></button>
                                             </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Current Courses - Compact Design */}
                            <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 shadow-lg">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <Icons.GraduationCap size={14} /> Current Courses
                                    </h2>
                                    <button onClick={() => { setEditingCourse({}); setIsCourseModalOpen(true); }} className="text-indigo-400 hover:text-indigo-300"><Icons.Plus size={14} /></button>
                                </div>
                                <div className="space-y-1 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                                    {courses.map(course => (
                                        <div key={course.id} className="group flex items-center gap-3 p-2 rounded hover:bg-gray-800/60 transition-colors">
                                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${course.color}`}></div>
                                            <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                                                <a href={course.url} target="_blank" rel="noreferrer" className="text-xs text-gray-300 truncate hover:text-white hover:underline" title={course.title}>
                                                    {course.title}
                                                </a>
                                                <span className="text-[9px] text-gray-500 uppercase shrink-0 tracking-wider">{course.category}</span>
                                            </div>
                                            <button onClick={() => setCourses(c => c.filter(x => x.id !== course.id))} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400"><Icons.Trash2 size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Todo List */}
                            <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 shadow-lg flex-1 flex flex-col overflow-hidden">
                                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Daily Focus</h2>
                                <div className="flex gap-2 mb-3">
                                    <input 
                                        value={newTodo} onChange={(e) => setNewTodo(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addTask(newTodo)}
                                        placeholder="Add task..." className="flex-1 bg-gray-950 border border-gray-800 rounded px-2 py-1.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                    />
                                    <button onClick={() => addTask(newTodo)} className="bg-indigo-600 text-white px-2 rounded"><Icons.Plus size={14} /></button>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                    {tasks.filter(t => t.type === 'daily').map(task => (
                                        <div key={task.id} className={`flex items-start gap-2 p-2 rounded border ${task.completed ? 'bg-gray-950/30 border-transparent opacity-50' : 'bg-gray-800/20 border-gray-800'} group`}>
                                            <button onClick={() => toggleTaskComplete(task.id)} className={`mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}>
                                                {task.completed && <Icons.Check size={10} className="text-white" />}
                                            </button>
                                            <div className="flex-1">
                                                <div className={`text-xs ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>{task.title}</div>
                                                {task.description && <div className="text-[10px] text-gray-500">{task.description}</div>}
                                            </div>
                                            <button onClick={() => handleAiBreakdown(task)} disabled={loadingAi === task.id} className="opacity-0 group-hover:opacity-100 text-purple-400"><Icons.Wand2 size={12} className={loadingAi === task.id ? 'animate-spin' : ''}/></button>
                                            <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-red-400"><Icons.Trash2 size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* --- MIDDLE: Schedule --- */}
                        <div className="lg:col-span-5 space-y-6 flex flex-col h-full">
                             
                             <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-lg flex-1 flex flex-col overflow-hidden">
                                 <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                                     <div className="flex gap-1">
                                        {Object.keys(schedule).map(day => (
                                            <button key={day} onClick={() => setScheduleDay(day)} className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${scheduleDay === day ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-800'}`}>{day}</button>
                                        ))}
                                     </div>
                                     <button onClick={() => setIsScheduleEditMode(!isScheduleEditMode)} className={`text-gray-500 hover:text-indigo-400 ${isScheduleEditMode ? 'text-indigo-400' : ''}`}><Icons.Edit2 size={14} /></button>
                                 </div>
                                 <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
                                     {isScheduleEditMode && <button onClick={() => {
                                         setScheduleModal({id: Date.now().toString(), start: '09:00', end: '10:00', title: 'New Block', description: '', color: 'text-gray-200', icon: 'Activity'});
                                     }} className="w-full py-2 border border-dashed border-gray-700 rounded text-gray-500 text-xs mb-2 hover:bg-gray-800/50 transition-colors">+ Add Block</button>}
                                     
                                     <div className="space-y-3 relative">
                                         {/* Vertical timeline line - simplified */}
                                         {(schedule[scheduleDay] || []).length === 0 && <div className="text-center text-gray-600 py-10 text-sm">Free Day</div>}
                                         {(schedule[scheduleDay] || []).map(block => {
                                             const IconComp = block.icon ? (Icons as any)[block.icon] || Icons.Activity : Icons.Activity;
                                             return (
                                                 <div key={block.id} className="flex gap-4 items-start group">
                                                     {/* Time Column */}
                                                     <div className="w-24 pt-3 text-right text-xs text-gray-500 font-mono">{block.start} - {block.end}</div>
                                                     
                                                     {/* Card */}
                                                     <div className="flex-1 bg-gray-800/30 border border-gray-700/50 rounded-xl p-3 flex items-center gap-4 hover:bg-gray-800/60 transition-all relative">
                                                         {isScheduleEditMode && (
                                                             <div className="absolute top-2 right-2 flex gap-2">
                                                                 <button onClick={() => setScheduleModal(block)} className="text-gray-500 hover:text-indigo-400 bg-gray-900/80 p-1.5 rounded"><Icons.Edit2 size={12} /></button>
                                                                 <button onClick={() => setSchedule(p => ({...p, [scheduleDay]: p[scheduleDay].filter(b => b.id !== block.id)}))} className="text-gray-500 hover:text-red-400 bg-gray-900/80 p-1.5 rounded"><Icons.Trash2 size={12} /></button>
                                                             </div>
                                                         )}
                                                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gray-800/80 shadow-inner shrink-0 ${block.color || 'text-gray-400'}`}>
                                                             <IconComp size={20} />
                                                         </div>
                                                         <div className="flex-1">
                                                             <div className={`text-sm font-bold ${block.color ? block.color.replace('text-', 'text-') : 'text-gray-200'}`}>{block.title}</div>
                                                             {block.description && <div className="text-xs text-gray-500 italic">{block.description}</div>}
                                                         </div>
                                                     </div>
                                                 </div>
                                             );
                                         })}
                                     </div>
                                 </div>
                             </div>

                        </div>

                        {/* --- RIGHT: Kanban --- */}
                        <div className="lg:col-span-4 h-full flex flex-col">
                            <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 shadow-lg flex-1 flex flex-col overflow-hidden">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mission Board</h2>
                                    <button onClick={() => addTask('New Mission', 'kanban', 'backlog')} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300 hover:bg-gray-700 border border-gray-700">+ Mission</button>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                    {kanbanColumns.map(col => (
                                        <div key={col.id} className="space-y-2">
                                            <div className="flex items-center justify-between px-1">
                                                <span className="text-[10px] font-bold text-gray-600 uppercase">{col.label}</span>
                                                <span className="text-[9px] text-gray-600 bg-gray-950 px-1.5 rounded">{tasks.filter(t => t.type === 'kanban' && t.column === col.id).length}</span>
                                            </div>
                                            <div className="space-y-2 min-h-[20px]">
                                                {tasks.filter(t => t.type === 'kanban' && t.column === col.id).map(task => (
                                                    <div key={task.id} onClick={() => setTaskModal(task)} className="bg-gray-950/50 p-3 rounded border border-gray-800 hover:border-indigo-500/50 cursor-pointer group transition-all">
                                                        <div className="text-sm text-gray-200 font-medium leading-snug mb-1">{task.title}</div>
                                                        {task.description && <div className="text-xs text-gray-500 line-clamp-2">{task.description}</div>}
                                                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800/50">
                                                            <span className="text-[9px] text-gray-600">{format(task.createdAt, 'MMM d')}</span>
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                                                {col.id !== 'backlog' && <button onClick={() => moveTask(task.id, 'left')} className="p-1 hover:bg-gray-800 rounded text-gray-500">←</button>}
                                                                {col.id !== 'done' && <button onClick={() => moveTask(task.id, 'right')} className="p-1 hover:bg-gray-800 rounded text-gray-500">→</button>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    /* --- RESOURCES VIEW --- */
                    <div className="h-full flex flex-col max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Icons.Library className="text-indigo-500" /> Library & Resources
                                </h2>
                                <p className="text-gray-500 mt-1">Curated list of books, courses, and documentation.</p>
                            </div>
                            <button 
                                onClick={() => setResources(p => [...p, {id: Date.now().toString(), title: 'New Section', items: []}])}
                                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors border border-gray-700"
                            >
                                <Icons.Plus size={16} /> Add Section
                            </button>
                        </div>

                        <div className="space-y-6 pb-20">
                            {resources.map(cat => (
                                <div key={cat.id} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-lg">
                                    <div 
                                        className="flex items-center justify-between px-6 py-4 bg-gray-800/30 cursor-pointer hover:bg-gray-800/50 transition-colors"
                                        onClick={() => setExpandedCategories(p => ({...p, [cat.id]: !p[cat.id]}))}
                                    >
                                        <div className="flex items-center gap-3">
                                            {expandedCategories[cat.id] ? <Icons.ChevronDown size={18} className="text-gray-500"/> : <Icons.ChevronRight size={18} className="text-gray-500"/>}
                                            <h3 className="font-bold text-gray-200">{cat.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                            <button 
                                                onClick={() => setNewResourceItem({catId: cat.id, title: '', url: '', desc: ''})}
                                                className="p-1.5 text-indigo-400 hover:bg-indigo-900/20 rounded transition-colors" title="Add Item"
                                            >
                                                <Icons.Plus size={16} />
                                            </button>
                                            <button 
                                                onClick={() => setResources(p => p.filter(c => c.id !== cat.id))}
                                                className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                            >
                                                <Icons.Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {expandedCategories[cat.id] && (
                                        <div className="p-4 space-y-2">
                                            {cat.items.length === 0 && <div className="text-center text-gray-600 text-sm py-4 italic">No items yet.</div>}
                                            {cat.items.map(item => (
                                                <div key={item.id} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-700/50">
                                                    <div className="mt-1 text-indigo-500"><Icons.FileText size={18} /></div>
                                                    <div className="flex-1 min-w-0">
                                                        <a href={item.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-200 hover:text-indigo-400 transition-colors flex items-center gap-2">
                                                            {item.title} <Icons.ExternalLink size={10} className="opacity-50"/>
                                                        </a>
                                                        {item.description && <p className="text-xs text-gray-500 mt-1">{item.description}</p>}
                                                    </div>
                                                    <button 
                                                        onClick={() => setResources(p => p.map(c => c.id === cat.id ? {...c, items: c.items.filter(i => i.id !== item.id)} : c))}
                                                        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 p-2"
                                                    >
                                                        <Icons.Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* --- MODALS --- */}
        
        {/* Schedule Block Modal */}
        {scheduleModal && (
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Edit Schedule Block</h3>
                        <button onClick={() => setScheduleModal(null)}><Icons.X size={18}/></button>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Start Time</label>
                                <input value={scheduleModal.start} onChange={e => setScheduleModal({...scheduleModal, start: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">End Time</label>
                                <input value={scheduleModal.end} onChange={e => setScheduleModal({...scheduleModal, end: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Title</label>
                            <input placeholder="Title" value={scheduleModal.title} onChange={e => setScheduleModal({...scheduleModal, title: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Description</label>
                            <input placeholder="Description" value={scheduleModal.description||''} onChange={e => setScheduleModal({...scheduleModal, description: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white" />
                        </div>
                        
                        <div>
                            <label className="text-xs text-gray-500 block mb-2">Color</label>
                            <div className="flex flex-wrap gap-2">
                                {SCHEDULE_COLORS.map(color => (
                                    <button 
                                        key={color.value} 
                                        onClick={() => setScheduleModal({...scheduleModal, color: color.value})}
                                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${color.value} bg-gray-800 ${scheduleModal.color === color.value ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                                        title={color.label}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-current`}></div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 block mb-2">Icon</label>
                            <div className="grid grid-cols-6 gap-2">
                                {SCHEDULE_ICONS.map(iconName => {
                                    const IconComp = (Icons as any)[iconName];
                                    return (
                                        <button 
                                            key={iconName} 
                                            onClick={() => setScheduleModal({...scheduleModal, icon: iconName})}
                                            className={`p-2 rounded-lg border transition-all flex items-center justify-center ${scheduleModal.icon === iconName ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
                                            title={iconName}
                                        >
                                            <IconComp size={18} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button onClick={() => setScheduleModal(null)} className="flex-1 py-2 text-gray-400 hover:bg-gray-800 rounded">Cancel</button>
                            <button onClick={saveScheduleBlock} className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
                        </div>
                    </div>
                </div>
             </div>
        )}
        
        {/* Add/Edit Course Modal */}
        {isCourseModalOpen && (
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-sm p-6 shadow-2xl">
                    <h3 className="text-lg font-bold text-white mb-4">Add Course</h3>
                    <div className="space-y-3">
                        <input placeholder="Title" value={editingCourse.title || ''} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white" />
                        <input placeholder="Category (e.g. Docker)" value={editingCourse.category || ''} onChange={e => setEditingCourse({...editingCourse, category: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white" />
                        <input placeholder="URL" value={editingCourse.url || ''} onChange={e => setEditingCourse({...editingCourse, url: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white" />
                        <div className="flex gap-2 overflow-x-auto py-1">
                            {['bg-indigo-600', 'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500'].map(c => (
                                <button key={c} onClick={() => setEditingCourse({...editingCourse, color: c})} className={`w-6 h-6 rounded-full ${c} ${editingCourse.color === c ? 'ring-2 ring-white' : ''}`} />
                            ))}
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button onClick={() => setIsCourseModalOpen(false)} className="flex-1 py-2 text-gray-400 hover:bg-gray-800 rounded">Cancel</button>
                            <button onClick={saveCourse} className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
                        </div>
                    </div>
                </div>
             </div>
        )}

        {/* Add Resource Item Modal */}
        {newResourceItem && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-sm p-6 shadow-2xl">
                    <h3 className="text-lg font-bold text-white mb-4">Add Resource</h3>
                    <div className="space-y-3">
                        <input placeholder="Title" value={newResourceItem.title} onChange={e => setNewResourceItem({...newResourceItem, title: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white" />
                        <input placeholder="Description" value={newResourceItem.desc} onChange={e => setNewResourceItem({...newResourceItem, desc: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white" />
                        <input placeholder="URL" value={newResourceItem.url} onChange={e => setNewResourceItem({...newResourceItem, url: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white" />
                        <div className="flex gap-2 pt-2">
                            <button onClick={() => setNewResourceItem(null)} className="flex-1 py-2 text-gray-400 hover:bg-gray-800 rounded">Cancel</button>
                            <button onClick={addResourceItem} className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Settings Modal */}
        {isSettingsOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-sm p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Settings</h3>
                    <div className="mb-4">
                        <p className="text-gray-500 text-xs italic">More settings coming soon.</p>
                    </div>
                    <div className="flex gap-2">
                         <button onClick={() => setIsSettingsOpen(false)} className="flex-1 py-2 text-gray-400 hover:bg-gray-800 rounded">Close</button>
                    </div>
                </div>
            </div>
        )}

        {/* Badge (Link) Editor Modal */}
        {linkModal && (
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Edit Badge Link</h3>
                        <button onClick={() => setLinkModal(null)}><Icons.X size={18}/></button>
                    </div>
                    
                    <div className="flex justify-center mb-6 bg-gray-950 p-4 rounded-lg border border-gray-800">
                         <div className="w-full max-w-[200px]">
                             <Badge link={linkModal} />
                         </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-xs text-gray-500 block mb-1">Label (Left)</label>
                                <input placeholder="e.g. Google" value={linkModal.label} onChange={e => setLinkModal({...linkModal, label: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white" />
                             </div>
                             <div>
                                <label className="text-xs text-gray-500 block mb-1">Message (Right)</label>
                                <input placeholder="e.g. Search" value={linkModal.message} onChange={e => setLinkModal({...linkModal, message: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white" />
                             </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">URL</label>
                            <input placeholder="https://..." value={linkModal.url} onChange={e => setLinkModal({...linkModal, url: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white" />
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 block mb-2">Color (Hex)</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {BADGE_COLORS.map(c => (
                                    <button 
                                        key={c.value} 
                                        onClick={() => setLinkModal({...linkModal, hexColor: c.value})}
                                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${linkModal.hexColor === c.value ? 'border-white' : 'border-transparent hover:border-gray-500'}`}
                                        style={{backgroundColor: `#${c.value}`}}
                                        title={c.label}
                                    />
                                ))}
                            </div>
                            <input placeholder="Custom Hex (e.g. 4285F4)" value={linkModal.hexColor} onChange={e => setLinkModal({...linkModal, hexColor: e.target.value.replace('#', '')})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white uppercase font-mono" />
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 block mb-2">Logo Slug (SimpleIcons)</label>
                            <div className="grid grid-cols-6 gap-1 mb-2 max-h-24 overflow-y-auto custom-scrollbar border border-gray-800 rounded p-1 bg-gray-950">
                                {COMMON_LOGOS.map(logo => (
                                    <button 
                                        key={logo} 
                                        onClick={() => setLinkModal({...linkModal, logo: logo})}
                                        className={`p-1 rounded text-[10px] truncate ${linkModal.logo === logo ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                                        title={logo}
                                    >
                                        {logo}
                                    </button>
                                ))}
                            </div>
                            <input placeholder="Custom slug (e.g. google)" value={linkModal.logo} onChange={e => setLinkModal({...linkModal, logo: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white font-mono" />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button onClick={() => setLinkModal(null)} className="flex-1 py-2 text-gray-400 hover:bg-gray-800 rounded">Cancel</button>
                            <button onClick={saveLink} className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
                        </div>
                    </div>
                </div>
             </div>
        )}

        {taskModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6">
                    <div className="flex justify-between mb-4"><h3 className="text-lg font-bold text-white">Edit Task</h3><button onClick={() => setTaskModal(null)}><Icons.X size={18}/></button></div>
                    <input value={taskModal.title} onChange={e => setTaskModal({...taskModal, title: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white mb-3" />
                    <textarea value={taskModal.description||''} onChange={e => setTaskModal({...taskModal, description: e.target.value})} className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm text-white h-24 mb-3" placeholder="Description" />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => { setTasks(t => t.map(x => x.id === taskModal.id ? taskModal : x)); setTaskModal(null); }} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
}
