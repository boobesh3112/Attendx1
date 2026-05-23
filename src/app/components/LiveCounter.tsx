import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { storage } from "../utils/storage";
import { format } from "date-fns";

export function LiveAttendanceCounter() {
  const [stats, setStats] = useState({ present: 0, total: 0, percentage: 0 });

  useEffect(() => {
    const updateStats = () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const todayAttendance = storage.getAttendance(today);
      const students = storage.getStudents();

      if (todayAttendance.records) {
        const present = todayAttendance.records.filter((r: any) => r.status === "present").length;
        const total = students.length;
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

        setStats({ present, total, percentage });
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong rounded-2xl p-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />

      <div className="relative z-10">
        <p className="text-white/70 text-xs mb-2">Live Attendance</p>

        <div className="flex items-end gap-2 mb-2">
          <motion.span
            key={stats.percentage}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold text-white"
          >
            {stats.percentage}%
          </motion.span>
          <span className="text-white/60 text-sm mb-1">strength</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.percentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full ${
                stats.percentage >= 80
                  ? "bg-green-500"
                  : stats.percentage >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
          </div>
          <span className="text-white/60 text-xs whitespace-nowrap">
            {stats.present}/{stats.total}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function CurrentPeriodProgress() {
  const [progress, setProgress] = useState(0);
  const [currentPeriod, setCurrentPeriod] = useState<any>(null);

  const DEFAULT_PERIODS = [
    { period: "1", start: "08:40", end: "09:30" },
    { period: "2", start: "09:30", end: "10:20" },
    { period: "3", start: "10:40", end: "11:30" },
    { period: "4", start: "11:30", end: "12:20" },
    { period: "5", start: "13:25", end: "14:10" },
    { period: "6", start: "14:10", end: "14:55" },
    { period: "7", start: "15:10", end: "15:55" },
    { period: "8", start: "15:55", end: "16:40" },
  ];

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      for (const period of DEFAULT_PERIODS) {
        const [startH, startM] = period.start.split(":").map(Number);
        const [endH, endM] = period.end.split(":").map(Number);
        const startTime = startH * 60 + startM;
        const endTime = endH * 60 + endM;

        if (currentMinutes >= startTime && currentMinutes < endTime) {
          const elapsed = currentMinutes - startTime;
          const duration = endTime - startTime;
          const percentage = Math.round((elapsed / duration) * 100);

          setProgress(percentage);
          setCurrentPeriod(period);
          return;
        }
      }

      setProgress(0);
      setCurrentPeriod(null);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!currentPeriod) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-white font-medium">Period {currentPeriod.period}</p>
          <p className="text-white/60 text-xs">{currentPeriod.start} - {currentPeriod.end}</p>
        </div>
        <span className="text-white text-2xl font-bold">{progress}%</span>
      </div>

      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        />
      </div>
    </motion.div>
  );
}
