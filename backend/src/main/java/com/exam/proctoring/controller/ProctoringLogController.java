package com.exam.proctoring.controller;

import com.exam.proctoring.entity.ProctoringLog;
import com.exam.proctoring.service.ProctoringLogService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class ProctoringLogController {

    private final ProctoringLogService service;

    public ProctoringLogController(ProctoringLogService service) {
        this.service = service;
    }

    @PostMapping
    public ProctoringLog createLog(@RequestBody ProctoringLog log) {
        log.setTimestamp(LocalDateTime.now()); // auto set time
        return service.saveLog(log);
    }

    @GetMapping
    public List<ProctoringLog> getAllLogs() {
        return service.getAllLogs();
    }
}