package com.aidevice.smartfix.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true)
    private String email;

    private String phone;
    private String employeeId;

    private String password;

    private String role;

    private String specialization;

    @Column(columnDefinition = "TEXT")
    private String certifications;
}