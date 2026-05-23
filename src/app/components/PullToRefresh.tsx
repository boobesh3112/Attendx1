import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { RefreshCw } from "lucide-react";
import { haptics } from "../utils/haptics";
import { sounds } from "../utils/sounds";

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
  threshold?: number;
}

export function PullToRefresh({ onRefresh, children, threshold = 80 }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const pullDistance = useMotionValue(0);

  const rotation = useTransform(pullDistance, [0, threshold], [0, 360]);
  const opacity = useTransform(pullDistance, [0, threshold], [0, 1]);

  const handleTouchStart = (e: TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);

    if (distance > 0) {
      e.preventDefault();
      pullDistance.set(Math.min(distance, threshold * 1.5));

      if (distance > threshold) {
        haptics.light();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;

    setIsPulling(false);

    if (pullDistance.get() >= threshold) {
      setIsRefreshing(true);
      haptics.success();
      sounds.playSuccess();

      try {
        await onRefresh();
      } catch (error) {
        console.error("Refresh error:", error);
      } finally {
        setIsRefreshing(false);
        pullDistance.set(0);
      }
    } else {
      pullDistance.set(0);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isPulling, isRefreshing]);

  return (
    <div ref={containerRef} className="relative overflow-auto h-full">
      <motion.div
        style={{
          opacity,
          y: pullDistance,
        }}
        className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 z-10"
      >
        <motion.div
          style={{ rotate: rotation }}
          className={`w-10 h-10 rounded-full ${
            isRefreshing ? "bg-green-500" : "bg-white/20"
          } flex items-center justify-center`}
        >
          <RefreshCw className="text-white" size={20} />
        </motion.div>
      </motion.div>

      <motion.div style={{ y: pullDistance }}>{children}</motion.div>
    </div>
  );
}
