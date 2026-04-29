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
    private final OtpService otpService;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, OtpService otpService, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
        this.emailService = emailService;
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
            throw new IllegalArgumentException("An account with this email address already exists");
        }
        if (request.phone() != null && !request.phone().isBlank() && userRepository.findByPhone(request.phone()).isPresent()) {
            throw new IllegalArgumentException("An account with this phone number already exists");
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
        user.setApproved(false);

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

        if (!user.isApproved()) {
            throw new IllegalArgumentException("Account pending admin approval. Please wait for an administrator to activate your account.");
        }

        String otp = otpService.generate(user.getEmail());
        try {
            emailService.sendOtp(user.getEmail(), otp);
            return new AuthDtos.AuthResponse(null, true, mapToUserResponse(user), null);
        } catch (Exception e) {
            System.err.println("[OTP] Email send failed (" + e.getMessage() + "). OTP: " + otp);
            return new AuthDtos.AuthResponse(null, true, mapToUserResponse(user), otp);
        }
    }

    public AuthDtos.AuthResponse verifyOtp(AuthDtos.OtpVerifyRequest request) {
        if (!otpService.verify(request.email(), request.otp())) {
            throw new IllegalArgumentException("Invalid or expired OTP. Please try again.");
        }
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String token = UUID.nameUUIDFromBytes((user.getEmail() + ":" + System.currentTimeMillis()).getBytes(StandardCharsets.UTF_8)).toString();
        return new AuthDtos.AuthResponse(token, false, mapToUserResponse(user), null);
    }

    public List<AuthDtos.PendingUserResponse> getPendingUsers() {
        return userRepository.findByApprovedFalse().stream()
                .map(u -> new AuthDtos.PendingUserResponse(u.getId(), u.getFullName(), u.getEmail(), u.getPhone(), u.getRole()))
                .toList();
    }

    @Transactional
    public AuthDtos.UserResponse approveUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setApproved(true);
        return mapToUserResponse(userRepository.save(user));
    }

    @Transactional
    public void rejectUser(Long id) {
        userRepository.deleteById(id);
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
                user.getCertifications(),
                user.isApproved()
        );
    }
}