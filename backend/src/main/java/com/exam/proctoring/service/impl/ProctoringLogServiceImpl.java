package com.exam.proctoring.service.impl;

import com.exam.proctoring.entity.ProctoringLog;
import com.exam.proctoring.repository.ProctoringLogRepository;
import com.exam.proctoring.service.ProctoringLogService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProctoringLogServiceImpl implements ProctoringLogService {

    private final ProctoringLogRepository repository;

    public ProctoringLogServiceImpl(ProctoringLogRepository repository) {
        this.repository = repository;
    }

    @Override
    public ProctoringLog saveLog(ProctoringLog log) {
        return repository.save(log);
    }

    @Override
    public List<ProctoringLog> getAllLogs() {
        return repository.findAll();
    }
}