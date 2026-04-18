package com.exam.proctoring.service;

import com.exam.proctoring.entity.ProctoringLog;
import java.util.List;

public interface ProctoringLogService {

    ProctoringLog saveLog(ProctoringLog log);

    List<ProctoringLog> getAllLogs();
}