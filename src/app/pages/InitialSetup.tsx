import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { toast } from "sonner";

type TimetableEntry = {
  period: string;
  subject: string;
  subjectCode: string;
  faculty: string;
  facultyGender: "Male" | "Female" | "Other";
  facultyPhone: string;
  startTime: string;
  endTime: string;
};

type DaySchedule = {
  [key: string]: TimetableEntry[];
};

const DEFAULT_PERIODS = [
  { period: "1", start: "08:40", end: "09:30" },
  { period: "2", start: "09:30", end: "10:20" },
  { period: "Break", start: "10:20", end: "10:40" },
  { period: "3", start: "10:40", end: "11:30" },
  { period: "4", start: "11:30", end: "12:20" },
  { period: "Lunch", start: "12:20", end: "13:25" },
  { period: "5", start: "13:25", end: "14:10" },
  { period: "6", start: "14:10", end: "14:55" },
  { period: "Break", start: "14:55", end: "15:10" },
  { period: "7", start: "15:10", end: "15:55" },
  { period: "8", start: "15:55", end: "16:40" },
];

export function InitialSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    collegeName: "",
    department: "",
    branch: "",
    semester: "",
    year: "",
    section: "",
    className: "",
    tutorName: "",
    tutorPhone: "",
  });

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleTimetableSetup = () => {
    // Save all setup data
    localStorage.setItem("setupData", JSON.stringify(formData));
    localStorage.setItem("setupComplete", "true");

    // Initialize empty student list
    localStorage.setItem("students", JSON.stringify([]));

    // Initialize empty attendance records
    localStorage.setItem("attendanceRecords", JSON.stringify({}));

    toast.success("Setup completed successfully!");
    navigate("/app");
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 overflow-hidden">
      {/* Background particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Initial Setup</h1>
          <p className="text-white/70">Step {step} of 2</p>

          {/* Progress bar */}
          <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: step === 1 ? "50%" : "100%" }}
              className="h-full bg-white"
            />
          </div>
        </div>

        {step === 1 && (
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleBasicInfoSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/90 mb-2">College Name</label>
                <input
                  type="text"
                  required
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Enter college name"
                />
              </div>

              <div>
                <label className="block text-white/90 mb-2">Department</label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="e.g., Computer Science"
                />
              </div>

              <div>
                <label className="block text-white/90 mb-2">Branch</label>
                <input
                  type="text"
                  required
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="e.g., AI & ML"
                />
              </div>

              <div>
                <label className="block text-white/90 mb-2">Semester</label>
                <select
                  required
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="" disabled>Select semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem} className="bg-purple-900">
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/90 mb-2">Year</label>
                <select
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="" disabled>Select year</option>
                  {["1st", "2nd", "3rd", "4th"].map((year) => (
                    <option key={year} value={year} className="bg-purple-900">
                      {year} Year
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/90 mb-2">Section</label>
                <input
                  type="text"
                  required
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="e.g., A"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/90 mb-2">Class Name</label>
                <input
                  type="text"
                  required
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="e.g., CS-AI-3A"
                />
              </div>

              <div>
                <label className="block text-white/90 mb-2">Class Tutor Name</label>
                <input
                  type="text"
                  required
                  value={formData.tutorName}
                  onChange={(e) => setFormData({ ...formData, tutorName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Enter tutor name"
                />
              </div>

              <div>
                <label className="block text-white/90 mb-2">Tutor Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.tutorPhone}
                  onChange={(e) => setFormData({ ...formData, tutorPhone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2 ripple"
            >
              Continue to Timetable Setup
              <ChevronRight size={20} />
            </motion.button>
          </motion.form>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Default Timetable Schedule</h2>
              <p className="text-white/70 mb-4 text-sm">
                The following schedule is set as default. You can customize individual classes later from the app.
              </p>

              <div className="space-y-2">
                {DEFAULT_PERIODS.map((period, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      period.period === "Break" || period.period === "Lunch"
                        ? "bg-orange-500/20"
                        : "bg-white/10"
                    }`}
                  >
                    <span className="text-white font-medium">
                      {period.period === "Break" || period.period === "Lunch"
                        ? period.period
                        : `Period ${period.period}`}
                    </span>
                    <span className="text-white/80 text-sm">
                      {period.start} - {period.end}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Quick Setup Tips</h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 text-green-400" />
                  <span>You can add subjects and faculty details from the Mark Attendance page</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 text-green-400" />
                  <span>Add students from the Students page to start tracking attendance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="mt-0.5 text-green-400" />
                  <span>Timetable Set 1 & Set 2 can be configured later if needed</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(1)}
                className="flex-1 py-4 glass text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ripple"
              >
                <ChevronLeft size={20} />
                Back
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTimetableSetup}
                className="flex-1 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2 ripple"
              >
                Complete Setup
                <Check size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
