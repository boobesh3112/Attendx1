import { storage } from "./storage";
import { format, isToday, getHours, getMinutes } from "date-fns";

export interface AppNotification {
  id: string;
  type: "info" | "warning" | "success" | "alert";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: () => void;
}

class NotificationManager {
  private notifications: AppNotification[] = [];
  private listeners: ((notifications: AppNotification[]) => void)[] = [];

  constructor() {
    this.loadNotifications();
    this.checkScheduledNotifications();
  }

  private loadNotifications() {
    const saved = storage.getSetting("notifications", []);
    this.notifications = saved.map((n: any) => ({
      ...n,
      timestamp: new Date(n.timestamp)
    }));
  }

  private saveNotifications() {
    storage.setSetting("notifications", this.notifications);
  }

  subscribe(listener: (notifications: AppNotification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.getUnread()));
  }

  add(notification: Omit<AppNotification, "id" | "timestamp" | "read">) {
    const newNotification: AppNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notify();

    return newNotification.id;
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notify();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.notify();
  }

  getAll(): AppNotification[] {
    return this.notifications;
  }

  getUnread(): AppNotification[] {
    return this.notifications.filter(n => !n.read);
  }

  clear() {
    this.notifications = [];
    this.saveNotifications();
    this.notify();
  }

  // Smart notification checks
  checkScheduledNotifications() {
    this.checkAttendancePending();
    this.checkLowAttendance();
    this.checkBackupReminder();

    // Check every hour
    setInterval(() => {
      this.checkAttendancePending();
      this.checkLowAttendance();
    }, 60 * 60 * 1000);

    // Check backup weekly
    setInterval(() => {
      this.checkBackupReminder();
    }, 24 * 60 * 60 * 1000);
  }

  private checkAttendancePending() {
    const today = format(new Date(), "yyyy-MM-dd");
    const todayAttendance = storage.getAttendance(today);

    if (!todayAttendance.records || todayAttendance.records.length === 0) {
      const now = new Date();
      const hour = getHours(now);

      // Remind at 10 AM and 2 PM if not marked
      if (hour === 10 || hour === 14) {
        const existingReminder = this.notifications.find(
          n => n.type === "alert" && n.title.includes("Attendance Pending") && isToday(n.timestamp)
        );

        if (!existingReminder) {
          this.add({
            type: "alert",
            title: "Attendance Pending",
            message: "You haven't marked attendance today. Please mark attendance for your class."
          });
        }
      }
    }
  }

  private checkLowAttendance() {
    const students = storage.getStudents();
    const attendanceRecords = storage.getAttendance();

    const lowAttendanceStudents = students.filter(student => {
      let present = 0;
      let total = 0;

      Object.values(attendanceRecords).forEach((dayData: any) => {
        if (dayData.records) {
          const record = dayData.records.find((r: any) => r.studentId === student.id);
          if (record) {
            total++;
            if (record.status === "present") present++;
          }
        }
      });

      const percentage = total > 0 ? (present / total) * 100 : 0;
      return percentage < 75 && total >= 5;
    });

    if (lowAttendanceStudents.length > 0) {
      const existingAlert = this.notifications.find(
        n => n.type === "warning" && n.title.includes("Low Attendance Alert")
      );

      if (!existingAlert) {
        this.add({
          type: "warning",
          title: "Low Attendance Alert",
          message: `${lowAttendanceStudents.length} student${lowAttendanceStudents.length > 1 ? 's have' : ' has'} attendance below 75%`
        });
      }
    }
  }

  private checkBackupReminder() {
    const lastBackup = storage.getSetting("lastBackupDate");

    if (!lastBackup) {
      this.add({
        type: "info",
        title: "Backup Reminder",
        message: "Don't forget to backup your attendance data regularly to prevent data loss."
      });
    } else {
      const lastBackupDate = new Date(lastBackup);
      const daysSinceBackup = Math.floor((Date.now() - lastBackupDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceBackup >= 7) {
        this.add({
          type: "info",
          title: "Backup Reminder",
          message: `It's been ${daysSinceBackup} days since your last backup. Consider backing up your data.`
        });
      }
    }
  }
}

export const notificationManager = new NotificationManager();
