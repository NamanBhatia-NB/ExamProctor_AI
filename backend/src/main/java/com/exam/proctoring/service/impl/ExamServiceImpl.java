package com.exam.proctoring.service.impl;

import com.exam.proctoring.entity.Exam;
import com.exam.proctoring.repository.ExamRepository;
import com.exam.proctoring.service.ExamService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamServiceImpl implements ExamService {

    private final ExamRepository repository;

    public ExamServiceImpl(ExamRepository repository) {
        this.repository = repository;
    }

    @Override
    public Exam createExam(Exam exam) {
        return repository.save(exam);
    }

    @Override
    public List<Exam> getAllExams() {
        return repository.findAll();
    }
}