package com.aidevice.smartfix.dto;

public class AuthDtos {
    public record RegisterRequest(
            String fullName,
            String email,
            String phone,
            String employeeId,
            String role,
            String password,
            String specialization,
            String certifications
    ) {}

    public record LoginRequest(
            String email,
            String password,
            Boolean rememberMe
    ) {}

    public record UserResponse(
            Long id,
            String fullName,
            String email,
            String phone,
            String employeeId,
            String role,
            String specialization,
            String certifications
    ) {}

    public record AuthResponse(
            String token,
            Boolean requiresMfa,
            UserResponse user
    ) {}
}
