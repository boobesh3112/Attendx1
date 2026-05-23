import { motion } from "motion/react";
import { Clock, Users, TrendingUp, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

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

export function CurrentClassWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentClass = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();

    for (const period of DEFAULT_PERIODS) {
      const [startH, startM] = period.start.split(":").map(Number);
      const [endH, endM] = period.end.split(":").map(Number);
      const startTime = startH * 60 + startM;
      const endTime = endH * 60 + endM;

      if (now >= startTime && now < endTime) {
        return { ...period, status: "ongoing", remainingMinutes: endTime - now };
      }
    }

    for (const period of DEFAULT_PERIODS) {
      const [startH, startM] = period.start.split(":").map(Number);
      const startTime = startH * 60 + startM;
      if (now < startTime) {
        return { ...period, status: "upcoming", remainingMinutes: startTime - now };
      }
    }

    return null;
  };

  const currentClass = getCurrentClass();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong rounded-2xl p-4 border border-white/10"
    >
      <div className="flex items-center gap-2 mb-3">
        <Clock className="text-white" size={18} />
        <h3 className="text-white font-semibold text-sm">Current Class</h3>
      </div>

      {currentClass ? (
        <div>
          <p className="text-white text-2xl font-bold mb-1">Period {currentClass.period}</p>
          <p className={`text-sm ${
            currentClass.status === "ongoing" ? "text-green-400" : "text-yellow-400"
          }`}>
            {currentClass.status === "ongoing" ? "In Progress" : "Coming Up"}
          </p>
          <p className="text-white/60 text-xs mt-2">
            {currentClass.start} - {currentClass.end}
          </p>
        </div>
      ) : (
        <p className="text-white/50 text-sm">No classes scheduled</p>
      )}
    </motion.div>
  );
}

export function AttendanceSummaryWidget({ present, total }: { present: number; total: number }) {
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="glass-strong rounded-2xl p-4 border border-white/10"
    >
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="text-white" size={18} />
        <h3 className="text-white font-semibold text-sm">Today's Summary</h3>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-2xl font-bold">{percentage}%</p>
          <p className="text-white/60 text-xs">{present}/{total} Present</p>
        </div>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          percentage >= 80 ? "bg-green-500/20" : percentage >= 50 ? "bg-yellow-500/20" : "bg-red-500/20"
        }`}>
          <CheckCircle className={
            percentage >= 80 ? "text-green-400" : percentage >= 50 ? "text-yellow-400" : "text-red-400"
          } size={32} />
        </div>
      </div>
    </motion.div>
  );
}

export function QuickStatsWidget({ totalStudents }: { totalStudents: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="glass-strong rounded-2xl p-4 border border-white/10"
    >
      <div className="flex items-center gap-2 mb-3">
        <Users className="text-white" size={18} />
        <h3 className="text-white font-semibold text-sm">Class Strength</h3>
      </div>

      <p className="text-white text-3xl font-bold mb-1">{totalStudents}</p>
      <p className="text-white/60 text-xs">Total Students</p>
    </motion.div>
  );
}
