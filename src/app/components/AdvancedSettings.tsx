import { useState } from "react";
import { motion } from "motion/react";
import { Palette, Zap, Bell, Mic, Database, Trash2, CheckCircle } from "lucide-react";
import { accentColors, AccentColor, AnimationSpeed, themeManager } from "../utils/theme";
import { sounds } from "../utils/sounds";
import { voice } from "../utils/voice";
import { haptics } from "../utils/haptics";
import { toast } from "sonner";

export function AdvancedSettings() {
  const [selectedAccent, setSelectedAccent] = useState<AccentColor>(themeManager.getAccentColor());
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>(themeManager.getAnimationSpeed());
  const [voiceEnabled, setVoiceEnabled] = useState(voice.isEnabled());
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem("notificationsEnabled") !== "false"
  );

  const handleAccentChange = (color: AccentColor) => {
    setSelectedAccent(color);
    themeManager.setAccentColor(color);
    sounds.playClick();
    haptics.light();
    toast.success(`Accent color changed to ${color}`);
  };

  const handleAnimationSpeedChange = (speed: AnimationSpeed) => {
    setAnimationSpeed(speed);
    themeManager.setAnimationSpeed(speed);
    sounds.playClick();
    haptics.light();
    toast.success(`Animation speed set to ${speed}`);
  };

  const handleVoiceToggle = () => {
    const newValue = !voiceEnabled;
    setVoiceEnabled(newValue);
    voice.setEnabled(newValue);
    if (newValue) {
      voice.speak("Voice alerts enabled");
    }
    toast.success(`Voice alerts ${newValue ? "enabled" : "disabled"}`);
  };

  const handleNotificationsToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem("notificationsEnabled", newValue.toString());
    toast.success(`Notifications ${newValue ? "enabled" : "disabled"}`);
  };

  const handleClearCache = () => {
    // Clear non-essential data
    const confirm = window.confirm("Clear cache? This will not delete your students or attendance data.");
    if (confirm) {
      localStorage.removeItem("notifications");
      toast.success("Cache cleared successfully!");
      haptics.success();
      sounds.playSuccess();
    }
  };

  return (
    <div className="space-y-6">
      {/* Accent Color Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Palette className="text-white" size={20} />
          <h3 className="text-lg font-semibold text-white">Accent Color</h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(accentColors) as AccentColor[]).map((color) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAccentChange(color)}
              className={`p-4 rounded-xl relative overflow-hidden ${
                selectedAccent === color ? "ring-2 ring-white" : ""
              }`}
              style={{
                background: `linear-gradient(135deg, ${accentColors[color].primary}, ${accentColors[color].dark})`
              }}
            >
              <div className="flex items-center justify-center">
                {selectedAccent === color && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-white"
                  >
                    <CheckCircle size={24} />
                  </motion.div>
                )}
              </div>
              <p className="text-white text-xs mt-2 capitalize text-center">{color}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Animation Speed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-strong rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Zap className="text-white" size={20} />
          <h3 className="text-lg font-semibold text-white">Animation Speed</h3>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {(["slow", "normal", "fast", "instant"] as AnimationSpeed[]).map((speed) => (
            <motion.button
              key={speed}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnimationSpeedChange(speed)}
              className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                animationSpeed === speed
                  ? "bg-white text-purple-600"
                  : "bg-white/10 text-white"
              }`}
            >
              {speed.charAt(0).toUpperCase() + speed.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Voice Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-strong rounded-2xl p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Mic className="text-white" size={20} />
          <div>
            <p className="text-white font-medium">Voice Alerts</p>
            <p className="text-white/60 text-xs">Spoken notifications and reminders</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleVoiceToggle}
          className={`w-14 h-8 rounded-full transition-all ${
            voiceEnabled ? "bg-green-500" : "bg-white/20"
          }`}
        >
          <motion.div
            animate={{ x: voiceEnabled ? 24 : 2 }}
            className="w-6 h-6 bg-white rounded-full mt-1"
          />
        </motion.button>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-strong rounded-2xl p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Bell className="text-white" size={20} />
          <div>
            <p className="text-white font-medium">Smart Notifications</p>
            <p className="text-white/60 text-xs">Automated reminders and alerts</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleNotificationsToggle}
          className={`w-14 h-8 rounded-full transition-all ${
            notificationsEnabled ? "bg-green-500" : "bg-white/20"
          }`}
        >
          <motion.div
            animate={{ x: notificationsEnabled ? 24 : 2 }}
            className="w-6 h-6 bg-white rounded-full mt-1"
          />
        </motion.button>
      </motion.div>

      {/* Clear Cache */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClearCache}
          className="w-full glass-strong rounded-2xl p-4 flex items-center justify-center gap-3 text-orange-400 hover:bg-orange-500/20"
        >
          <Trash2 size={20} />
          <span className="font-medium">Clear Cache</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
