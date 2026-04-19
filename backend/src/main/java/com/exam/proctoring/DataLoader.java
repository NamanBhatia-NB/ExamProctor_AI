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

            if (repo.findByEmail("admin@test.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@test.com");
                admin.setPassword("admin123");
                admin.setRole("admin");
                repo.save(admin);
                System.out.println("Default Admin created.");
            }

            if (repo.findByEmail("student@test.com").isEmpty()) {
                User student = new User();
                student.setEmail("student@test.com");
                student.setPassword("student123");
                student.setRole("student");
                repo.save(student);
                System.out.println("Default Student created.");
            }
        };
    }
}