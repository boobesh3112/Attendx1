import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, User, BookOpen, MapPin, Coffee, CheckCircle } from "lucide-react";
import { timetableEngine, Period } from "../utils/timetable";

export function CurrentClassCard() {
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null);
  const [nextPeriod, setNextPeriod] = useState<Period | null>(null);
  const [remainingTime, setRemainingTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [nextTime, setNextTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"in-class" | "break" | "lunch" | "ended" | "not-started">("not-started");

  useEffect(() => {
    const updateClass = () => {
      const current = timetableEngine.getCurrentPeriod();
      const next = timetableEngine.getNextPeriod();
      const classStatus = timetableEngine.getClassStatus();

      setCurrentPeriod(current);
      setNextPeriod(next);
      setStatus(classStatus);

      if (current) {
        const remaining = timetableEngine.getRemainingTime(current);
        setRemainingTime(remaining);
        setProgress(timetableEngine.getPeriodProgress(current));
      }

      if (next && !current) {
        const timeUntil = timetableEngine.getTimeUntilNext(next);
        setNextTime(timeUntil);
      }
    };

    updateClass();
    const interval = setInterval(updateClass, 1000);

    return () => clearInterval(interval);
  }, []);

  if (status === "ended") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-8 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20" />
        <div className="relative z-10">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Classes Ended</h2>
          <p className="text-white/70">All classes completed for today</p>
        </div>
      </motion.div>
    );
  }

  if (status === "not-started" && nextPeriod) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-blue-400" size={24} />
            <h3 className="text-lg font-semibold text-white">First Class Today</h3>
          </div>

          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-1">{nextPeriod.subjectName}</h2>
            <p className="text-white/60">{nextPeriod.subjectCode}</p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-white/70">
              <User size={16} />
              <span>{nextPeriod.facultyName} {nextPeriod.facultyGender}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Clock size={16} />
              <span>{nextPeriod.startTime} - {nextPeriod.endTime}</span>
            </div>
          </div>

          <div className="glass p-4 rounded-xl">
            <p className="text-white/60 text-sm mb-1">Starts in</p>
            <p className="text-2xl font-bold text-blue-400">
              {String(nextTime.hours).padStart(2, "0")}:
              {String(nextTime.minutes).padStart(2, "0")}:
              {String(nextTime.seconds).padStart(2, "0")}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (status === "break" || status === "lunch") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-8 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-amber-500/20" />
        <div className="relative z-10">
          <Coffee className="w-20 h-20 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {status === "lunch" ? "Lunch Break" : "Break Time"}
          </h2>
          {currentPeriod && (
            <div className="glass p-4 rounded-xl mt-4 inline-block">
              <p className="text-white/60 text-sm mb-1">Ends in</p>
              <p className="text-2xl font-bold text-orange-400">
                {String(remainingTime.hours).padStart(2, "0")}:
                {String(remainingTime.minutes).padStart(2, "0")}:
                {String(remainingTime.seconds).padStart(2, "0")}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  if (!currentPeriod) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl p-6 relative overflow-hidden"
      style={{
        borderLeft: `4px solid ${currentPeriod.color || "#8b5cf6"}`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="text-purple-400" size={24} />
            <h3 className="text-lg font-semibold text-white">CURRENT CLASS</h3>
          </div>
          <div className="px-3 py-1 bg-white/10 rounded-full">
            <span className="text-white/70 text-sm font-medium">{currentPeriod.periodNumber}</span>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-3xl font-bold text-white mb-2">{currentPeriod.subjectName}</h2>
          <p className="text-white/60 text-lg">{currentPeriod.subjectCode}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-white/60">Handled by</p>
              <p className="font-semibold">{currentPeriod.facultyName} {currentPeriod.facultyGender}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white/80">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Clock size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-white/60">Timing</p>
              <p className="font-semibold">{currentPeriod.startTime} - {currentPeriod.endTime}</p>
            </div>
          </div>

          {currentPeriod.classroom && (
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <MapPin size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-white/60">Classroom</p>
                <p className="font-semibold">{currentPeriod.classroom}</p>
              </div>
            </div>
          )}
        </div>

        <div className="glass p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/60 text-sm">Remaining Time</p>
            <p className="text-white/60 text-sm">{Math.round(progress)}%</p>
          </div>
          <p className="text-4xl font-bold text-white mb-3">
            {String(remainingTime.hours).padStart(2, "0")}:
            {String(remainingTime.minutes).padStart(2, "0")}:
            {String(remainingTime.seconds).padStart(2, "0")}
          </p>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
        </div>

        {nextPeriod && (
          <div className="glass p-4 rounded-xl">
            <p className="text-white/60 text-sm mb-2">Next Class</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{nextPeriod.subjectName}</p>
                <p className="text-sm text-white/60">{nextPeriod.facultyName} {nextPeriod.facultyGender}</p>
              </div>
              <p className="text-white/70">{nextPeriod.startTime}</p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
    </motion.div>
  );
}
