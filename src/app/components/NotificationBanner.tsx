import { motion, AnimatePresence } from "motion/react";
import { X, Bell, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

type NotificationType = "info" | "warning" | "success" | "alert";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

interface NotificationBannerProps {
  notification: Notification;
  onClose: () => void;
}

export function NotificationBanner({ notification, onClose }: NotificationBannerProps) {
  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(onClose, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration, onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case "info":
        return <Info size={20} />;
      case "warning":
        return <AlertTriangle size={20} />;
      case "success":
        return <CheckCircle size={20} />;
      case "alert":
        return <Bell size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getColor = () => {
    switch (notification.type) {
      case "info":
        return "from-blue-500 to-blue-600";
      case "warning":
        return "from-yellow-500 to-orange-600";
      case "success":
        return "from-green-500 to-emerald-600";
      case "alert":
        return "from-red-500 to-pink-600";
      default:
        return "from-blue-500 to-blue-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`fixed top-4 left-4 right-4 z-50 max-w-md mx-auto`}
    >
      <div className={`bg-gradient-to-r ${getColor()} rounded-2xl p-4 shadow-2xl`}>
        <div className="flex items-start gap-3">
          <div className="text-white mt-0.5">{getIcon()}</div>
          <div className="flex-1">
            <h4 className="text-white font-semibold mb-1">{notification.title}</h4>
            <p className="text-white/90 text-sm">{notification.message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface NotificationManagerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function NotificationManager({ notifications, onDismiss }: NotificationManagerProps) {
  return (
    <AnimatePresence>
      {notifications.map((notification, index) => (
        <motion.div
          key={notification.id}
          initial={{ y: -50 * (index + 1) }}
          animate={{ y: 0 }}
          style={{ top: `${index * 80}px` }}
        >
          <NotificationBanner
            notification={notification}
            onClose={() => onDismiss(notification.id)}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
