package com.exam.proctoring.service;

import com.exam.proctoring.entity.User;

public interface AuthService {
    User login(String email, String password);
    User register(User user);
}