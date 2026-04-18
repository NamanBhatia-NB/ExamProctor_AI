package com.exam.proctoring.repository;

import com.exam.proctoring.entity.ProctoringLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProctoringLogRepository extends JpaRepository<ProctoringLog, Long> {
}