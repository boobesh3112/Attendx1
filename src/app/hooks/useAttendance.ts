import { useState, useEffect, useCallback } from "react";
import { storage } from "../utils/storage";
import { format } from "date-fns";

export function useAttendance(date?: string) {
  const [attendance, setAttendance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const targetDate = date || format(new Date(), "yyyy-MM-dd");

  const loadAttendance = useCallback(() => {
    setIsLoading(true);
    try {
      const data = storage.getAttendance(targetDate);
      setAttendance(data);
    } catch (error) {
      console.error("Error loading attendance:", error);
    } finally {
      setIsLoading(false);
    }
  }, [targetDate]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const saveAttendance = useCallback(
    (data: any) => {
      storage.saveAttendance(targetDate, data);
      loadAttendance();
    },
    [targetDate, loadAttendance]
  );

  const unlockAttendance = useCallback(() => {
    storage.unlockAttendance(targetDate);
    loadAttendance();
  }, [targetDate, loadAttendance]);

  return {
    attendance,
    isLoading,
    saveAttendance,
    unlockAttendance,
    refresh: loadAttendance,
  };
}

export function useAttendanceStats(studentId?: string) {
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    total: 0,
    percentage: 0,
  });

  useEffect(() => {
    const calculateStats = () => {
      const attendanceRecords = storage.getAttendance();
      let present = 0;
      let absent = 0;
      let total = 0;

      Object.values(attendanceRecords).forEach((dayData: any) => {
        if (dayData.records) {
          if (studentId) {
            const record = dayData.records.find((r: any) => r.studentId === studentId);
            if (record) {
              total++;
              if (record.status === "present") present++;
              else if (record.status === "absent") absent++;
            }
          } else {
            dayData.records.forEach((record: any) => {
              total++;
              if (record.status === "present") present++;
              else if (record.status === "absent") absent++;
            });
          }
        }
      });

      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      setStats({ present, absent, total, percentage });
    };

    calculateStats();
  }, [studentId]);

  return stats;
}
