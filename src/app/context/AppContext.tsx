import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { storage } from "../utils/storage";

interface AppContextType {
  user: any;
  setupData: any;
  students: any[];
  refreshStudents: () => void;
  refreshUser: () => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [setupData, setSetupData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = () => {
    setIsLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "null");
      const setup = JSON.parse(localStorage.getItem("setupData") || "null");
      const studentData = storage.getStudents();

      setUser(userData);
      setSetupData(setup);
      setStudents(studentData);
    } catch (error) {
      console.error("Error loading app data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshStudents = () => {
    setStudents(storage.getStudents());
  };

  const refreshUser = () => {
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    const setup = JSON.parse(localStorage.getItem("setupData") || "null");
    setUser(userData);
    setSetupData(setup);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setupData,
        students,
        refreshStudents,
        refreshUser,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
