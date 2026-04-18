package com.exam.proctoring.service;

import com.exam.proctoring.entity.Student;

import java.util.List;


public interface StudentService {
    List<Student> getAllStudents();
    Student saveStudent(Student student);
}
