import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, UserPlus, Search, Filter, X, Phone, Mail, MessageCircle, Trash2, Edit, Download, AlertTriangle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { storage } from "../utils/storage";
import { sounds } from "../utils/sounds";
import { haptics } from "../utils/haptics";

export function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetails, setShowDetails] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "rollNo">("rollNo");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const loadedStudents = storage.getStudents();
    setStudents(loadedStudents);
  };

  const handleAddStudent = (student: any) => {
    storage.addStudent(student);
    loadStudents();
    setShowAddForm(false);
    sounds.playSuccess();
    haptics.success();
    toast.success("Student added successfully!");
  };

  const handleDeleteStudent = (id: string) => {
    // In a real app, this would require fingerprint verification
    toast.info("Biometric verification simulated. Deleting...");
    storage.deleteStudent(id);
    loadStudents();
    setShowDetails(null);
    sounds.playSuccess();
    haptics.medium();
    toast.success("Student deleted successfully!");
  };

  const filteredStudents = students
    .filter(s =>
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }
      return (a.rollNo || "").localeCompare(b.rollNo || "");
    });

  return (
    <div className="min-h-screen p-4 space-y-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Students</h1>
            <p className="text-white/70">Total: {students.length} students</p>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setSortBy(sortBy === "name" ? "rollNo" : "name")}
          className="glass px-4 py-3 rounded-xl text-white flex items-center gap-2"
        >
          <Filter size={20} />
          <span className="text-sm">{sortBy === "name" ? "Name" : "Roll No"}</span>
        </motion.button>
      </motion.div>

      {/* Students List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {filteredStudents.length === 0 ? (
          <div className="glass-strong rounded-2xl p-12 text-center">
            <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">
              {searchQuery ? "No students found" : "No students added yet"}
            </p>
          </div>
        ) : (
          filteredStudents.map((student, index) => (
            <StudentCard
              key={student.id}
              student={student}
              index={index}
              onClick={() => setShowDetails(student)}
            />
          ))
        )}
      </motion.div>

      {/* Floating Add Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setShowAddForm(true);
          sounds.playClick();
          haptics.light();
        }}
        className="fixed bottom-24 right-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-white z-40"
      >
        <UserPlus size={28} />
      </motion.button>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddForm && (
          <AddStudentModal
            onClose={() => setShowAddForm(false)}
            onAdd={handleAddStudent}
          />
        )}
      </AnimatePresence>

      {/* Student Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <StudentDetailsModal
            student={showDetails}
            onClose={() => setShowDetails(null)}
            onDelete={handleDeleteStudent}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StudentCard({ student, index, onClick }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="glass-strong rounded-2xl p-4 cursor-pointer hover:bg-white/15 transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {student.name?.charAt(0) || "?"}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold">{student.name}</h3>
          <p className="text-white/60 text-sm">Roll No: {student.rollNo}</p>
          {student.hostelStatus && (
            <p className="text-white/50 text-xs mt-1">{student.hostelStatus}</p>
          )}
        </div>
        <div className="text-right">
          <div className="w-2 h-2 bg-green-400 rounded-full mb-1 ml-auto" />
          <p className="text-white/50 text-xs">Active</p>
        </div>
      </div>
    </motion.div>
  );
}

function AddStudentModal({ onClose, onAdd }: any) {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    regNo: "",
    phone: "",
    email: "",
    hostelStatus: "Day Scholar",
  });

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.rollNo.trim()) newErrors.rollNo = "Roll number is required";
    if (!formData.regNo.trim()) newErrors.regNo = "Registration number is required";

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Invalid phone number";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onAdd(formData);
    } else {
      haptics.error();
      sounds.playError();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Add Student</h2>
          <button
            onClick={onClose}
            className="glass p-2 rounded-xl text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/90 mb-2 text-sm">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter student name"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/90 mb-2 text-sm">Roll No *</label>
              <input
                type="text"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="123"
              />
              {errors.rollNo && <p className="text-red-400 text-xs mt-1">{errors.rollNo}</p>}
            </div>

            <div>
              <label className="block text-white/90 mb-2 text-sm">Reg No *</label>
              <input
                type="text"
                value={formData.regNo}
                onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="ABC123"
              />
              {errors.regNo && <p className="text-red-400 text-xs mt-1">{errors.regNo}</p>}
            </div>
          </div>

          <div>
            <label className="block text-white/90 mb-2 text-sm">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="1234567890"
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-white/90 mb-2 text-sm">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="student@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-white/90 mb-2 text-sm">Status</label>
            <select
              value={formData.hostelStatus}
              onChange={(e) => setFormData({ ...formData, hostelStatus: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="Day Scholar" className="bg-purple-900">Day Scholar</option>
              <option value="Hosteller" className="bg-purple-900">Hosteller</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-white text-purple-600 rounded-xl font-semibold ripple"
          >
            Add Student
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function StudentDetailsModal({ student, onClose, onDelete }: any) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const attendanceRecords = storage.getAttendance();
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

  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  const qrData = JSON.stringify({
    name: student.name,
    rollNo: student.rollNo,
    regNo: student.regNo,
    phone: student.phone,
    email: student.email,
  });

  const handleCall = () => {
    if (student.phone) {
      window.location.href = `tel:${student.phone}`;
    } else {
      toast.error("Phone number not available");
    }
  };

  const handleEmail = () => {
    if (student.email) {
      window.location.href = `mailto:${student.email}`;
    } else {
      toast.error("Email not available");
    }
  };

  const handleWhatsApp = () => {
    if (student.phone) {
      const phone = student.phone.replace(/\D/g, "");
      window.open(`https://wa.me/${phone}`, "_blank");
    } else {
      toast.error("Phone number not available");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Student Details</h2>
          <button
            onClick={onClose}
            className="glass p-2 rounded-xl text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
            {student.name?.charAt(0) || "?"}
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{student.name}</h3>
          <p className="text-white/70">Roll No: {student.rollNo}</p>
        </div>

        {/* Attendance */}
        <div className="glass rounded-2xl p-6 mb-6 text-center">
          <p className="text-white/70 text-sm mb-2">Attendance</p>
          <p className={`text-4xl font-bold mb-2 ${
            percentage >= 75 ? "text-green-400" : percentage >= 50 ? "text-yellow-400" : "text-red-400"
          }`}>
            {percentage}%
          </p>
          <p className="text-white/60 text-sm">
            {present} / {total} days
          </p>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <InfoRow label="Registration No" value={student.regNo} />
          <InfoRow label="Phone" value={student.phone || "N/A"} />
          <InfoRow label="Email" value={student.email || "N/A"} />
          <InfoRow label="Status" value={student.hostelStatus || "N/A"} />
        </div>

        {/* QR Code */}
        <div className="glass rounded-2xl p-6 mb-6 text-center">
          <p className="text-white/70 text-sm mb-4">QR Code</p>
          <div className="bg-white p-4 rounded-xl inline-block">
            <QRCodeSVG value={qrData} size={180} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCall}
            className="py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl flex flex-col items-center gap-1 ripple"
          >
            <Phone size={20} />
            <span className="text-xs">Call</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleEmail}
            className="py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex flex-col items-center gap-1 ripple"
          >
            <Mail size={20} />
            <span className="text-xs">Email</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleWhatsApp}
            className="py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl flex flex-col items-center gap-1 ripple"
          >
            <MessageCircle size={20} />
            <span className="text-xs">WhatsApp</span>
          </motion.button>
        </div>

        {/* Delete Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowDeleteConfirm(true);
            haptics.light();
          }}
          className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl flex items-center justify-center gap-2 ripple"
        >
          <Trash2 size={18} />
          Delete Student
        </motion.button>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <DeleteConfirmationModal
              studentName={student.name}
              studentPhoto={student.photo}
              onConfirm={() => {
                setShowDeleteConfirm(false);
                onDelete(student.id);
              }}
              onCancel={() => {
                setShowDeleteConfirm(false);
                haptics.light();
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function DeleteConfirmationModal({ studentName, studentPhoto, onConfirm, onCancel }: {
  studentName: string;
  studentPhoto?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="glass-strong rounded-3xl p-8 w-full max-w-md relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Warning Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 15 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <AlertTriangle className="text-white" size={40} />
            </motion.div>
          </motion.div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Delete Student?
          </h2>

          {/* Message */}
          <p className="text-white/70 text-center mb-6">
            Are you sure you want to delete this student?
          </p>

          {/* Student Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-4 rounded-2xl mb-6 flex items-center gap-4"
          >
            {studentPhoto ? (
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-white/10">
                <img
                  src={studentPhoto}
                  alt={studentName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-2xl font-bold">
                  {studentName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-lg truncate">{studentName}</p>
              <p className="text-white/60 text-sm">This action cannot be undone</p>
            </div>
          </motion.div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="py-4 glass hover:bg-white/10 text-white rounded-2xl font-semibold transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                haptics.medium();
                onConfirm();
              }}
              className="py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-2xl font-semibold shadow-lg shadow-red-500/30 transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Delete</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
      <span className="text-white/70 text-sm">{label}</span>
      <span className="text-white font-medium text-sm">{value}</span>
    </div>
  );
}
