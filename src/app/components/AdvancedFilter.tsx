import { motion, AnimatePresence } from "motion/react";
import { X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface FilterOptions {
  attendanceRange?: { min: number; max: number };
  hostelStatus?: "all" | "hosteller" | "dayscholar";
  sortBy?: "name" | "rollNo" | "attendance";
  sortOrder?: "asc" | "desc";
}

interface AdvancedFilterProps {
  show: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export function AdvancedFilter({ show, onClose, onApply, currentFilters }: AdvancedFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      hostelStatus: "all",
      sortBy: "rollNo",
      sortOrder: "asc"
    };
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
        >
          <motion.div
            initial={{ y: "100%", scale: 0.9 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: "100%", scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-t-3xl md:rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="text-white" size={24} />
                <h2 className="text-2xl font-bold text-white">Filter Students</h2>
              </div>
              <button
                onClick={onClose}
                className="glass p-2 rounded-xl text-white hover:bg-white/20"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Attendance Range */}
              <div>
                <label className="block text-white/90 mb-3 font-medium">Attendance Range</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">
                      {filters.attendanceRange?.min || 0}% - {filters.attendanceRange?.max || 100}%
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.attendanceRange?.min || 0}
                      onChange={(e) => setFilters({
                        ...filters,
                        attendanceRange: {
                          min: parseInt(e.target.value),
                          max: filters.attendanceRange?.max || 100
                        }
                      })}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.attendanceRange?.max || 100}
                      onChange={(e) => setFilters({
                        ...filters,
                        attendanceRange: {
                          min: filters.attendanceRange?.min || 0,
                          max: parseInt(e.target.value)
                        }
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Hostel Status */}
              <div>
                <label className="block text-white/90 mb-3 font-medium">Hostel Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {["all", "hosteller", "dayscholar"].map((status) => (
                    <motion.button
                      key={status}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilters({ ...filters, hostelStatus: status as any })}
                      className={`py-3 rounded-xl text-sm font-medium transition-all ${
                        filters.hostelStatus === status
                          ? "bg-white text-purple-600"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {status === "all" ? "All" : status === "hosteller" ? "Hosteller" : "Day Scholar"}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-white/90 mb-3 font-medium">Sort By</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "name", label: "Name" },
                    { value: "rollNo", label: "Roll No" },
                    { value: "attendance", label: "Attendance" }
                  ].map((sort) => (
                    <motion.button
                      key={sort.value}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilters({ ...filters, sortBy: sort.value as any })}
                      className={`py-3 rounded-xl text-sm font-medium transition-all ${
                        filters.sortBy === sort.value
                          ? "bg-white text-purple-600"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {sort.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-white/90 mb-3 font-medium">Sort Order</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "asc", label: "Ascending" },
                    { value: "desc", label: "Descending" }
                  ].map((order) => (
                    <motion.button
                      key={order.value}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilters({ ...filters, sortOrder: order.value as any })}
                      className={`py-3 rounded-xl text-sm font-medium transition-all ${
                        filters.sortOrder === order.value
                          ? "bg-white text-purple-600"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {order.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="flex-1 py-4 glass text-white rounded-xl font-semibold"
                >
                  Reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  className="flex-1 py-4 bg-white text-purple-600 rounded-xl font-semibold"
                >
                  Apply Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
