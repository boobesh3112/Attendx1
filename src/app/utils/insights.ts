import { storage } from "./storage";
import { format, subDays, differenceInDays } from "date-fns";

export const generateInsights = () => {
  const students = storage.getStudents();
  const attendanceRecords = storage.getAttendance();
  const insights: string[] = [];

  if (students.length === 0) {
    return ["Add students to start tracking attendance and get insights."];
  }

  // Calculate attendance trends
  const studentStats: any = {};

  students.forEach(student => {
    studentStats[student.id] = {
      name: student.name,
      present: 0,
      absent: 0,
      total: 0,
      streak: 0,
      lastStatus: null
    };
  });

  const dates = Object.keys(attendanceRecords).sort();

  dates.forEach(date => {
    const dayData = attendanceRecords[date];
    if (dayData.records) {
      dayData.records.forEach((record: any) => {
        if (studentStats[record.studentId]) {
          studentStats[record.studentId].total++;
          if (record.status === "present") {
            studentStats[record.studentId].present++;
            if (studentStats[record.studentId].lastStatus === "present") {
              studentStats[record.studentId].streak++;
            } else {
              studentStats[record.studentId].streak = 1;
            }
            studentStats[record.studentId].lastStatus = "present";
          } else if (record.status === "absent") {
            studentStats[record.studentId].absent++;
            studentStats[record.studentId].lastStatus = "absent";
            studentStats[record.studentId].streak = 0;
          }
        }
      });
    }
  });

  // Generate insights
  const stats = Object.values(studentStats);

  // Perfect attendance
  const perfectAttendance = stats.filter((s: any) => s.total > 0 && s.absent === 0);
  if (perfectAttendance.length > 0) {
    insights.push(`🏆 ${perfectAttendance.length} student${perfectAttendance.length > 1 ? 's have' : ' has'} perfect attendance!`);
  }

  // High streak
  const highStreaks = stats.filter((s: any) => s.streak >= 5).sort((a: any, b: any) => b.streak - a.streak);
  if (highStreaks.length > 0) {
    const top = highStreaks[0] as any;
    insights.push(`🔥 ${top.name} has a ${top.streak}-day attendance streak!`);
  }

  // Low attendance warning
  const lowAttendance = stats.filter((s: any) => {
    const percentage = s.total > 0 ? (s.present / s.total) * 100 : 0;
    return percentage < 75 && s.total > 0;
  });

  if (lowAttendance.length > 0) {
    insights.push(`⚠️ ${lowAttendance.length} student${lowAttendance.length > 1 ? 's' : ''} below 75% attendance`);
  }

  // Overall class performance
  const totalPresent = stats.reduce((sum: number, s: any) => sum + s.present, 0);
  const totalDays = stats.reduce((sum: number, s: any) => sum + s.total, 0);

  if (totalDays > 0) {
    const classAvg = Math.round((totalPresent / totalDays) * 100);
    if (classAvg >= 85) {
      insights.push(`✨ Excellent! Class average is ${classAvg}%`);
    } else if (classAvg >= 75) {
      insights.push(`📊 Class average attendance: ${classAvg}%`);
    } else {
      insights.push(`📉 Class average needs improvement: ${classAvg}%`);
    }
  }

  // Attendance trend (last 7 days)
  const recentDates = dates.slice(-7);
  if (recentDates.length >= 2) {
    const firstWeekAvg = calculateDayAverage(attendanceRecords[recentDates[0]]);
    const lastDayAvg = calculateDayAverage(attendanceRecords[recentDates[recentDates.length - 1]]);

    if (lastDayAvg > firstWeekAvg + 10) {
      insights.push(`📈 Attendance trending upward this week!`);
    } else if (lastDayAvg < firstWeekAvg - 10) {
      insights.push(`📉 Attendance declining this week`);
    }
  }

  // Days since last attendance marked
  if (dates.length > 0) {
    const lastDate = new Date(dates[dates.length - 1]);
    const today = new Date();
    const daysSince = differenceInDays(today, lastDate);

    if (daysSince > 1) {
      insights.push(`⏰ Last attendance marked ${daysSince} days ago`);
    }
  }

  return insights.length > 0 ? insights : ["Keep marking attendance to see insights!"];
};

function calculateDayAverage(dayData: any): number {
  if (!dayData || !dayData.records) return 0;

  const present = dayData.records.filter((r: any) => r.status === "present").length;
  const total = dayData.records.length;

  return total > 0 ? (present / total) * 100 : 0;
}

export const getPredictedAttendance = (studentId: string): number => {
  const attendanceRecords = storage.getAttendance();
  const dates = Object.keys(attendanceRecords).sort().slice(-5); // Last 5 days

  let presentCount = 0;
  let totalCount = 0;

  dates.forEach(date => {
    const dayData = attendanceRecords[date];
    if (dayData && dayData.records) {
      const record = dayData.records.find((r: any) => r.studentId === studentId);
      if (record) {
        totalCount++;
        if (record.status === "present") presentCount++;
      }
    }
  });

  return totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 85;
};
