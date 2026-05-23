// Seed data for demonstration purposes
export const seedDemoData = () => {
  const hasData = localStorage.getItem("students");
  if (hasData && JSON.parse(hasData).length > 0) {
    return; // Don't seed if data already exists
  }

  // Seed students
  const demoStudents = [
    {
      id: "1",
      name: "Rahul Kumar",
      rollNo: "101",
      regNo: "REG2024001",
      phone: "9876543210",
      email: "rahul@example.com",
      hostelStatus: "Day Scholar"
    },
    {
      id: "2",
      name: "Priya Sharma",
      rollNo: "102",
      regNo: "REG2024002",
      phone: "9876543211",
      email: "priya@example.com",
      hostelStatus: "Hosteller"
    },
    {
      id: "3",
      name: "Amit Patel",
      rollNo: "103",
      regNo: "REG2024003",
      phone: "9876543212",
      email: "amit@example.com",
      hostelStatus: "Day Scholar"
    },
    {
      id: "4",
      name: "Sneha Reddy",
      rollNo: "104",
      regNo: "REG2024004",
      phone: "9876543213",
      email: "sneha@example.com",
      hostelStatus: "Hosteller"
    },
    {
      id: "5",
      name: "Vikram Singh",
      rollNo: "105",
      regNo: "REG2024005",
      phone: "9876543214",
      email: "vikram@example.com",
      hostelStatus: "Day Scholar"
    },
    {
      id: "6",
      name: "Ananya Das",
      rollNo: "106",
      regNo: "REG2024006",
      phone: "9876543215",
      email: "ananya@example.com",
      hostelStatus: "Hosteller"
    },
    {
      id: "7",
      name: "Karthik Menon",
      rollNo: "107",
      regNo: "REG2024007",
      phone: "9876543216",
      email: "karthik@example.com",
      hostelStatus: "Day Scholar"
    },
    {
      id: "8",
      name: "Divya Nair",
      rollNo: "108",
      regNo: "REG2024008",
      phone: "9876543217",
      email: "divya@example.com",
      hostelStatus: "Hosteller"
    },
  ];

  localStorage.setItem("students", JSON.stringify(demoStudents));

  // Seed some attendance records for the past week
  const today = new Date();
  const attendanceRecords: any = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const records = demoStudents.map(student => ({
      studentId: student.id,
      status: Math.random() > 0.15 ? "present" : Math.random() > 0.5 ? "absent" : "onduty"
    }));

    attendanceRecords[dateStr] = {
      records,
      locked: true,
      savedAt: new Date().toISOString()
    };
  }

  localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));
};
