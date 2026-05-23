// Advanced Timetable Engine
import { format, isToday, parse } from "date-fns";

export interface Period {
  id: string;
  periodNumber: string;
  subjectName: string;
  subjectCode: string;
  facultyName: string;
  facultyGender: "Sir" | "Mam";
  startTime: string;
  endTime: string;
  classroom?: string;
  color?: string;
  isBreak?: boolean;
}

export interface DayTimetable {
  day: string;
  date: string;
  set: "set1" | "set2";
  periods: Period[];
}

export interface TimetableData {
  semesterName: string;
  academicYear: string;
  set1: {
    monday: Period[];
    tuesday: Period[];
    wednesday: Period[];
    thursday: Period[];
    friday: Period[];
    saturday: Period[];
  };
  set2: {
    monday: Period[];
    tuesday: Period[];
    wednesday: Period[];
    thursday: Period[];
    friday: Period[];
    saturday: Period[];
  };
}

export class TimetableEngine {
  private timetable: TimetableData | null = null;
  private currentSet: "set1" | "set2" = "set1";

  constructor() {
    this.loadTimetable();
  }

  loadTimetable() {
    const stored = localStorage.getItem("timetable");
    if (stored) {
      this.timetable = JSON.parse(stored);
    }

    const currentSetStored = localStorage.getItem("currentSet");
    if (currentSetStored) {
      this.currentSet = currentSetStored as "set1" | "set2";
    }
  }

  saveTimetable(data: TimetableData) {
    this.timetable = data;
    localStorage.setItem("timetable", JSON.stringify(data));
  }

  setCurrentSet(set: "set1" | "set2") {
    this.currentSet = set;
    localStorage.setItem("currentSet", set);
  }

  getCurrentSet(): "set1" | "set2" {
    return this.currentSet;
  }

  getTodaySchedule(): Period[] {
    if (!this.timetable) return [];

    const today = format(new Date(), "EEEE").toLowerCase();
    const dayKey = today as keyof typeof this.timetable.set1;

    return this.timetable[this.currentSet][dayKey] || [];
  }

  getCurrentPeriod(): Period | null {
    const schedule = this.getTodaySchedule();
    if (schedule.length === 0) return null;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const period of schedule) {
      const [startHour, startMin] = period.startTime.split(":").map(Number);
      const [endHour, endMin] = period.endTime.split(":").map(Number);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (currentTime >= startMinutes && currentTime < endMinutes) {
        return period;
      }
    }

    return null;
  }

  getNextPeriod(): Period | null {
    const schedule = this.getTodaySchedule();
    if (schedule.length === 0) return null;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const period of schedule) {
      const [startHour, startMin] = period.startTime.split(":").map(Number);
      const startMinutes = startHour * 60 + startMin;

      if (currentTime < startMinutes) {
        return period;
      }
    }

    return null;
  }

  getRemainingTime(period: Period): { hours: number; minutes: number; seconds: number } {
    const now = new Date();
    const [endHour, endMin] = period.endTime.split(":").map(Number);

    const endTime = new Date();
    endTime.setHours(endHour, endMin, 0, 0);

    const diff = endTime.getTime() - now.getTime();

    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    return {
      hours: hours,
      minutes: minutes % 60,
      seconds: seconds % 60
    };
  }

  getTimeUntilNext(period: Period): { hours: number; minutes: number; seconds: number } {
    const now = new Date();
    const [startHour, startMin] = period.startTime.split(":").map(Number);

    const startTime = new Date();
    startTime.setHours(startHour, startMin, 0, 0);

    const diff = startTime.getTime() - now.getTime();

    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    return {
      hours: hours,
      minutes: minutes % 60,
      seconds: seconds % 60
    };
  }

  getClassStatus(): "in-class" | "break" | "lunch" | "ended" | "not-started" {
    const current = this.getCurrentPeriod();

    if (!current) {
      const schedule = this.getTodaySchedule();
      if (schedule.length === 0) return "ended";

      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const [firstHour, firstMin] = schedule[0].startTime.split(":").map(Number);
      const firstStart = firstHour * 60 + firstMin;

      if (currentTime < firstStart) return "not-started";
      return "ended";
    }

    if (current.isBreak) {
      if (current.periodNumber === "Lunch") return "lunch";
      return "break";
    }

    return "in-class";
  }

  getRemainingClassesToday(): number {
    const schedule = this.getTodaySchedule();
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return schedule.filter(period => {
      if (period.isBreak) return false;
      const [startHour, startMin] = period.startTime.split(":").map(Number);
      const startMinutes = startHour * 60 + startMin;
      return currentTime < startMinutes;
    }).length;
  }

  getCompletedClassesToday(): number {
    const schedule = this.getTodaySchedule();
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return schedule.filter(period => {
      if (period.isBreak) return false;
      const [endHour, endMin] = period.endTime.split(":").map(Number);
      const endMinutes = endHour * 60 + endMin;
      return currentTime >= endMinutes;
    }).length;
  }

  getPeriodProgress(period: Period): number {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = period.startTime.split(":").map(Number);
    const [endHour, endMin] = period.endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const totalMinutes = endMinutes - startMinutes;
    const elapsedMinutes = currentTime - startMinutes;

    return Math.min(100, Math.max(0, (elapsedMinutes / totalMinutes) * 100));
  }

  getDaySchedule(day: string, set?: "set1" | "set2"): Period[] {
    if (!this.timetable) return [];

    const useSet = set || this.currentSet;
    const dayKey = day.toLowerCase() as keyof typeof this.timetable.set1;

    return this.timetable[useSet][dayKey] || [];
  }

  getAllSubjects(): { name: string; code: string; color: string }[] {
    if (!this.timetable) return [];

    const subjects = new Set<string>();
    const subjectMap: { [key: string]: { name: string; code: string; color: string } } = {};

    const allDays = Object.values(this.timetable[this.currentSet]);

    allDays.forEach(periods => {
      periods.forEach(period => {
        if (!period.isBreak) {
          const key = `${period.subjectCode}`;
          if (!subjects.has(key)) {
            subjects.add(key);
            subjectMap[key] = {
              name: period.subjectName,
              code: period.subjectCode,
              color: period.color || this.getRandomColor()
            };
          }
        }
      });
    });

    return Object.values(subjectMap);
  }

  private getRandomColor(): string {
    const colors = [
      "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
      "#ec4899", "#06b6d4", "#14b8a6", "#a855f7", "#f97316"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

export const timetableEngine = new TimetableEngine();
