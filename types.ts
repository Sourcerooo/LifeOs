
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  column: 'todo' | 'in-progress' | 'done' | 'backlog';
  type: 'daily' | 'kanban';
  createdAt: number;
}

export interface ScheduleBlock {
  id: string;
  start: string; // HH:mm
  end: string;   // HH:mm
  title: string;
  description?: string;
  color?: string; // tailwind text color class
  icon?: string; // icon name
}

export type WeeklySchedule = Record<string, ScheduleBlock[]>;

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastLogin: string;
  commits: Record<string, number>; // manual commits
}

export interface QuickLink {
  id: string;
  label: string;    // Left side text (e.g. "Google")
  message: string;  // Right side text (e.g. "Search")
  url: string;      // Destination URL
  hexColor: string; // Right side background color (e.g. "4285F4")
  logo: string;     // Simple Icons slug (e.g. "google")
}

export interface Course {
  id: string;
  title: string;
  category: string;
  url: string;
  color: string; // tailwind color class for badge bg
}

export interface ResourceItem {
  id: string;
  title: string;
  description?: string;
  url?: string;
}

export interface ResourceCategory {
  id: string;
  title: string;
  items: ResourceItem[];
}

export enum DragType {
  TASK = 'TASK'
}
