package com.exam.proctoring;

import com.exam.proctoring.entity.User;
import com.exam.proctoring.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration

public class DataLoader {

    @Bean
    CommandLineRunner load(UserRepository repo) {
        return args -> {

            User admin = new User();
            admin.setEmail("admin@test.com");
            admin.setPassword("admin123");
            admin.setRole("admin");

            repo.save(admin);

            User student = new User();
            student.setEmail("student@test.com");
            student.setPassword("student123");
            student.setRole("student");

            repo.save(student);
        };
    }
}