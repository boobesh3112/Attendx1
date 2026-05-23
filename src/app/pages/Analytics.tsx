import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BarChart3, Download, Share2, Calendar as CalendarIcon, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { storage } from "../utils/storage";
import { sounds } from "../utils/sounds";
import { haptics } from "../utils/haptics";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

type FilterType = "today" | "yesterday" | "week" | "month" | "all";

export function Analytics() {
  const [filter, setFilter] = useState<FilterType>("week");
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any>({});

  useEffect(() => {
    const loadedStudents = storage.getStudents();
    setStudents(loadedStudents);

    const allAttendance = storage.getAttendance();
    setAttendanceData(allAttendance);
  }, []);

  const getFilteredDates = () => {
    const today = new Date();
    let dates: Date[] = [];

    switch (filter) {
      case "today":
        dates = [today];
        break;
      case "yesterday":
        dates = [subDays(today, 1)];
        break;
      case "week":
        dates = eachDayOfInterval({
          start: startOfWeek(today),
          end: endOfWeek(today)
        });
        break;
      case "month":
        dates = eachDayOfInterval({
          start: startOfMonth(today),
          end: endOfMonth(today)
        });
        break;
      case "all":
        dates = Object.keys(attendanceData).map(dateStr => new Date(dateStr));
        break;
    }

    return dates.map(d => format(d, "yyyy-MM-dd"));
  };

  const calculateStats = () => {
    const filteredDates = getFilteredDates();
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalOnDuty = 0;
    let totalDays = 0;

    filteredDates.forEach(date => {
      const dayData = attendanceData[date];
      if (dayData && dayData.records) {
        totalDays++;
        dayData.records.forEach((record: any) => {
          if (record.status === "present") totalPresent++;
          else if (record.status === "absent") totalAbsent++;
          else if (record.status === "onduty") totalOnDuty++;
        });
      }
    });

    const totalMarked = totalPresent + totalAbsent + totalOnDuty;
    const avgAttendance = totalMarked > 0 ? Math.round((totalPresent / totalMarked) * 100) : 0;

    return {
      totalPresent,
      totalAbsent,
      totalOnDuty,
      totalDays,
      avgAttendance
    };
  };

  const getChartData = () => {
    const filteredDates = getFilteredDates();
    const seen = new Set();

    const data = filteredDates
      .filter(date => {
        if (seen.has(date)) return false;
        seen.add(date);
        return true;
      })
      .map((date, index) => {
        const dayData = attendanceData[date];
        let present = 0;
        let absent = 0;

        if (dayData && dayData.records) {
          dayData.records.forEach((record: any) => {
            if (record.status === "present") present++;
            else if (record.status === "absent") absent++;
          });
        }

        const uniqueId = `chart-${filter}-${date}-${index}`;
        return {
          name: uniqueId, // Recharts uses 'name' for internal keys
          id: uniqueId,
          date: date,
          displayDate: format(new Date(date), "MMM dd"),
          present,
          absent,
          percentage: present + absent > 0 ? Math.round((present / (present + absent)) * 100) : 0
        };
      });

    return data;
  };

  const getStudentStats = () => {
    const studentStats: any = {};

    students.forEach(student => {
      studentStats[student.id] = {
        name: student.name,
        rollNo: student.rollNo,
        present: 0,
        absent: 0,
        total: 0
      };
    });

    Object.values(attendanceData).forEach((dayData: any) => {
      if (dayData.records) {
        dayData.records.forEach((record: any) => {
          if (studentStats[record.studentId]) {
            studentStats[record.studentId].total++;
            if (record.status === "present") {
              studentStats[record.studentId].present++;
            } else if (record.status === "absent") {
              studentStats[record.studentId].absent++;
            }
          }
        });
      }
    });

    return Object.values(studentStats)
      .map((stat: any) => ({
        ...stat,
        percentage: stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : 0
      }))
      .sort((a: any, b: any) => b.percentage - a.percentage);
  };

  const stats = calculateStats();
  const chartData = getChartData();
  const studentStats = getStudentStats();
  const topPerformers = studentStats.slice(0, 5);
  const lowAttendance = studentStats.filter((s: any) => s.percentage < 75 && s.total > 0);

  const generatePDF = () => {
    const doc = new jsPDF();
    const setupData = JSON.parse(localStorage.getItem("setupData") || "{}");

    // Header
    doc.setFontSize(18);
    doc.text("Attendance Report", 14, 20);

    doc.setFontSize(10);
    doc.text(`${setupData.collegeName || ""}`, 14, 28);
    doc.text(`${setupData.department} - ${setupData.branch}`, 14, 34);
    doc.text(`Semester ${setupData.semester} | ${setupData.year} Year | Section ${setupData.section}`, 14, 40);
    doc.text(`Generated: ${format(new Date(), "PPP")}`, 14, 46);

    // Summary Stats
    doc.setFontSize(14);
    doc.text("Summary Statistics", 14, 58);

    autoTable(doc, {
      startY: 62,
      head: [['Metric', 'Value']],
      body: [
        ['Total Days', stats.totalDays.toString()],
        ['Average Attendance', `${stats.avgAttendance}%`],
        ['Total Present', stats.totalPresent.toString()],
        ['Total Absent', stats.totalAbsent.toString()],
        ['Total On Duty', stats.totalOnDuty.toString()],
      ],
    });

    // Student-wise Report
    doc.setFontSize(14);
    doc.text("Student-wise Attendance", 14, (doc as any).lastAutoTable.finalY + 10);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 14,
      head: [['Roll No', 'Name', 'Present', 'Total', 'Percentage']],
      body: studentStats.map((s: any) => [
        s.rollNo,
        s.name,
        s.present.toString(),
        s.total.toString(),
        `${s.percentage}%`
      ]),
    });

    // Save
    doc.save(`Attendance_Report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
    haptics.success();
    sounds.playSuccess();
    toast.success("PDF report generated!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Attendance Report",
        text: `Average Attendance: ${stats.avgAttendance}%\nTotal Days: ${stats.totalDays}`,
      }).catch(() => {});
    } else {
      toast.info("Share not supported on this browser");
    }
  };

  const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];

  return (
    <div className="min-h-screen p-4 space-y-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-white/70">Attendance insights and reports</p>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={generatePDF}
              className="glass p-3 rounded-xl text-white"
            >
              <Download size={20} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="glass p-3 rounded-xl text-white"
            >
              <Share2 size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {(["today", "yesterday", "week", "month", "all"] as FilterType[]).map((f) => (
          <motion.button
            key={f}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setFilter(f);
              sounds.playClick();
              haptics.light();
            }}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              filter === f ? "bg-white text-purple-600" : "glass text-white"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        <StatCard
          label="Avg Attendance"
          value={`${stats.avgAttendance}%`}
          color={stats.avgAttendance >= 75 ? "text-green-400" : "text-red-400"}
          icon={stats.avgAttendance >= 75 ? TrendingUp : TrendingDown}
        />
        <StatCard
          label="Total Days"
          value={stats.totalDays}
          color="text-blue-400"
          icon={CalendarIcon}
        />
        <StatCard
          label="Present"
          value={stats.totalPresent}
          color="text-green-400"
          icon={BarChart3}
        />
        <StatCard
          label="Absent"
          value={stats.totalAbsent}
          color="text-red-400"
          icon={BarChart3}
        />
      </motion.div>

      {/* Attendance Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-strong rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="name"
              stroke="rgba(255,255,255,0.5)"
              tickFormatter={(value) => {
                const item = chartData.find(d => d.name === value);
                return item?.displayDate || "";
              }}
            />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                color: "white",
              }}
              labelFormatter={(value) => {
                const item = chartData.find(d => d.name === value);
                if (!item) return value;
                try {
                  return format(new Date(item.date), "PPP");
                } catch {
                  return value;
                }
              }}
            />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Daily Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-strong rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Daily Breakdown</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="name"
              stroke="rgba(255,255,255,0.5)"
              tickFormatter={(value) => {
                const item = chartData.find(d => d.name === value);
                return item?.displayDate || "";
              }}
            />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                color: "white",
              }}
              labelFormatter={(value) => {
                const item = chartData.find(d => d.name === value);
                if (!item) return value;
                try {
                  return format(new Date(item.date), "PPP");
                } catch {
                  return value;
                }
              }}
            />
            <Bar dataKey="present" fill="#10b981" radius={[8, 8, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="absent" fill="#ef4444" radius={[8, 8, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-strong rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Top Performers</h3>
          <div className="space-y-3">
            {topPerformers.map((student: any, index: number) => (
              <motion.div
                key={`top-${student.rollNo}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{student.name}</p>
                    <p className="text-white/60 text-sm">{student.rollNo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">{student.percentage}%</p>
                  <p className="text-white/60 text-xs">{student.present}/{student.total}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Low Attendance Alert */}
      {lowAttendance.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-strong rounded-2xl p-6 border-2 border-red-500/30"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Low Attendance Alert
          </h3>
          <div className="space-y-3">
            {lowAttendance.map((student: any, index: number) => (
              <motion.div
                key={`low-${student.rollNo}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl"
              >
                <div>
                  <p className="text-white font-medium">{student.name}</p>
                  <p className="text-white/60 text-sm">{student.rollNo}</p>
                </div>
                <div className="text-right">
                  <p className="text-red-400 font-bold">{student.percentage}%</p>
                  <p className="text-white/60 text-xs">{student.present}/{student.total}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, icon: Icon }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong rounded-2xl p-4"
    >
      <Icon className={`${color} mb-2`} size={20} />
      <p className="text-white/60 text-xs mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </motion.div>
  );
}
