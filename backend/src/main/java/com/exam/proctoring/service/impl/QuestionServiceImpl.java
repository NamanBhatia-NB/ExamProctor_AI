package com.exam.proctoring.service.impl;

import com.exam.proctoring.entity.Question;
import com.exam.proctoring.repository.QuestionRepository;
import com.exam.proctoring.service.QuestionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionServiceImpl(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Override
    public Question saveQuestion(Question question) {
        System.out.println("Exam ID: " + question.getExam().getId()); // DEBUG
        return questionRepository.save(question);
    }

    @Override
    public List<Question> getQuestionsByExamId(Long examId) {
        return questionRepository.findByExamId(examId);
    }
}