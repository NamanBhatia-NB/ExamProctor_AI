package com.exam.proctoring.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "student_answers")
public class StudentAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private ExamSession session;

    private Long questionId;
    private Integer selectedOption; // 0, 1, 2, or 3
}