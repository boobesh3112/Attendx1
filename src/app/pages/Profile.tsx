import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Moon,
  Sun,
  Lock,
  Smartphone,
  LogOut,
  Calendar,
  Download,
  Upload,
  Volume2,
  VolumeX,
  Vibrate,
  Edit,
  Eye,
  EyeOff,
  X,
  CheckCircle,
  Archive,
  Settings,
  Clock
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { storage } from "../utils/storage";
import { sounds } from "../utils/sounds";
import { haptics } from "../utils/haptics";
import { format } from "date-fns";

export function Profile() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<string | null>(null);
  const [soundsEnabled, setSoundsEnabled] = useState(sounds.isEnabled());
  const [hapticsEnabled, setHapticsEnabled] = useState(storage.getSetting("hapticsEnabled", true));

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const setupData = JSON.parse(localStorage.getItem("setupData") || "{}");

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  const handleSoundsToggle = () => {
    const newValue = !soundsEnabled;
    setSoundsEnabled(newValue);
    sounds.setEnabled(newValue);
    if (newValue) {
      sounds.playClick();
    }
    toast.success(`Sounds ${newValue ? "enabled" : "disabled"}`);
  };

  const handleHapticsToggle = () => {
    const newValue = !hapticsEnabled;
    setHapticsEnabled(newValue);
    storage.setSetting("hapticsEnabled", newValue);
    if (newValue) {
      haptics.light();
    }
    toast.success(`Haptics ${newValue ? "enabled" : "disabled"}`);
  };

  return (
    <div className="min-h-screen p-4 space-y-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
        <p className="text-white/70">Manage your account and settings</p>
      </motion.div>

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.name?.charAt(0) || "C"}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">{user.name}</h2>
            <p className="text-white/70 text-sm">Class Representative</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal("editProfile")}
              className="text-purple-400 text-sm mt-1 flex items-center gap-1"
            >
              <Edit size={14} />
              Edit Profile
            </motion.button>
          </div>
        </div>

        <div className="space-y-2 text-white/70 text-sm glass rounded-xl p-4">
          <p><strong className="text-white">College:</strong> {setupData.collegeName}</p>
          <p><strong className="text-white">Department:</strong> {setupData.department} - {setupData.branch}</p>
          <p><strong className="text-white">Semester:</strong> {setupData.semester} • {setupData.year} Year • Section {setupData.section}</p>
          <p><strong className="text-white">Class:</strong> {setupData.className}</p>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-semibold text-white">Security</h3>

        <SettingCard
          icon={Lock}
          title="Change Password"
          description="Update your account password"
          onClick={() => setShowModal("changePassword")}
        />

        <SettingCard
          icon={Smartphone}
          title="Change PIN"
          description="Update your 4-digit login PIN"
          onClick={() => setShowModal("changePIN")}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-semibold text-white">Appearance & Feedback</h3>

        <div className="glass-strong rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === "dark" ? <Moon className="text-white" size={20} /> : <Sun className="text-white" size={20} />}
            <div>
              <p className="text-white font-medium">Theme</p>
              <p className="text-white/60 text-xs">Switch between light and dark mode</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
              sounds.playClick();
              haptics.light();
            }}
            className="px-4 py-2 bg-white/20 rounded-xl text-white text-sm font-medium"
          >
            {theme === "dark" ? "Dark" : "Light"}
          </motion.button>
        </div>

        <div className="glass-strong rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {soundsEnabled ? <Volume2 className="text-white" size={20} /> : <VolumeX className="text-white" size={20} />}
            <div>
              <p className="text-white font-medium">Sound Effects</p>
              <p className="text-white/60 text-xs">Enable or disable app sounds</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSoundsToggle}
            className={`w-14 h-8 rounded-full transition-all ${
              soundsEnabled ? "bg-green-500" : "bg-white/20"
            }`}
          >
            <motion.div
              animate={{ x: soundsEnabled ? 24 : 2 }}
              className="w-6 h-6 bg-white rounded-full mt-1"
            />
          </motion.button>
        </div>

        <div className="glass-strong rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Vibrate className="text-white" size={20} />
            <div>
              <p className="text-white font-medium">Haptic Feedback</p>
              <p className="text-white/60 text-xs">Enable vibration feedback</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleHapticsToggle}
            className={`w-14 h-8 rounded-full transition-all ${
              hapticsEnabled ? "bg-green-500" : "bg-white/20"
            }`}
          >
            <motion.div
              animate={{ x: hapticsEnabled ? 24 : 2 }}
              className="w-6 h-6 bg-white rounded-full mt-1"
            />
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-semibold text-white">Data Management</h3>

        <SettingCard
          icon={Calendar}
          title="Edit Timetable"
          description="Modify your class schedule"
          onClick={() => setShowModal("editTimetable")}
        />

        <SettingCard
          icon={Download}
          title="Backup Data"
          description="Create a backup of all your data"
          onClick={() => setShowModal("backup")}
        />

        <SettingCard
          icon={Upload}
          title="Restore Data"
          description="Restore from a previous backup"
          onClick={() => setShowModal("restore")}
        />

        <SettingCard
          icon={Archive}
          title="End Semester"
          description="Archive current semester data"
          onClick={() => setShowModal("endSemester")}
          danger
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full glass-strong rounded-2xl p-4 flex items-center justify-center gap-3 text-red-400 hover:bg-red-500/20"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </motion.button>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showModal === "changePassword" && (
          <ChangePasswordModal onClose={() => setShowModal(null)} />
        )}
        {showModal === "changePIN" && (
          <ChangePINModal onClose={() => setShowModal(null)} />
        )}
        {showModal === "editProfile" && (
          <EditProfileModal onClose={() => setShowModal(null)} />
        )}
        {showModal === "backup" && (
          <BackupModal onClose={() => setShowModal(null)} />
        )}
        {showModal === "restore" && (
          <RestoreModal onClose={() => setShowModal(null)} />
        )}
        {showModal === "endSemester" && (
          <EndSemesterModal onClose={() => setShowModal(null)} />
        )}
        {showModal === "editTimetable" && (
          <EditTimetableModal onClose={() => setShowModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingCard({ icon: Icon, title, description, onClick, danger = false }: any) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        onClick();
        sounds.playClick();
        haptics.light();
      }}
      className={`w-full glass-strong rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-white/10 transition-all ${
        danger ? "border border-red-500/30" : ""
      }`}
    >
      <Icon className={danger ? "text-red-400" : "text-white"} size={20} />
      <div className="flex-1">
        <p className={`font-medium ${danger ? "text-red-400" : "text-white"}`}>{title}</p>
        <p className="text-white/60 text-xs">{description}</p>
      </div>
    </motion.button>
  );
}

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (formData.currentPassword !== user.password) {
      toast.error("Current password is incorrect");
      haptics.error();
      sounds.playError();
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      haptics.error();
      sounds.playError();
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      haptics.error();
      sounds.playError();
      return;
    }

    user.password = formData.newPassword;
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Password changed successfully!");
    haptics.success();
    sounds.playSuccess();
    onClose();
  };

  return (
    <ModalWrapper onClose={onClose} title="Change Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/90 mb-2 text-sm">Current Password</label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
            >
              {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-white/90 mb-2 text-sm">New Password</label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
            >
              {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-white/90 mb-2 text-sm">Confirm New Password</label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
            >
              {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-4 bg-white text-purple-600 rounded-xl font-semibold ripple"
        >
          Change Password
        </motion.button>
      </form>
    </ModalWrapper>
  );
}

function ChangePINModal({ onClose }: { onClose: () => void }) {
  const [newPIN, setNewPIN] = useState("");
  const [confirmPIN, setConfirmPIN] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPIN.length !== 4 || confirmPIN.length !== 4) {
      toast.error("PIN must be 4 digits");
      haptics.error();
      sounds.playError();
      return;
    }

    if (newPIN !== confirmPIN) {
      toast.error("PINs do not match");
      haptics.error();
      sounds.playError();
      return;
    }

    localStorage.setItem("userPin", newPIN);
    toast.success("PIN changed successfully!");
    haptics.success();
    sounds.playSuccess();
    onClose();
  };

  return (
    <ModalWrapper onClose={onClose} title="Change PIN">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/90 mb-2 text-sm text-center">New 4-Digit PIN</label>
          <input
            type="password"
            maxLength={4}
            value={newPIN}
            onChange={(e) => /^\d*$/.test(e.target.value) && setNewPIN(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl glass text-white text-center text-2xl tracking-widest placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="••••"
          />
        </div>

        <div>
          <label className="block text-white/90 mb-2 text-sm text-center">Confirm PIN</label>
          <input
            type="password"
            maxLength={4}
            value={confirmPIN}
            onChange={(e) => /^\d*$/.test(e.target.value) && setConfirmPIN(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl glass text-white text-center text-2xl tracking-widest placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="••••"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={newPIN.length !== 4 || confirmPIN.length !== 4}
          className="w-full py-4 bg-white text-purple-600 rounded-xl font-semibold ripple disabled:opacity-50"
        >
          Change PIN
        </motion.button>
      </form>
    </ModalWrapper>
  );
}

function EditProfileModal({ onClose }: { onClose: () => void }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const setup = JSON.parse(localStorage.getItem("setupData") || "{}");

  const [formData, setFormData] = useState({
    name: user.name || "",
    collegeName: setup.collegeName || "",
    department: setup.department || "",
    branch: setup.branch || "",
    semester: setup.semester || "",
    year: setup.year || "",
    section: setup.section || "",
    className: setup.className || "",
    tutorName: setup.tutorName || "",
    tutorPhone: setup.tutorPhone || "",
    rollNumberStart: setup.rollNumberStart || "",
    totalStudents: setup.totalStudents || "",
  });

  const update = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      haptics.error();
      sounds.playError();
      return;
    }
    if (!formData.collegeName.trim()) {
      toast.error("College name cannot be empty");
      haptics.error();
      sounds.playError();
      return;
    }

    const updatedUser = { ...user, name: formData.name };
    const updatedSetup = {
      ...setup,
      collegeName: formData.collegeName,
      department: formData.department,
      branch: formData.branch,
      semester: formData.semester,
      year: formData.year,
      section: formData.section,
      className: formData.className,
      tutorName: formData.tutorName,
      tutorPhone: formData.tutorPhone,
      rollNumberStart: formData.rollNumberStart,
      totalStudents: formData.totalStudents,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("setupData", JSON.stringify(updatedSetup));

    toast.success("Profile updated successfully!");
    haptics.success();
    sounds.playSuccess();
    onClose();
    window.location.reload();
  };

  const Field = ({ label, field, placeholder, type = "text" }: { label: string; field: string; placeholder: string; type?: string }) => (
    <div>
      <label className="block text-white/70 mb-1.5 text-xs font-medium uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={(formData as any)[field]}
        onChange={(e) => update(field, e.target.value)}
        className="w-full px-4 py-3 rounded-xl glass text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/60 transition-all text-sm"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <ModalWrapper onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal */}
        <div>
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-3">Personal</p>
          <div className="space-y-3">
            <Field label="Your Name" field="name" placeholder="Enter your name" />
          </div>
        </div>

        {/* Academic */}
        <div>
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-3">Academic Details</p>
          <div className="space-y-3">
            <Field label="College Name" field="collegeName" placeholder="e.g. MIT College of Engineering" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Department" field="department" placeholder="e.g. CSE" />
              <Field label="Branch" field="branch" placeholder="e.g. Computer Science" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Semester" field="semester" placeholder="e.g. 5" />
              <Field label="Year" field="year" placeholder="e.g. 3rd" />
              <Field label="Section" field="section" placeholder="e.g. A" />
            </div>
            <Field label="Class Name" field="className" placeholder="e.g. CSE-A 2022-26" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Roll No. Start" field="rollNumberStart" placeholder="e.g. 101" />
              <Field label="Total Students" field="totalStudents" placeholder="e.g. 60" type="number" />
            </div>
          </div>
        </div>

        {/* Tutor */}
        <div>
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-3">Tutor Details</p>
          <div className="space-y-3">
            <Field label="Tutor Name" field="tutorName" placeholder="e.g. Dr. Priya Sharma" />
            <Field label="Tutor Phone" field="tutorPhone" placeholder="e.g. +91 98765 43210" />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold ripple shadow-lg shadow-purple-500/30"
        >
          Save Changes
        </motion.button>
      </form>
    </ModalWrapper>
  );
}

function BackupModal({ onClose }: { onClose: () => void }) {
  const handleBackup = () => {
    const backup = storage.createBackup();
    const blob = new Blob([backup], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_backup_${format(new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Backup created successfully!");
    haptics.success();
    sounds.playSuccess();
    onClose();
  };

  return (
    <ModalWrapper onClose={onClose} title="Backup Data">
      <div className="text-center py-6">
        <Download className="w-16 h-16 text-white/70 mx-auto mb-4" />
        <p className="text-white/70 mb-6">
          Create a backup of all your students, attendance records, and settings.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBackup}
          className="w-full py-4 bg-white text-purple-600 rounded-xl font-semibold ripple"
        >
          Download Backup
        </motion.button>
      </div>
    </ModalWrapper>
  );
}

function RestoreModal({ onClose }: { onClose: () => void }) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (storage.restoreBackup(content)) {
        toast.success("Backup restored successfully!");
        haptics.success();
        sounds.playSuccess();
        onClose();
        window.location.reload();
      } else {
        toast.error("Failed to restore backup");
        haptics.error();
        sounds.playError();
      }
    };
    reader.readAsText(file);
  };

  return (
    <ModalWrapper onClose={onClose} title="Restore Data">
      <div className="text-center py-6">
        <Upload className="w-16 h-16 text-white/70 mx-auto mb-4" />
        <p className="text-white/70 mb-6">
          Restore your data from a previous backup file.
        </p>
        <label className="w-full py-4 bg-white text-purple-600 rounded-xl font-semibold cursor-pointer flex items-center justify-center gap-2 ripple">
          <Upload size={20} />
          Select Backup File
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    </ModalWrapper>
  );
}

function EndSemesterModal({ onClose }: { onClose: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const setupData = JSON.parse(localStorage.getItem("setupData") || "{}");
  const students = storage.getStudents();

  const handleEndSemester = () => {
    const backup = storage.createBackup();
    const timestamp = format(new Date(), "yyyy-MM-dd_HHmmss");

    localStorage.setItem(`semester_archive_${timestamp}`, backup);
    localStorage.setItem("students", JSON.stringify([]));
    localStorage.setItem("attendanceRecords", JSON.stringify({}));

    toast.success("Semester ended! Data archived successfully.");
    haptics.success();
    sounds.playSuccess();
    onClose();
    window.location.reload();
  };

  return (
    <ModalWrapper onClose={onClose} title="End Semester">
      <AnimatePresence mode="wait">
        {!confirmed ? (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-4"
          >
            {/* Warning icon with pulse */}
            <div className="relative w-20 h-20 mx-auto mb-5">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-red-500/30 rounded-full"
              />
              <div className="absolute inset-0 bg-red-500/20 rounded-full flex items-center justify-center">
                <Archive className="w-9 h-9 text-red-400" />
              </div>
            </div>

            <h3 className="text-white font-bold text-lg mb-2">End This Semester?</h3>
            <p className="text-white/60 text-sm mb-5 leading-relaxed">
              This action will archive attendance records and cannot be undone easily.
            </p>

            {/* Semester Details Preview */}
            <div className="glass rounded-xl p-4 text-left space-y-2 mb-6 border border-red-500/20">
              <p className="text-xs text-red-400 font-semibold uppercase tracking-widest mb-3">Semester Details</p>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Semester</span>
                <span className="text-white font-medium">{setupData.semester || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Department</span>
                <span className="text-white font-medium">{setupData.department || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Total Students</span>
                <span className="text-white font-medium">{students.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Archive Date</span>
                <span className="text-white font-medium">{format(new Date(), "dd MMM yyyy")}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="py-3 glass rounded-xl text-white font-medium border border-white/20 hover:bg-white/10 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setConfirmed(true)}
                className="py-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 font-medium hover:bg-red-500/30 transition-all"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-4"
          >
            {/* Danger warning animation */}
            <motion.div
              animate={{ rotate: [-3, 3, -3, 3, 0] }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/40"
            >
              <CheckCircle className="w-8 h-8 text-red-400" />
            </motion.div>

            <h3 className="text-white font-bold text-lg mb-2">Final Confirmation</h3>
            <p className="text-white/60 text-sm mb-1">Are you sure you want to end this semester?</p>
            <p className="text-red-400/80 text-xs mb-6">
              This action will archive attendance records and cannot be undone easily.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setConfirmed(false)}
                className="py-3 glass rounded-xl text-white font-medium border border-white/20 hover:bg-white/10 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(239,68,68,0.5)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEndSemester}
                className="py-3 bg-red-600 text-white rounded-xl font-semibold shadow-lg shadow-red-500/40 border border-red-400/30 transition-all"
                style={{ boxShadow: "0 0 16px rgba(239,68,68,0.35)" }}
              >
                End Semester
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalWrapper>
  );
}

function EditTimetableModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalWrapper onClose={onClose} title="Edit Timetable">
      <div className="text-center py-6">
        <Clock className="w-16 h-16 text-white/70 mx-auto mb-4" />
        <p className="text-white/70 mb-6">
          Timetable editing feature coming soon. Currently using default schedule.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full py-4 bg-white text-purple-600 rounded-xl font-semibold ripple"
        >
          Got it
        </motion.button>
      </div>
    </ModalWrapper>
  );
}

function ModalWrapper({ children, onClose, title }: any) {
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
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="glass p-2 rounded-xl text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
