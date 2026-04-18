package com.exam.proctoring.repository;

import com.exam.proctoring.entity.ExamEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamEventRepository extends JpaRepository<ExamEvent, Long> {
}