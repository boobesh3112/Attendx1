import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Save, Copy, Trash2, Calendar, Clock, User, BookOpen, MapPin, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { timetableEngine, Period, TimetableData } from "../utils/timetable";
import { haptics } from "../utils/haptics";
import { sounds } from "../utils/sounds";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SUBJECT_COLORS = [
  "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
  "#ec4899", "#06b6d4", "#14b8a6", "#a855f7", "#f97316"
];

export function Timetable() {
  const [currentSet, setCurrentSet] = useState<"set1" | "set2">("set1");
  const [selectedDay, setSelectedDay] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [timetable, setTimetable] = useState<TimetableData>({
    semesterName: "",
    academicYear: "",
    set1: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: []
    },
    set2: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: []
    }
  });
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = () => {
    const stored = localStorage.getItem("timetable");
    if (stored) {
      setTimetable(JSON.parse(stored));
    }
    setCurrentSet(timetableEngine.getCurrentSet());
  };

  const saveTimetable = () => {
    timetableEngine.saveTimetable(timetable);
    timetableEngine.setCurrentSet(currentSet);
    haptics.success();
    sounds.playSuccess();
    toast.success("Timetable saved successfully!");
  };

  const addPeriod = (period: Period) => {
    const dayKey = DAYS[selectedDay] as keyof typeof timetable.set1;
    const updatedPeriods = [...timetable[currentSet][dayKey], period];

    setTimetable({
      ...timetable,
      [currentSet]: {
        ...timetable[currentSet],
        [dayKey]: updatedPeriods
      }
    });

    setShowAddModal(false);
    haptics.light();
    sounds.playClick();
  };

  const updatePeriod = (period: Period) => {
    const dayKey = DAYS[selectedDay] as keyof typeof timetable.set1;
    const updatedPeriods = timetable[currentSet][dayKey].map(p =>
      p.id === period.id ? period : p
    );

    setTimetable({
      ...timetable,
      [currentSet]: {
        ...timetable[currentSet],
        [dayKey]: updatedPeriods
      }
    });

    setEditingPeriod(null);
    haptics.light();
  };

  const deletePeriod = (periodId: string) => {
    const dayKey = DAYS[selectedDay] as keyof typeof timetable.set1;
    const updatedPeriods = timetable[currentSet][dayKey].filter(p => p.id !== periodId);

    setTimetable({
      ...timetable,
      [currentSet]: {
        ...timetable[currentSet],
        [dayKey]: updatedPeriods
      }
    });

    haptics.light();
    toast.success("Period deleted");
  };

  const copyFromPreviousDay = () => {
    if (selectedDay === 0) {
      toast.error("No previous day to copy from");
      return;
    }

    const prevDayKey = DAYS[selectedDay - 1] as keyof typeof timetable.set1;
    const currentDayKey = DAYS[selectedDay] as keyof typeof timetable.set1;

    const copiedPeriods = timetable[currentSet][prevDayKey].map(p => ({
      ...p,
      id: `${Date.now()}-${Math.random()}`
    }));

    setTimetable({
      ...timetable,
      [currentSet]: {
        ...timetable[currentSet],
        [currentDayKey]: copiedPeriods
      }
    });

    haptics.success();
    toast.success(`Copied from ${DAY_LABELS[selectedDay - 1]}`);
  };

  const currentDayPeriods = timetable[currentSet][DAYS[selectedDay] as keyof typeof timetable.set1] || [];

  return (
    <div className="min-h-screen p-4 space-y-6 pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white mb-2">Timetable</h1>
        <p className="text-white/70">Create and manage your class schedule</p>
      </motion.div>

      {/* Set Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3"
      >
        <button
          onClick={() => setCurrentSet("set1")}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            currentSet === "set1"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "glass text-white/70"
          }`}
        >
          Set 1
        </button>
        <button
          onClick={() => setCurrentSet("set2")}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            currentSet === "set2"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "glass text-white/70"
          }`}
        >
          Set 2
        </button>
      </motion.div>

      {/* Day Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
      >
        {DAY_LABELS.map((day, index) => (
          <button
            key={day}
            onClick={() => setSelectedDay(index)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
              selectedDay === index
                ? "bg-white text-purple-600"
                : "glass text-white/70"
            }`}
          >
            {day}
          </button>
        ))}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3"
      >
        <button
          onClick={() => setShowAddModal(true)}
          className="flex-1 glass py-3 rounded-xl flex items-center justify-center gap-2 text-white"
        >
          <Plus size={20} />
          Add Period
        </button>
        <button
          onClick={copyFromPreviousDay}
          disabled={selectedDay === 0}
          className="glass py-3 px-4 rounded-xl disabled:opacity-50"
        >
          <Copy className="text-white" size={20} />
        </button>
      </motion.div>

      {/* Periods List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        {currentDayPeriods.length === 0 ? (
          <div className="glass-strong rounded-2xl p-12 text-center">
            <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No periods added</h3>
            <p className="text-white/60">Add your first period to get started</p>
          </div>
        ) : (
          currentDayPeriods.map((period) => (
            <PeriodCard
              key={period.id}
              period={period}
              onEdit={() => setEditingPeriod(period)}
              onDelete={() => deletePeriod(period.id)}
            />
          ))
        )}
      </motion.div>

      {/* Floating Save Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
        onClick={saveTimetable}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-2xl flex items-center justify-center z-50"
      >
        <Save className="text-white" size={24} />
      </motion.button>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || editingPeriod) && (
          <PeriodModal
            period={editingPeriod}
            onSave={(period) => {
              if (editingPeriod) {
                updatePeriod(period);
              } else {
                addPeriod(period);
              }
            }}
            onClose={() => {
              setShowAddModal(false);
              setEditingPeriod(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PeriodCard({ period, onEdit, onDelete }: {
  period: Period;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong rounded-2xl p-4 relative overflow-hidden"
      style={{
        borderLeft: `4px solid ${period.color || "#8b5cf6"}`
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{period.subjectName}</h3>
          <p className="text-white/60 text-sm">{period.subjectCode}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
          >
            <Edit2 className="text-white" size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-all"
          >
            <Trash2 className="text-red-400" size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <User size={16} />
          <span>{period.facultyName} {period.facultyGender}</span>
        </div>
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <Clock size={16} />
          <span>{period.startTime} - {period.endTime}</span>
        </div>
        {period.classroom && (
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <MapPin size={16} />
            <span>{period.classroom}</span>
          </div>
        )}
      </div>

      <div className="absolute top-0 right-0 px-3 py-1 bg-white/10 rounded-bl-xl">
        <span className="text-white/70 text-xs font-medium">{period.periodNumber}</span>
      </div>
    </motion.div>
  );
}

function PeriodModal({ period, onSave, onClose }: {
  period: Period | null;
  onSave: (period: Period) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Period>(
    period || {
      id: Date.now().toString(),
      periodNumber: "",
      subjectName: "",
      subjectCode: "",
      facultyName: "",
      facultyGender: "Sir",
      startTime: "",
      endTime: "",
      classroom: "",
      color: SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)],
      isBreak: false
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-strong rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-6">
          {period ? "Edit Period" : "Add Period"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/70 text-sm mb-2 block">Period Number</label>
            <input
              type="text"
              value={formData.periodNumber}
              onChange={(e) => setFormData({ ...formData, periodNumber: e.target.value })}
              className="w-full glass p-3 rounded-xl text-white"
              placeholder="e.g., Hour 1"
              required
            />
          </div>

          <div>
            <label className="text-white/70 text-sm mb-2 block">Subject Name</label>
            <input
              type="text"
              value={formData.subjectName}
              onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
              className="w-full glass p-3 rounded-xl text-white"
              placeholder="e.g., Mathematics"
              required
            />
          </div>

          <div>
            <label className="text-white/70 text-sm mb-2 block">Subject Code</label>
            <input
              type="text"
              value={formData.subjectCode}
              onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
              className="w-full glass p-3 rounded-xl text-white"
              placeholder="e.g., MA3251"
              required
            />
          </div>

          <div>
            <label className="text-white/70 text-sm mb-2 block">Faculty Name</label>
            <input
              type="text"
              value={formData.facultyName}
              onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
              className="w-full glass p-3 rounded-xl text-white"
              placeholder="e.g., John"
              required
            />
          </div>

          <div>
            <label className="text-white/70 text-sm mb-2 block">Faculty Gender</label>
            <select
              value={formData.facultyGender}
              onChange={(e) => setFormData({ ...formData, facultyGender: e.target.value as "Sir" | "Mam" })}
              className="w-full glass p-3 rounded-xl text-white"
            >
              <option value="Sir">Sir</option>
              <option value="Mam">Mam</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/70 text-sm mb-2 block">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full glass p-3 rounded-xl text-white"
                required
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-2 block">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full glass p-3 rounded-xl text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-2 block">Classroom (Optional)</label>
            <input
              type="text"
              value={formData.classroom}
              onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
              className="w-full glass p-3 rounded-xl text-white"
              placeholder="e.g., Room 301"
            />
          </div>

          <div>
            <label className="text-white/70 text-sm mb-2 block">Color</label>
            <div className="grid grid-cols-5 gap-2">
              {SUBJECT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-full aspect-square rounded-lg ${
                    formData.color === color ? "ring-2 ring-white ring-offset-2 ring-offset-transparent" : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 glass py-3 rounded-xl text-white font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-xl text-white font-semibold"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
