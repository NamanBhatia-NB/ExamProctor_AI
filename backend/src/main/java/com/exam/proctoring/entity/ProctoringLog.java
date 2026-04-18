package com.exam.proctoring.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProctoringLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;
    private Long examId;

    private String eventType; // TAB_SWITCH, FACE_NOT_DETECTED, etc

    private String description;

    private LocalDateTime timestamp;
}