package com.aidevice.smartfix.controller;

import com.aidevice.smartfix.model.User;
import com.aidevice.smartfix.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/technicians")
public class TechnicianController {
    private final UserRepository userRepository;

    public TechnicianController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> list() {
        return userRepository.findAll().stream()
                .filter(user -> "technician".equalsIgnoreCase(user.getRole()))
                .toList();
    }
}
