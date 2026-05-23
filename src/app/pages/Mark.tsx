import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, Briefcase, Coffee, MoreHorizontal, Save, Lock, Unlock, MessageCircle, AlertCircle, BookOpen, Clock, User } from "lucide-react";
import { toast } from "sonner";
import { storage } from "../utils/storage";
import { haptics } from "../utils/haptics";
import { sounds } from "../utils/sounds";
import { timetableEngine } from "../utils/timetable";
import { format } from "date-fns";

type AttendanceStatus = "present" | "absent" | "onduty" | "leave" | "other";

interface StudentAttendance {
  studentId: string;
  status: AttendanceStatus;
}

export function Mark() {
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: AttendanceStatus }>({});
  const [isLocked, setIsLocked] = useState(false);
  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  useEffect(() => {
    // Load students
    const loadedStudents = storage.getStudents();
    setStudents(loadedStudents);

    // Load today's attendance if exists
    const todayAttendance = storage.getAttendance(today);
    if (todayAttendance.records) {
      const attendanceMap: { [key: string]: AttendanceStatus } = {};
      todayAttendance.records.forEach((record: StudentAttendance) => {
        attendanceMap[record.studentId] = record.status;
      });
      setAttendance(attendanceMap);
      setIsLocked(todayAttendance.locked || false);
    }
  }, [today]);

  // Check if it's break time (computed value, no state updates)
  const isBreakTime = useMemo(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;

    // Break times: 10:20-10:40, 14:55-15:10
    const breakTimes = [
      { start: 10 * 60 + 20, end: 10 * 60 + 40 },
      { start: 14 * 60 + 55, end: 15 * 60 + 10 }
    ];

    return breakTimes.some(({ start, end }) => currentTime >= start && currentTime <= end);
  }, []);

  const shouldShowWhatsAppReminder = isBreakTime && Object.keys(attendance).length > 0 && !isLocked;

  const handleMarkAll = (status: AttendanceStatus) => {
    if (isLocked) {
      toast.error("Attendance is locked. Unlock to edit.");
      haptics.error();
      sounds.playError();
      return;
    }

    const newAttendance: { [key: string]: AttendanceStatus } = {};
    students.forEach(student => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
    haptics.success();
    sounds.playSuccess();
    toast.success(`Marked all as ${status}`);
  };

  const handleMarkStudent = (studentId: string, status: AttendanceStatus) => {
    if (isLocked) {
      toast.error("Attendance is locked. Unlock to edit.");
      haptics.error();
      sounds.playError();
      return;
    }

    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
    haptics.light();
    sounds.playClick();
  };

  const handleSaveAttendance = () => {
    if (Object.keys(attendance).length === 0) {
      toast.error("Please mark attendance for at least one student");
      haptics.error();
      sounds.playError();
      return;
    }

    const records: StudentAttendance[] = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status
    }));

    storage.saveAttendance(today, { records });
    setIsLocked(true);
    haptics.success();
    sounds.playSuccess();
    toast.success("Attendance saved and locked successfully!");
  };

  const handleUnlock = () => {
    // In a real app, this would require fingerprint verification
    toast.info("Biometric authentication not available on web. Unlocking...");
    storage.unlockAttendance(today);
    setIsLocked(false);
    haptics.medium();
    sounds.playClick();
    toast.success("Attendance unlocked for editing");
  };

  const getAttendanceStats = () => {
    const total = students.length;
    const marked = Object.keys(attendance).length;
    const present = Object.values(attendance).filter(s => s === "present").length;
    const absent = Object.values(attendance).filter(s => s === "absent").length;
    const onduty = Object.values(attendance).filter(s => s === "onduty").length;
    const leave = Object.values(attendance).filter(s => s === "leave").length;
    const other = Object.values(attendance).filter(s => s === "other").length;

    return { total, marked, present, absent, onduty, leave, other };
  };

  const stats = getAttendanceStats();

  const generateWhatsAppMessage = () => {
    const now = new Date();
    const hours = now.getHours();
    let greeting = "Good Morning";
    if (hours >= 12 && hours < 17) greeting = "Good Afternoon";
    else if (hours >= 17) greeting = "Good Evening";

    const absentStudents = students.filter(s => attendance[s.id] === "absent");
    const onDutyStudents = students.filter(s => attendance[s.id] === "onduty");

    // Determine which period(s)
    const minutes = hours * 60 + now.getMinutes();
    let periodText = "Today's";

    if (minutes >= 8 * 60 + 40 && minutes < 10 * 60 + 20) {
      periodText = "(1st and 2nd hour)";
    } else if (minutes >= 10 * 60 + 40 && minutes < 12 * 60 + 20) {
      periodText = "(3rd and 4th hour)";
    }

    let message = `${greeting} Sir/Ma'am,\n\n${periodText} absentees:\n\n`;

    if (absentStudents.length > 0) {
      absentStudents.forEach((student, index) => {
        message += `${index + 1}. ${student.name} (${student.rollNo})\n`;
      });
    } else {
      message += "None\n";
    }

    if (onDutyStudents.length > 0) {
      message += `\nOn Duty:\n\n`;
      onDutyStudents.forEach((student, index) => {
        message += `${index + 1}. ${student.name} (${student.rollNo})\n`;
      });
    }

    message += `\nThank You`;

    return encodeURIComponent(message);
  };

  const handleWhatsApp = (business = false) => {
    const setupData = JSON.parse(localStorage.getItem("setupData") || "{}");
    const tutorPhone = setupData.tutorPhone?.replace(/\D/g, "") || "";

    if (!tutorPhone) {
      toast.error("Tutor phone number not set");
      return;
    }

    const message = generateWhatsAppMessage();
    const url = business
      ? `https://api.whatsapp.com/send?phone=${tutorPhone}&text=${message}`
      : `https://wa.me/${tutorPhone}?text=${message}`;

    window.open(url, "_blank");
    haptics.medium();
    sounds.playNotification();
  };

  if (students.length === 0) {
    return (
      <div className="min-h-screen p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-white mb-2">Mark Attendance</h1>
          <p className="text-white/70">Track student attendance for today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-6 text-center"
        >
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Students Added</h2>
          <p className="text-white/70">
            Please add students from the Students page to start marking attendance.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-6 pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-white">Mark Attendance</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={isLocked ? handleUnlock : handleSaveAttendance}
            className={`glass px-4 py-2 rounded-xl flex items-center gap-2 ${
              isLocked ? "text-yellow-400" : "text-green-400"
            }`}
          >
            {isLocked ? <Lock size={18} /> : <Save size={18} />}
            <span className="text-sm font-medium">{isLocked ? "Unlock" : "Save"}</span>
          </motion.button>
        </div>
        <p className="text-white/70">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
      </motion.div>

      {/* Current Period Info */}
      {timetableEngine.getCurrentPeriod() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-4"
          style={{
            borderLeft: `4px solid ${timetableEngine.getCurrentPeriod()?.color || "#8b5cf6"}`
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="text-purple-400" size={20} />
            <h3 className="text-sm font-semibold text-white">CURRENT PERIOD</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-white/60 text-xs mb-1">Subject</p>
              <p className="text-white font-semibold">{timetableEngine.getCurrentPeriod()?.subjectName}</p>
              <p className="text-white/60 text-xs">{timetableEngine.getCurrentPeriod()?.subjectCode}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Faculty</p>
              <p className="text-white font-semibold">
                {timetableEngine.getCurrentPeriod()?.facultyName} {timetableEngine.getCurrentPeriod()?.facultyGender}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/70 text-xs">
              <Clock size={14} />
              <span>
                {timetableEngine.getCurrentPeriod()?.startTime} - {timetableEngine.getCurrentPeriod()?.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/70 text-xs">
              <span>{timetableEngine.getCurrentPeriod()?.periodNumber}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-4"
      >
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-white text-2xl font-bold">{stats.present}</p>
            <p className="text-green-400 text-xs">Present</p>
          </div>
          <div>
            <p className="text-white text-2xl font-bold">{stats.absent}</p>
            <p className="text-red-400 text-xs">Absent</p>
          </div>
          <div>
            <p className="text-white text-2xl font-bold">{stats.onduty}</p>
            <p className="text-blue-400 text-xs">On Duty</p>
          </div>
          <div>
            <p className="text-white text-2xl font-bold">{stats.marked}/{stats.total}</p>
            <p className="text-white/70 text-xs">Marked</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleMarkAll("present")}
          disabled={isLocked}
          className="py-4 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-semibold flex items-center justify-center gap-2 ripple shadow-lg"
        >
          <CheckCircle size={20} />
          All Present
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleMarkAll("absent")}
          disabled={isLocked}
          className="py-4 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-semibold flex items-center justify-center gap-2 ripple shadow-lg"
        >
          <XCircle size={20} />
          All Absent
        </motion.button>
      </motion.div>

      {/* Students List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h2 className="text-lg font-semibold text-white">Students</h2>

        {students.map((student, index) => (
          <StudentAttendanceCard
            key={student.id}
            student={student}
            status={attendance[student.id]}
            onMarkAttendance={(status) => handleMarkStudent(student.id, status)}
            isLocked={isLocked}
            index={index}
          />
        ))}
      </motion.div>

      {/* WhatsApp Reminder */}
      <AnimatePresence>
        {shouldShowWhatsAppReminder && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-24 right-4 z-50"
          >
            <motion.button
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={() => handleWhatsApp(false)}
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2"
            >
              <MessageCircle size={24} />
              <span className="font-medium pr-2">Send to Tutor</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StudentAttendanceCard({
  student,
  status,
  onMarkAttendance,
  isLocked,
  index
}: {
  student: any;
  status: AttendanceStatus;
  onMarkAttendance: (status: AttendanceStatus) => void;
  isLocked: boolean;
  index: number;
}) {
  const statusButtons: { status: AttendanceStatus; label: string; color: string; icon: any }[] = [
    { status: "present", label: "P", color: "bg-green-500", icon: CheckCircle },
    { status: "absent", label: "A", color: "bg-red-500", icon: XCircle },
    { status: "onduty", label: "OD", color: "bg-blue-500", icon: Briefcase },
    { status: "leave", label: "L", color: "bg-yellow-500", icon: Coffee },
    { status: "other", label: "O", color: "bg-gray-500", icon: MoreHorizontal },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-strong rounded-2xl p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
          {student.name?.charAt(0) || "?"}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold">{student.name}</h3>
          <p className="text-white/60 text-sm">Roll No: {student.rollNo}</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {statusButtons.map(({ status: btnStatus, label, color, icon: Icon }) => (
          <motion.button
            key={btnStatus}
            whileHover={{ scale: isLocked ? 1 : 1.05 }}
            whileTap={{ scale: isLocked ? 1 : 0.95 }}
            onClick={() => !isLocked && onMarkAttendance(btnStatus)}
            disabled={isLocked}
            className={`py-3 rounded-xl font-bold text-white transition-all ripple ${
              status === btnStatus ? color : "bg-white/10"
            } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="flex flex-col items-center gap-1">
              <Icon size={16} />
              <span className="text-xs">{label}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
