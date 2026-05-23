import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const quotes = [
  "Attendance today determines success tomorrow.",
  "Every student counts. Every day matters.",
  "Excellence is not an accident, it's a habit.",
  "Track progress, inspire success.",
  "Small steps lead to big achievements.",
  "Consistency is the key to excellence.",
  "Your dedication shapes their future.",
  "Every mark makes a difference.",
  "Building futures, one attendance at a time.",
  "Great results begin with great attendance.",
];

export function DailyQuote() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Get quote based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setQuote(quotes[dayOfYear % quotes.length]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 flex items-start gap-3">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <Sparkles className="text-yellow-400" size={24} />
        </motion.div>

        <div className="flex-1">
          <p className="text-white/90 italic text-sm leading-relaxed">
            "{quote}"
          </p>
          <p className="text-white/50 text-xs mt-2">Daily Inspiration</p>
        </div>
      </div>
    </motion.div>
  );
}
