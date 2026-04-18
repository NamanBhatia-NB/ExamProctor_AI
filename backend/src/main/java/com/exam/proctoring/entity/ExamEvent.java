package com.exam.proctoring.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "exam_events")
public class ExamEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private ExamSession session;

    private String type; // FACE_NOT_DETECTED, TAB_SWITCH, etc.
    private String severity; // HIGH, CRITICAL, etc.
    private String details;
    private LocalDateTime timestamp;
}