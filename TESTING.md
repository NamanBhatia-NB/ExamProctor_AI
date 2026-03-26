# Testing Guide

Complete guide for testing all features of the Online Examination System.

## 🧪 Test Scenarios

### 1. Authentication Testing

#### Test Case 1.1: Student Login
**Steps:**
1. Navigate to http://localhost:3000
2. Click "Get Started" or "Login"
3. Enter credentials:
   - Email: `student@test.com`
   - Password: `student123`
4. Click "Sign In"

**Expected Result:**
- Redirected to `/exam` page
- Navbar shows user name and role badge
- Exam interface is visible

#### Test Case 1.2: Admin Login
**Steps:**
1. Navigate to http://localhost:3000/login
2. Enter credentials:
   - Email: `admin@test.com`
   - Password: `admin123`
3. Click "Sign In"

**Expected Result:**
- Redirected to `/admin` page
- Dashboard with analytics visible
- Three tabs: Dashboard, Manage Exams, View Sessions

#### Test Case 1.3: Invalid Login
**Steps:**
1. Navigate to login page
2. Enter invalid credentials
3. Click "Sign In"

**Expected Result:**
- Error message: "Invalid email or password"
- User remains on login page

#### Test Case 1.4: Logout
**Steps:**
1. Login as any user
2. Click "Logout" in navbar

**Expected Result:**
- Redirected to login page
- User data cleared from storage

---

### 2. Exam Taking (Student)

#### Test Case 2.1: Start Exam
**Steps:**
1. Login as student
2. Grant camera permissions when prompted

**Expected Result:**
- Exam interface loads
- Timer starts counting down
- Webcam feed visible in right panel
- "LIVE PROCTORING" indicator shows
- First question displayed

#### Test Case 2.2: Answer Questions
**Steps:**
1. Start exam
2. Select an answer option
3. Click "Save & Next"

**Expected Result:**
- Answer is saved
- Next question loads
- Previous answer persists if you go back

#### Test Case 2.3: Navigate Questions
**Steps:**
1. Answer first question
2. Click "Save & Next"
3. Click "Previous"

**Expected Result:**
- Returns to previous question
- Previously selected answer is still selected

#### Test Case 2.4: Submit Exam
**Steps:**
1. Navigate to last question
2. Click "Submit Exam"
3. Confirm submission

**Expected Result:**
- Confirmation dialog appears
- After confirmation, success message
- Redirected to home page

---

### 3. AI Proctoring Testing

#### Test Case 3.1: Normal Face Detection
**Steps:**
1. Start exam
2. Sit normally in front of camera
3. Wait for 4-5 seconds

**Expected Result:**
- Webcam shows "✓ Face verified"
- Suspicion score remains low (< 30%)
- No warnings issued

#### Test Case 3.2: No Face Detection
**Steps:**
1. Start exam
2. Cover camera or move away
3. Wait for 4-5 seconds

**Expected Result:**
- Webcam shows "⚠️ No face detected"
- Suspicion score increases significantly
- Warning issued if score reaches 80%
- Event logged in activity

#### Test Case 3.3: Multiple Faces Detection
**Steps:**
1. Start exam
2. Have another person appear in camera
3. Wait for 4-5 seconds

**Expected Result:**
- Webcam shows "⚠️ 2 faces detected"
- Suspicion score increases to critical level
- Warning issued
- Event logged as "MULTIPLE_FACES"

#### Test Case 3.4: Warning System
**Steps:**
1. Start exam
2. Trigger high suspicion (cover camera)
3. Repeat until suspicion reaches 80%

**Expected Result:**
- Warning counter increments
- Red alert box appears
- Shows "X/20" warnings
- Event logged as "WARNING_ISSUED"

#### Test Case 3.5: Auto-Submit
**Steps:**
1. Start exam
2. Accumulate 20 warnings by repeatedly:
   - Covering camera
   - Switching tabs
   - Moving away from camera

**Expected Result:**
- At 20th warning, exam auto-submits
- Red screen appears: "Exam Auto-Submitted"
- Message: "You have exceeded the maximum number of warnings"
- Redirected to home after 3 seconds
- Session status marked as "auto-submitted"

---

### 4. Browser Monitoring

#### Test Case 4.1: Tab Switch Detection
**Steps:**
1. Start exam
2. Press Alt+Tab or click another tab
3. Return to exam tab

**Expected Result:**
- Event logged: "TAB_SWITCH"
- Suspicion score increases by ~15%
- Activity log shows the event

#### Test Case 4.2: Window Blur Detection
**Steps:**
1. Start exam
2. Click outside browser window
3. Click back on browser

**Expected Result:**
- Event logged: "WINDOW_BLUR"
- Suspicion score increases by ~10%
- Activity log shows the event

---

### 5. Admin Dashboard Testing

#### Test Case 5.1: View Analytics
**Steps:**
1. Login as admin
2. View Dashboard tab

**Expected Result:**
- Four stat cards showing:
  - Total Exams
  - Active Sessions
  - Completed Sessions
  - Auto-Submitted Sessions
- Suspicion Trends chart
- Suspicious Events chart
- Recent Activity list

#### Test Case 5.2: Create Exam
**Steps:**
1. Login as admin
2. Click "Manage Exams" tab
3. Click "Create Exam"
4. Fill in:
   - Title: "Test Exam"
   - Duration: 30
   - Add 3 questions with options
   - Select correct answers
5. Click "Create Exam"

**Expected Result:**
- Modal closes
- New exam appears in list
- Exam has correct details
- Students can now take this exam

#### Test Case 5.3: Edit Exam
**Steps:**
1. Login as admin
2. Go to "Manage Exams"
3. Click edit icon on an exam
4. Modify title or questions
5. Click "Update Exam"

**Expected Result:**
- Changes are saved
- Updated exam shows new details

#### Test Case 5.4: Delete Exam
**Steps:**
1. Login as admin
2. Go to "Manage Exams"
3. Click delete icon
4. Confirm deletion

**Expected Result:**
- Confirmation dialog appears
- Exam is removed from list
- No longer available to students

#### Test Case 5.5: View Sessions
**Steps:**
1. Login as admin
2. Click "View Sessions" tab

**Expected Result:**
- List of all exam sessions
- Each session shows:
  - Exam title
  - Status badge
  - Start time
  - Suspicion score
  - Warning count
  - Event count

#### Test Case 5.6: View Activity Log
**Steps:**
1. Login as admin
2. Go to "View Sessions"
3. Click "View Activity Log" on a session

**Expected Result:**
- Expandable section opens
- Shows all events with:
  - Event type
  - Timestamp
  - Severity color
  - Details

---

### 6. Data Persistence Testing

#### Test Case 6.1: Session Persistence
**Steps:**
1. Login as student
2. Start exam
3. Answer 2 questions
4. Refresh page
5. Login again

**Expected Result:**
- Previous session continues
- Answers are preserved
- Suspicion score maintained
- Timer continues from where it left off

#### Test Case 6.2: Exam Creation Persistence
**Steps:**
1. Login as admin
2. Create new exam
3. Logout
4. Login again

**Expected Result:**
- Created exam still exists
- All questions preserved
- Available to students

---

### 7. Edge Cases

#### Test Case 7.1: Camera Permission Denied
**Steps:**
1. Login as student
2. Deny camera permissions

**Expected Result:**
- Red error overlay on webcam
- Message: "Camera access denied"
- Exam can still be taken (but will log violations)

#### Test Case 7.2: AI Service Offline
**Steps:**
1. Stop AI service (close terminal)
2. Start exam as student

**Expected Result:**
- System falls back to mock data
- Face detection returns default "1 face"
- Exam continues normally
- Console shows "AI Service Error"

#### Test Case 7.3: Rapid Tab Switching
**Steps:**
1. Start exam
2. Rapidly switch tabs 10 times

**Expected Result:**
- Each switch logged
- Suspicion accumulates
- Warnings issued appropriately
- Auto-submit at 20 warnings

#### Test Case 7.4: Timer Expiry
**Steps:**
1. Create exam with 1 minute duration
2. Start exam
3. Wait for timer to reach 0

**Expected Result:**
- Exam auto-submits
- Status marked as "completed"
- Redirected to home

---

## 🔍 Manual Testing Checklist

### Pre-Testing Setup
- [ ] AI service running on port 8000
- [ ] Frontend running on port 3000
- [ ] Browser cache cleared
- [ ] Camera permissions granted

### Authentication
- [ ] Student login works
- [ ] Admin login works
- [ ] Invalid credentials rejected
- [ ] Logout works
- [ ] Session persists on refresh

### Student Features
- [ ] Exam loads correctly
- [ ] Webcam initializes
- [ ] Questions display properly
- [ ] Answer selection works
- [ ] Navigation (next/previous) works
- [ ] Timer counts down
- [ ] Submit exam works

### AI Proctoring
- [ ] Face detection works (1 face)
- [ ] No face detection works
- [ ] Multiple faces detection works
- [ ] Suspicion score updates
- [ ] Warnings issued at 80%
- [ ] Auto-submit at 20 warnings

### Browser Monitoring
- [ ] Tab switch detected
- [ ] Window blur detected
- [ ] Events logged correctly

### Admin Features
- [ ] Dashboard loads
- [ ] Analytics display correctly
- [ ] Charts render
- [ ] Create exam works
- [ ] Edit exam works
- [ ] Delete exam works
- [ ] View sessions works
- [ ] Activity logs display

### Data Persistence
- [ ] User data persists
- [ ] Exam data persists
- [ ] Session data persists
- [ ] Answers persist on refresh

---

## 🐛 Known Issues & Limitations

### Current Limitations
1. **LocalStorage Limit**: ~5-10MB depending on browser
2. **Camera Support**: May not work in Safari
3. **AI Service**: Requires manual start
4. **Single Exam**: Students see only first exam
5. **No Grading**: Correct answers stored but not evaluated

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ⚠️ Safari (camera issues)
- ❌ IE (not supported)

---

## 📊 Performance Testing

### Load Testing Scenarios

#### Scenario 1: Multiple Students
**Setup:**
- Open 5 browser tabs
- Login as different students (create more accounts)
- Start exams simultaneously

**Expected:**
- All exams run smoothly
- No performance degradation
- AI service handles requests

#### Scenario 2: Large Exam
**Setup:**
- Create exam with 50 questions
- Take exam as student

**Expected:**
- Navigation remains smooth
- LocalStorage handles data
- No lag in UI

#### Scenario 3: Long Session
**Setup:**
- Start exam
- Keep running for 60+ minutes

**Expected:**
- Timer accurate
- Webcam continues working
- No memory leaks

---

## 🔧 Debugging Tips

### Issue: Camera Not Working
```javascript
// Open browser console (F12)
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => console.log('Camera OK'))
  .catch(err => console.error('Camera Error:', err));
```

### Issue: AI Service Not Responding
```bash
# Check if service is running
curl http://localhost:8000/health

# Should return: {"status": "AI Service Running"}
```

### Issue: Data Not Persisting
```javascript
// Check LocalStorage
console.log(localStorage.getItem('exam_users'));
console.log(localStorage.getItem('exam_exams'));
console.log(localStorage.getItem('exam_sessions'));
```

### Issue: High Suspicion Without Reason
```javascript
// Check event log
const sessions = JSON.parse(localStorage.getItem('exam_sessions'));
console.log(sessions[0].events);
```

---

## 📝 Test Report Template

```
Test Date: ___________
Tester: ___________
Browser: ___________
OS: ___________

Test Results:
✅ Authentication: PASS/FAIL
✅ Exam Taking: PASS/FAIL
✅ AI Proctoring: PASS/FAIL
✅ Browser Monitoring: PASS/FAIL
✅ Admin Dashboard: PASS/FAIL
✅ Data Persistence: PASS/FAIL

Issues Found:
1. ___________
2. ___________

Notes:
___________
```

---

**Happy Testing! 🎉**
