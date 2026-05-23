# ClassRep Attendance Manager

A premium web application for class representatives to manage attendance, students, and generate analytics reports.

## Features

### 🎯 Authentication & Onboarding
- **Animated Splash Screen** - Premium intro with smooth animations
- **Secure Sign Up** - Password strength meter, live validation, visual feedback
- **Multi-Method Login**:
  - Password authentication
  - 4-digit PIN login
  - Fingerprint placeholder (web limitation)
- **Initial Setup Wizard** - College details, timetable configuration

### 📝 Mark Attendance
- **Quick Actions**: Mark all present/absent with one tap
- **Individual Status Options**: Present, Absent, On Duty, Leave, Other
- **Lock/Unlock System**: Save and lock attendance (fingerprint verification simulated)
- **Live Statistics**: Real-time attendance counts and percentages
- **WhatsApp Integration**: 
  - Auto-reminder during break hours
  - Generate formatted absence reports
  - Send to class tutor via WhatsApp/WhatsApp Business
- **Smart Features**:
  - Haptic feedback on interactions
  - Sound effects (toggleable)
  - Ripple animations
  - Status-based color coding

### 📊 Analytics & Reports
- **Multiple Time Filters**: Today, Yesterday, This Week, This Month, All Time
- **Visual Charts**:
  - Attendance trend line chart
  - Daily breakdown bar chart
  - Weekly overview
- **Smart Insights**:
  - Perfect attendance tracking
  - Attendance streaks
  - Low attendance alerts
  - Class average calculations
  - Trend predictions
- **Top Performers List** - Ranked by attendance percentage
- **PDF Reports**:
  - Generate comprehensive reports
  - Include charts and statistics
  - Student-wise breakdown
  - Download and share functionality

### 👥 Student Management
- **Complete CRUD Operations**:
  - Add students with detailed info
  - View student profiles
  - Edit student details
  - Delete with fingerprint verification (simulated)
- **Student Details**:
  - Name, Roll No, Registration No
  - Phone, Email
  - Hosteller/Day Scholar status
  - Photo placeholder
- **Student Profile View**:
  - Individual attendance percentage
  - QR code with student data
  - Quick actions: Call, Email, WhatsApp
- **Search & Filter**: Real-time search, sort by name/roll number
- **Beautiful Empty States**

### ⚙️ Profile & Settings
- **User Profile**: View and edit class rep details
- **Security**:
  - Change password
  - Change PIN
  - Encrypted local storage
- **Appearance**:
  - Dark/Light theme toggle
  - Sound effects toggle
  - Haptic feedback toggle
- **Data Management**:
  - Backup data (download JSON)
  - Restore from backup
  - End semester (archive & reset)
  - Edit timetable
- **Session Management**: Secure logout

### 🎨 Premium UI/UX
- **Glassmorphism Design** - Modern frosted glass effects
- **Smooth Animations**:
  - Page transitions
  - Card animations
  - Skeleton loaders
  - Floating elements
  - Ripple effects
- **Gradient Backgrounds** - Dynamic animated gradients
- **Interactive Feedback**:
  - Haptic vibrations
  - Sound effects
  - Toast notifications
  - Visual state changes
- **Responsive Design** - Mobile-first, works on all screen sizes
- **Accessibility**: Proper contrast, readable fonts, clear CTAs

### 🚀 Technical Features
- **Offline First**: All data stored locally
- **No Backend Required**: Pure frontend application
- **Demo Data**: Auto-populated with sample students and attendance
- **Data Persistence**: LocalStorage with encryption simulation
- **Performance**:
  - Fast loading
  - Optimized animations (144fps capable)
  - Lazy loading
  - Efficient re-renders

## Technology Stack

- **Framework**: React 18.3 with TypeScript
- **Styling**: Tailwind CSS v4 + Custom Glassmorphism
- **Animations**: Framer Motion (motion/react)
- **Routing**: React Router v7
- **Charts**: Recharts
- **QR Codes**: qrcode.react
- **PDF Generation**: jsPDF + jspdf-autotable
- **Date Handling**: date-fns
- **Notifications**: Sonner
- **Theme**: next-themes

## Quick Start

1. **Sign Up**: Create an account with a strong password
2. **Initial Setup**: Fill in college and class details
3. **Add Students**: Navigate to Students page and add your classmates
4. **Mark Attendance**: Go to Mark page and start tracking attendance
5. **View Analytics**: Check insights and generate reports

## Default Timetable

- Period 1: 8:40 AM – 9:30 AM
- Period 2: 9:30 AM – 10:20 AM
- **Break**: 10:20 AM – 10:40 AM
- Period 3: 10:40 AM – 11:30 AM
- Period 4: 11:30 AM – 12:20 PM
- **Lunch**: 12:20 PM – 1:25 PM
- Period 5: 1:25 PM – 2:10 PM
- Period 6: 2:10 PM – 2:55 PM
- **Break**: 2:55 PM – 3:10 PM
- Period 7: 3:10 PM – 3:55 PM
- Period 8: 3:55 PM – 4:40 PM

## Features Demo

### Pre-loaded Demo Data
The app comes with:
- 8 sample students
- 7 days of attendance history
- Realistic attendance patterns
- Generated insights and analytics

### Smart Insights Examples
- 🏆 Perfect attendance tracking
- 🔥 Attendance streak notifications
- ⚠️ Low attendance warnings
- 📊 Class average performance
- 📈 Trending analysis

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Fingerprint auth not available (web limitation)
- ⚠️ Haptics require HTTPS in production

## Future Enhancements

- Backend integration with Supabase
- Real fingerprint authentication
- Cloud sync
- Multi-class management
- Faculty dashboard
- Parent notifications
- Attendance reminder system
- Advanced analytics with ML predictions
- Export to Excel
- Bulk student import

## Notes

- All data is stored locally in your browser
- Clearing browser data will delete all attendance records
- Use the backup feature regularly to prevent data loss
- For best experience, use on mobile in portrait mode or desktop

---

Built with ❤️ for Class Representatives
