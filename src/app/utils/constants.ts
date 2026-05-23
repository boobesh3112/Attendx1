// Application constants

export const APP_NAME = "ClassRep Attendance Manager";
export const APP_VERSION = "1.0.0";

export const STORAGE_KEYS = {
  USER: "user",
  SETUP_DATA: "setupData",
  STUDENTS: "students",
  ATTENDANCE_RECORDS: "attendanceRecords",
  USER_PIN: "userPin",
  SETUP_COMPLETE: "setupComplete",
  SOUNDS_ENABLED: "soundsEnabled",
  HAPTICS_ENABLED: "hapticsEnabled",
  VOICE_ENABLED: "voiceEnabled",
  NOTIFICATIONS_ENABLED: "notificationsEnabled",
  ACCENT_COLOR: "accentColor",
  ANIMATION_SPEED: "animationSpeed",
  THEME: "theme",
  LAST_BACKUP_DATE: "lastBackupDate",
} as const;

export const DEFAULT_PERIODS = [
  { period: "1", start: "08:40", end: "09:30" },
  { period: "2", start: "09:30", end: "10:20" },
  { period: "Break", start: "10:20", end: "10:40", isBreak: true },
  { period: "3", start: "10:40", end: "11:30" },
  { period: "4", start: "11:30", end: "12:20" },
  { period: "Lunch", start: "12:20", end: "13:25", isBreak: true },
  { period: "5", start: "13:25", end: "14:10" },
  { period: "6", start: "14:10", end: "14:55" },
  { period: "Break", start: "14:55", end: "15:10", isBreak: true },
  { period: "7", start: "15:10", end: "15:55" },
  { period: "8", start: "15:55", end: "16:40" },
] as const;

export const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  ON_DUTY: "onduty",
  LEAVE: "leave",
  OTHER: "other",
} as const;

export const ROUTES = {
  SPLASH: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  SETUP: "/setup",
  HOME: "/app",
  MARK: "/app/mark",
  ANALYTICS: "/app/analytics",
  STUDENTS: "/app/students",
  PROFILE: "/app/profile",
} as const;

export const ATTENDANCE_THRESHOLD = {
  EXCELLENT: 90,
  GOOD: 80,
  WARNING: 75,
  CRITICAL: 60,
} as const;

export const ANIMATIONS = {
  SPRING: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  },
  SMOOTH: {
    duration: 0.3,
    ease: "easeInOut",
  },
  FAST: {
    duration: 0.15,
    ease: "easeOut",
  },
} as const;
