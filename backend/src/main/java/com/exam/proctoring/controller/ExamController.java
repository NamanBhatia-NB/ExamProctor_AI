package com.exam.proctoring.controller;

import com.exam.proctoring.entity.Exam;
import com.exam.proctoring.entity.Question;
import com.exam.proctoring.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExamController {

    @Autowired
    private ExamRepository examRepository;

    @GetMapping
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    @PostMapping
    public Exam createExam(@RequestBody Exam exam) {
        if (exam.getQuestions() != null) {
            for (Question q : exam.getQuestions()) {
                q.setExam(exam);
            }
        }
        return examRepository.save(exam);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exam> updateExam(@PathVariable Long id, @RequestBody Exam updatedExam) {
        return examRepository.findById(id).map(existingExam -> {
            existingExam.setTitle(updatedExam.getTitle());
            existingExam.setDuration(updatedExam.getDuration());

            // ✅ Clear old questions and add the new ones, linking the parent
            existingExam.getQuestions().clear();
            if (updatedExam.getQuestions() != null) {
                for (Question q : updatedExam.getQuestions()) {
                    q.setExam(existingExam);
                    existingExam.getQuestions().add(q);
                }
            }

            return ResponseEntity.ok(examRepository.save(existingExam));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ FIX FOR THE DELETE CORS ERROR
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable Long id) {
        return examRepository.findById(id).map(exam -> {
            examRepository.delete(exam);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}