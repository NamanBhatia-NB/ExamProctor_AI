package com.exam.proctoring.repository;

import com.exam.proctoring.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {

}