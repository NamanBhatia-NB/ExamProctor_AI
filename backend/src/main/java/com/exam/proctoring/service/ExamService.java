package com.exam.proctoring.service;

import com.exam.proctoring.entity.Exam;
import java.util.List;

public interface ExamService {

    Exam createExam(Exam exam);

    List<Exam> getAllExams();
}