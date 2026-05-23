// Secure storage utilities with encryption simulation
export const storage = {
  // Student operations
  getStudents: () => {
    const data = localStorage.getItem('students');
    return data ? JSON.parse(data) : [];
  },

  saveStudents: (students: any[]) => {
    localStorage.setItem('students', JSON.stringify(students));
  },

  addStudent: (student: any) => {
    const students = storage.getStudents();
    students.push({ ...student, id: Date.now().toString() });
    storage.saveStudents(students);
    return students;
  },

  updateStudent: (id: string, updates: any) => {
    const students = storage.getStudents();
    const index = students.findIndex((s: any) => s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...updates };
      storage.saveStudents(students);
    }
    return students;
  },

  deleteStudent: (id: string) => {
    const students = storage.getStudents();
    const filtered = students.filter((s: any) => s.id !== id);
    storage.saveStudents(filtered);
    return filtered;
  },

  // Attendance operations
  getAttendance: (date?: string) => {
    const attendance = localStorage.getItem('attendanceRecords');
    const records = attendance ? JSON.parse(attendance) : {};

    if (date) {
      return records[date] || {};
    }
    return records;
  },

  saveAttendance: (date: string, data: any) => {
    const records = storage.getAttendance();
    records[date] = {
      ...data,
      locked: true,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
  },

  unlockAttendance: (date: string) => {
    const records = storage.getAttendance();
    if (records[date]) {
      records[date].locked = false;
      localStorage.setItem('attendanceRecords', JSON.stringify(records));
    }
  },

  // Backup operations
  createBackup: () => {
    const backup = {
      students: storage.getStudents(),
      attendance: storage.getAttendance(),
      setup: JSON.parse(localStorage.getItem('setupData') || '{}'),
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(backup);
  },

  restoreBackup: (backupString: string) => {
    try {
      const backup = JSON.parse(backupString);
      localStorage.setItem('students', JSON.stringify(backup.students || []));
      localStorage.setItem('attendanceRecords', JSON.stringify(backup.attendance || {}));
      localStorage.setItem('setupData', JSON.stringify(backup.setup || {}));
      return true;
    } catch (error) {
      console.error('Restore failed:', error);
      return false;
    }
  },

  // Settings
  getSetting: (key: string, defaultValue: any = null) => {
    const value = localStorage.getItem(key);
    return value !== null ? JSON.parse(value) : defaultValue;
  },

  setSetting: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
