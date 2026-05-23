import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wifi, WifiOff } from "lucide-react";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 ${
            isOnline
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : "bg-gradient-to-r from-red-500 to-orange-500"
          }`}>
            {isOnline ? <Wifi size={20} className="text-white" /> : <WifiOff size={20} className="text-white" />}
            <span className="text-white font-medium">
              {isOnline ? "Back Online" : "You're Offline"}
            </span>
          </div>
        </motion.div>
      )}

      {!isOnline && !showNotification && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-0 left-0 right-0 bg-orange-500 text-white py-2 px-4 text-center text-sm z-[100]"
        >
          <div className="flex items-center justify-center gap-2">
            <WifiOff size={16} />
            <span>Offline Mode - Changes will sync when connected</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
