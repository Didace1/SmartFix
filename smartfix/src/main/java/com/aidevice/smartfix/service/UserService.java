package com.aidevice.smartfix.service;

import com.aidevice.smartfix.dto.AuthDtos;
import com.aidevice.smartfix.model.User;
import com.aidevice.smartfix.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public AuthDtos.UserResponse register(AuthDtos.RegisterRequest request) {
        if (request.email() == null || request.email().isBlank() || request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("Email and password are required");
        }
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setEmployeeId(request.employeeId());
        user.setRole(request.role() == null || request.role().isBlank() ? "technician" : request.role());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setSpecialization(request.specialization());
        user.setCertifications(request.certifications());

        User saved = userRepository.save(user);
        return mapToUserResponse(saved);
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        if (request.email() == null || request.password() == null) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = UUID.nameUUIDFromBytes((user.getEmail() + ":" + System.currentTimeMillis()).getBytes(StandardCharsets.UTF_8)).toString();
        return new AuthDtos.AuthResponse(token, false, mapToUserResponse(user));
    }

    public AuthDtos.UserResponse mapToUserResponse(User user) {
        return new AuthDtos.UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getEmployeeId(),
                user.getRole(),
                user.getSpecialization(),
                user.getCertifications()
        );
    }
}