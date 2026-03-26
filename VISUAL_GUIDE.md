# Visual Feature Guide

## 🎨 User Interface Overview

### Home Page
```
┌─────────────────────────────────────────────────────────────┐
│  ExamProctor AI                          [Get Started]       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│         AI-Powered Online Examination System                 │
│    Secure, intelligent proctoring for remote exams          │
│                                                               │
│                    [Start Exam]                              │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Video   │  │  Shield  │  │  Chart   │  │  Check   │   │
│  │  Live    │  │    AI    │  │Analytics │  │  Auto    │   │
│  │Monitor   │  │Proctoring│  │Dashboard │  │ Submit   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  How It Works:                                               │
│  1. Login & Start Exam                                       │
│  2. AI Monitoring                                            │
│  3. Suspicion Tracking                                       │
│  4. Admin Analytics                                          │
│                                                               │
│  Demo Credentials:                                           │
│  Student: student@test.com / student123                      │
│  Admin: admin@test.com / admin123                            │
└─────────────────────────────────────────────────────────────┘
```

---

### Login Page
```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                      Welcome Back                            │
│              Sign in to access your exam portal              │
│                                                               │
│  Email Address                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ student@test.com                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  Password                                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ••••••••                                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              🔐 Sign In                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  Demo Accounts:                                              │
│  Student: student@test.com / student123                      │
│  Admin: admin@test.com / admin123                            │
│                                                               │
│                  ← Back to Home                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Student Exam Page
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ExamProctor AI    [Exams]    John Doe [student]  [Logout]              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────────────────────────┐  ┌──────────────────────────┐  │
│  │ Advanced Data Structures           │  │ ┌──────────────────────┐ │  │
│  │                    ⏱ 01:45:30      │  │ │ 🔴 LIVE PROCTORING   │ │  │
│  ├────────────────────────────────────┤  │ │                      │ │  │
│  │                                    │  │ │   [Webcam Feed]      │ │  │
│  │ Question 1 of 50                   │  │ │                      │ │  │
│  │                                    │  │ │                      │ │  │
│  │ Which data structure is most       │  │ └──────────────────────┘ │  │
│  │ optimal for implementing a         │  │ ✓ Face verified          │  │
│  │ priority queue?                    │  │                          │  │
│  │                                    │  │ ┌──────────────────────┐ │  │
│  │ ○ Array                            │  │ │ Monitoring Status    │ │  │
│  │ ○ Linked List                      │  │ ├──────────────────────┤ │  │
│  │ ● Binary Heap                      │  │ │ Suspicion Level      │ │  │
│  │ ○ Binary Search Tree               │  │ │ ████░░░░░░ 35%       │ │  │
│  │                                    │  │ │                      │ │  │
│  │                                    │  │ │ Warnings: 2 / 20     │ │  │
│  ├────────────────────────────────────┤  │ └──────────────────────┘ │  │
│  │ [Previous]          [Save & Next]  │  │                          │  │
│  └────────────────────────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Admin Dashboard - Overview Tab
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ExamProctor AI    [Dashboard]    Admin User [admin]  [Logout]          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Admin Dashboard                                                         │
│  Manage exams and monitor student activity                               │
│                                                                           │
│  [Dashboard] [Manage Exams] [View Sessions]                             │
│                                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ 📄 5     │  │ 👥 3     │  │ 👁 12    │  │ ⚠️ 2     │               │
│  │ Total    │  │ Active   │  │Completed │  │ Auto-    │               │
│  │ Exams    │  │ Sessions │  │ Sessions │  │Submitted │               │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │
│                                                                           │
│  ┌────────────────────────────┐  ┌────────────────────────────┐        │
│  │ Suspicion Trends           │  │ Suspicious Events          │        │
│  │                            │  │                            │        │
│  │     📈 Line Chart          │  │     📊 Bar Chart           │        │
│  │                            │  │                            │        │
│  │  Score                     │  │  Count                     │        │
│  │   100│                     │  │   50│                      │        │
│  │    80│    ╱╲               │  │   40│  █                   │        │
│  │    60│   ╱  ╲              │  │   30│  █  █                │        │
│  │    40│  ╱    ╲╲            │  │   20│  █  █  █             │        │
│  │    20│ ╱      ╲            │  │   10│  █  █  █  █          │        │
│  │     0└──────────────        │  │    0└──────────────        │        │
│  │      Sessions              │  │      Events                │        │
│  └────────────────────────────┘  └────────────────────────────┘        │
│                                                                           │
│  Recent Activity                                                         │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ Advanced Data Structures                                     │       │
│  │ 2025-01-10 14:30 • active                                   │       │
│  │ Suspicion: 45%  Warnings: 5/20                              │       │
│  ├─────────────────────────────────────────────────────────────┤       │
│  │ Algorithm Analysis                                           │       │
│  │ 2025-01-10 13:15 • completed                                │       │
│  │ Suspicion: 15%  Warnings: 0/20                              │       │
│  └─────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Admin Dashboard - Manage Exams Tab
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ExamProctor AI    [Dashboard]    Admin User [admin]  [Logout]          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Exam Management                              [+ Create Exam]           │
│                                                                           │
│  [Dashboard] [Manage Exams] [View Sessions]                             │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ Advanced Data Structures                          [✏️] [🗑️]  │       │
│  │ 5 questions • 60 minutes                                     │       │
│  │ Created: 2025-01-10                                          │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ Algorithm Analysis                                [✏️] [🗑️]  │       │
│  │ 3 questions • 45 minutes                                     │       │
│  │ Created: 2025-01-10                                          │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ Database Systems                                  [✏️] [🗑️]  │       │
│  │ 10 questions • 90 minutes                                    │       │
│  │ Created: 2025-01-09                                          │       │
│  └─────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Create/Edit Exam Modal
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  Create New Exam                                                         │
│                                                                           │
│  Exam Title                                                              │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ Advanced Data Structures                                     │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                           │
│  Duration (minutes)                                                      │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 60                                                           │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                           │
│  Questions                                          [+ Add Question]     │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ Question 1                                            [🗑️]   │       │
│  │ ┌───────────────────────────────────────────────────────┐   │       │
│  │ │ Which data structure is optimal for priority queue?  │   │       │
│  │ └───────────────────────────────────────────────────────┘   │       │
│  │                                                              │       │
│  │ ● Array                                                      │       │
│  │ ○ Linked List                                                │       │
│  │ ○ Binary Heap                                                │       │
│  │ ○ Binary Search Tree                                         │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ Question 2                                            [🗑️]   │       │
│  │ ...                                                          │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                           │
│                                      [Cancel]  [Create Exam]            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Admin Dashboard - View Sessions Tab
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ExamProctor AI    [Dashboard]    Admin User [admin]  [Logout]          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Exam Sessions                                                           │
│                                                                           │
│  [Dashboard] [Manage Exams] [View Sessions]                             │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ Advanced Data Structures                      [active]       │       │
│  │ Session ID: a1b2c3d4                                         │       │
│  │                                                              │       │
│  │ Start Time: 2025-01-10 14:30:00                             │       │
│  │ Suspicion Score: 45%                                         │       │
│  │ Warnings: 5/20                                               │       │
│  │ Events: 12                                                   │       │
│  │                                                              │       │
│  │ ▼ View Activity Log                                          │       │
│  │   ┌────────────────────────────────────────────────────┐    │       │
│  │   │ FACE_NOT_DETECTED          14:32:15  [HIGH]       │    │       │
│  │   │ No face detected in camera                        │    │       │
│  │   ├────────────────────────────────────────────────────┤    │       │
│  │   │ TAB_SWITCH                 14:35:20  [HIGH]       │    │       │
│  │   │ Student switched tabs or minimized window         │    │       │
│  │   ├────────────────────────────────────────────────────┤    │       │
│  │   │ WARNING_ISSUED             14:35:21  [HIGH]       │    │       │
│  │   │ Warning 1/20: Suspicion threshold reached         │    │       │
│  │   └────────────────────────────────────────────────────┘    │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ Algorithm Analysis                        [completed]        │       │
│  │ Session ID: e5f6g7h8                                         │       │
│  │ ...                                                          │       │
│  └─────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Warning States

#### Low Suspicion (< 30%)
```
┌──────────────────────┐
│ Monitoring Status    │
├──────────────────────┤
│ Suspicion Level      │
│ ██░░░░░░░░ 25%       │
│ [GREEN BAR]          │
│                      │
│ Warnings: 0 / 20     │
└──────────────────────┘
```

#### Medium Suspicion (30-79%)
```
┌──────────────────────┐
│ Monitoring Status    │
├──────────────────────┤
│ Suspicion Level      │
│ ██████░░░░ 55%       │
│ [YELLOW/ORANGE BAR]  │
│                      │
│ Warnings: 3 / 20     │
└──────────────────────┘
```

#### High Suspicion (80%+)
```
┌──────────────────────┐
│ Monitoring Status    │
├──────────────────────┤
│ Suspicion Level      │
│ █████████░ 85%       │
│ [RED BAR]            │
│                      │
│ Warnings: 8 / 20     │
│                      │
│ ⚠️ High suspicion    │
│ detected! Warning    │
│ issued.              │
└──────────────────────┘
```

#### Critical Warning (15+ warnings)
```
┌──────────────────────┐
│ Monitoring Status    │
├──────────────────────┤
│ Suspicion Level      │
│ ██████████ 95%       │
│ [RED BAR]            │
│                      │
│ Warnings: 18 / 20    │
│                      │
│ ⚠️ 2 warnings        │
│ remaining            │
│                      │
│ Exam will auto-      │
│ submit at 20         │
│ warnings             │
└──────────────────────┘
```

---

### Auto-Submit Screen
```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                                                               │
│                      ⚠️                                       │
│                                                               │
│              Exam Auto-Submitted                             │
│                                                               │
│    You have exceeded the maximum number of warnings (20).    │
│                                                               │
│         Your exam has been automatically submitted.          │
│                                                               │
│                                                               │
│              Redirecting to home page...                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Scheme

### Primary Colors
- **Blue**: `#2563eb` - Primary actions, links
- **Green**: `#10b981` - Success, verified states
- **Yellow**: `#eab308` - Medium warnings
- **Orange**: `#f97316` - High warnings
- **Red**: `#ef4444` - Critical alerts, errors

### Neutral Colors
- **Slate 50**: `#f8fafc` - Backgrounds
- **Slate 200**: `#e2e8f0` - Borders
- **Slate 600**: `#475569` - Secondary text
- **Slate 800**: `#1e293b` - Primary text

### Status Colors
- **Active**: Green `#10b981`
- **Completed**: Blue `#2563eb`
- **Auto-Submitted**: Red `#ef4444`

---

## 📱 Responsive Design

### Desktop (1920x1080)
- Two-column layout for exam page
- Full dashboard with charts
- All features visible

### Tablet (768x1024)
- Stacked layout for exam page
- Responsive charts
- Collapsible sidebar

### Mobile (375x667)
- Single column
- Simplified navigation
- Touch-optimized controls

---

## 🎯 Key UI Elements

### Buttons
- **Primary**: Blue background, white text
- **Secondary**: White background, gray border
- **Danger**: Red background, white text

### Cards
- White background
- Subtle shadow
- Rounded corners (12px)
- Border: 1px slate-200

### Inputs
- Border: 1px slate-300
- Focus: 2px blue ring
- Rounded: 8px
- Padding: 12px 16px

### Charts
- Responsive
- Animated
- Color-coded
- Interactive tooltips

---

**Visual design complete! 🎨**
