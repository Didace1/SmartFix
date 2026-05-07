package com.aidevice.smartfix.controller;

import com.aidevice.smartfix.dto.AuthDtos;
import com.aidevice.smartfix.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public AuthDtos.UserResponse register(@RequestBody AuthDtos.RegisterRequest request) {
        try {
            return userService.register(request);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    @PostMapping("/login")
    public AuthDtos.AuthResponse login(@RequestBody AuthDtos.LoginRequest request) {
        try {
            return userService.login(request);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, ex.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public AuthDtos.AuthResponse verifyOtp(@RequestBody AuthDtos.OtpVerifyRequest request) {
        try {
            return userService.verifyOtp(request);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, ex.getMessage());
        }
    }

    @GetMapping("/pending")
    public List<AuthDtos.PendingUserResponse> getPendingUsers() {
        return userService.getPendingUsers();
    }

    @PutMapping("/approve/{id}")
    public AuthDtos.UserResponse approveUser(@PathVariable Long id) {
        try {
            return userService.approveUser(id);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        } catch (Exception ex) {
            // Log the full error for debugging
            System.err.println("Error approving user " + id + ": " + ex.getMessage());
            ex.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to approve user: " + ex.getMessage());
        }
    }

    @DeleteMapping("/reject/{id}")
    public ResponseEntity<Void> rejectUser(@PathVariable Long id) {
        userService.rejectUser(id);
        return ResponseEntity.noContent().build();
    }
}
