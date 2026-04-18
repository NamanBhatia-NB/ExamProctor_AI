package com.exam.proctoring.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "exam_sessions")
public class ExamSession {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id; // Using UUID so students can't guess session IDs

    private Long examId;
    // private Long studentId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String status; // "active", "completed", "auto-submitted"
    private double suspicionScore = 0.0;
    private int warningCount = 0;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("session")
    private List<ExamEvent> events = new ArrayList<>();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("session")
    private List<StudentAnswer> answers = new ArrayList<>();
}