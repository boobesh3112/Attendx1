import { motion } from "motion/react";

export function SkeletonCard({ count = 1 }: { count?: number }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="glass-strong rounded-2xl p-4 overflow-hidden relative"
        >
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-white/10 h-12 w-12" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-3 bg-white/10 rounded" />
                <div className="h-3 bg-white/10 rounded w-5/6" />
              </div>
            </div>
          </div>

          {/* Shimmer effect */}
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          />
        </motion.div>
      ))}
    </>
  );
}

export function SkeletonStat() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong rounded-2xl p-4 relative overflow-hidden"
    >
      <div className="animate-pulse space-y-3">
        <div className="h-5 w-5 bg-white/10 rounded" />
        <div className="h-3 bg-white/10 rounded w-16" />
        <div className="h-6 bg-white/10 rounded w-12" />
      </div>

      <motion.div
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
      />
    </motion.div>
  );
}
