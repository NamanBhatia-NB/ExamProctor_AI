package com.exam.proctoring.controller;

import com.exam.proctoring.entity.Question;
import com.exam.proctoring.repository.QuestionRepository;
import com.exam.proctoring.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class QuestionController {   

    @Autowired
    private QuestionRepository repo;

    @PostMapping
    public Question add(@RequestBody Question q) {
        return repo.save(q);
    }

    @GetMapping("/{examId}")
    public List<Question> get(@PathVariable Long examId) {
        return repo.findByExamId(examId);
    }
}