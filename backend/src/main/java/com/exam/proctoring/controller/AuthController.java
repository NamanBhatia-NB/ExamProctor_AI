package com.exam.proctoring.controller;

import com.exam.proctoring.entity.User;
import com.exam.proctoring.service.AuthService;
import com.exam.proctoring.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService service;

    @Autowired
    private JwtUtil jwtUtil;

    // Helper method to safely package the user without infinite loops or passwords
    private Map<String, Object> buildSafeUser(User user) {
        Map<String, Object> safeUser = new HashMap<>();
        safeUser.put("id", user.getId());
        safeUser.put("email", user.getEmail());
        safeUser.put("name", user.getName());
        
        // Failsafe in case role is empty during registration
        String role = user.getRole() != null ? user.getRole() : "student"; 
        safeUser.put("role", role);
        
        return safeUser;
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        try {
            User user = service.login(req.get("email"), req.get("password"));
            
            String role = user.getRole() != null ? user.getRole() : "student";
            String token = jwtUtil.generateToken(user.getEmail(), role);

            Map<String, Object> res = new HashMap<>();
            res.put("user", buildSafeUser(user)); // ✅ Use the safe packager
            res.put("token", token);

            return ResponseEntity.ok(res);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = service.register(user);
            
            String role = savedUser.getRole() != null ? savedUser.getRole() : "student";
            String token = jwtUtil.generateToken(savedUser.getEmail(), role);

            Map<String, Object> res = new HashMap<>();
            res.put("user", buildSafeUser(savedUser)); // ✅ Use the safe packager
            res.put("token", token);
            
            return ResponseEntity.ok(res);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}