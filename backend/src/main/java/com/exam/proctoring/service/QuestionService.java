package com.exam.proctoring.service;

import com.exam.proctoring.entity.Question;

import java.util.List;

public interface QuestionService {

    Question saveQuestion(Question question);

    List<Question> getQuestionsByExamId(Long examId);
}