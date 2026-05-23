import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { NetworkStatus } from "./components/NetworkStatus";
import { seedDemoData } from "./utils/seedData";
import { themeManager } from "./utils/theme";
import { notificationManager } from "./utils/notifications";

export default function App() {
  useEffect(() => {
    // Seed demo data on first load
    seedDemoData();

    // Apply saved accent color
    const accentColor = themeManager.getAccentColor();
    themeManager.applyAccentColor(accentColor);

    // Initialize notification manager
    notificationManager.checkScheduledNotifications();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <NetworkStatus />
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  );
}