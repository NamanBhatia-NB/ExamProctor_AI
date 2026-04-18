package com.exam.proctoring.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;

@Component
public class JwtUtil {
    @Value("${secret.key}")
    private String secretKey;
    // A secure 256-bit key used to sign your tokens

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role) // Save their role in the token!
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Valid for 10 hours
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}