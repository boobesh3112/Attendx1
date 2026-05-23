import { Outlet, useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { Home, CheckSquare, BarChart3, Users, User, Calendar } from "lucide-react";

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/app", icon: Home, label: "Home" },
    { path: "/app/mark", icon: CheckSquare, label: "Mark" },
    { path: "/app/timetable", icon: Calendar, label: "Timetable" },
    { path: "/app/students", icon: Users, label: "Students" },
    { path: "/app/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path: string) => {
    if (path === "/app") {
      return location.pathname === "/app";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 glass-strong border-t border-white/10 px-2 py-3 z-50"
      >
        <div className="max-w-lg mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  active ? "text-white" : "text-white/50"
                }`}
              >
                <motion.div
                  animate={{
                    scale: active ? 1.1 : 1,
                  }}
                  className={`p-2 rounded-xl ${active ? "bg-white/20" : ""}`}
                >
                  <Icon size={20} />
                </motion.div>
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
}
