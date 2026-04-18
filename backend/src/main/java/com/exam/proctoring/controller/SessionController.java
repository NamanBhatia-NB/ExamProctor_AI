package com.exam.proctoring.controller;

import com.exam.proctoring.entity.ExamEvent;
import com.exam.proctoring.entity.ExamSession;
import com.exam.proctoring.entity.StudentAnswer;
import com.exam.proctoring.entity.User;
import com.exam.proctoring.repository.ExamSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SessionController {

    @Autowired
    private ExamSessionRepository sessionRepository;
    @Autowired
    private com.exam.proctoring.repository.UserRepository userRepository;


    // 1. Get all sessions (For Admin Dashboard)
    @GetMapping
    public List<ExamSession> getAllSessions() {
        return sessionRepository.findAll();
    }

    // Get a specific session by ID
    @GetMapping("/{sessionId}")
    public ResponseEntity<ExamSession> getSession(@PathVariable String sessionId) {
        return sessionRepository.findById(sessionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 2. Get sessions for a specific student (For Student Dashboard)
    @GetMapping("/student/{studentId}")
    public List<ExamSession> getStudentSessions(@PathVariable Long studentId) {
        return sessionRepository.findByStudentId(studentId);
    }

    // 3. Start a new Exam
    @PostMapping("/start")
    public ExamSession startSession(@RequestBody Map<String, Long> request) {
        ExamSession session = new ExamSession();
        session.setExamId(request.get("examId"));

        // Fetch the actual User from the DB and attach it to the session
        User student = userRepository.findById(request.get("studentId")).orElse(null);
        session.setStudent(student);

        session.setStartTime(LocalDateTime.now());
        session.setStatus("active");
        return sessionRepository.save(session);
    }

    // 4. Log an AI Suspicion Event (Tab switch, multiple faces)
    @PostMapping("/{sessionId}/events")
    public ResponseEntity<?> logEvent(@PathVariable String sessionId, @RequestBody ExamEvent event) {
        return sessionRepository.findById(sessionId).map(session -> {
            event.setSession(session);
            event.setTimestamp(LocalDateTime.now());
            session.getEvents().add(event);
            sessionRepository.save(session);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // 5. Update Suspicion Score and Warnings
    @PutMapping("/{sessionId}/suspicion")
    public ResponseEntity<?> updateSuspicion(@PathVariable String sessionId, @RequestBody Map<String, Double> req) {
        return sessionRepository.findById(sessionId).map(session -> {
            double incomingScore = req.get("score");

            // If score is 0, slowly decay the suspicion
            if (incomingScore == 0) {
                session.setSuspicionScore(Math.max(0, session.getSuspicionScore() * 0.9));
            } else {
                session.setSuspicionScore(Math.min(100, session.getSuspicionScore() + incomingScore));
            }

            // If suspicion hits 80+, add a warning
            if (session.getSuspicionScore() >= 80) {
                session.setWarningCount(session.getWarningCount() + 1);
                session.setSuspicionScore(0); // Reset score after warning
            }

            // If warnings hit 20, auto-submit and lock the exam
            if (session.getWarningCount() >= 20) {
                session.setStatus("auto-submitted");
                session.setEndTime(LocalDateTime.now());
            }

            sessionRepository.save(session);
            return ResponseEntity.ok(session);
        }).orElse(ResponseEntity.notFound().build());
    }

    // 6. Save a single answer
    @PostMapping("/{sessionId}/answers")
    public ResponseEntity<?> saveAnswer(@PathVariable String sessionId, @RequestBody StudentAnswer answer) {
        return sessionRepository.findById(sessionId).map(session -> {
            answer.setSession(session);
            // Remove previous answer for this question if it exists, then add the new one
            session.getAnswers().removeIf(a -> a.getQuestionId().equals(answer.getQuestionId()));
            session.getAnswers().add(answer);
            sessionRepository.save(session);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // 7. Final Submit
    @PutMapping("/{sessionId}/submit")
    public ResponseEntity<?> submitSession(@PathVariable String sessionId) {
        return sessionRepository.findById(sessionId).map(session -> {
            if (!session.getStatus().equals("auto-submitted")) {
                session.setStatus("completed");
                session.setEndTime(LocalDateTime.now());
            }
            sessionRepository.save(session);
            return ResponseEntity.ok(session);
        }).orElse(ResponseEntity.notFound().build());
    }
}