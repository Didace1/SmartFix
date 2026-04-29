package com.aidevice.smartfix.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    @Value("${app.name:SmartFix}")
    private String appName;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();

        // IMPORTANT: some SMTP servers ignore setFrom → still safe to include
        message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject(appName + " — Login Verification Code");

        message.setText(
                "Hello,\n\n" +
                "Your one-time verification code for " + appName + " is:\n\n" +
                "        " + otp + "\n\n" +
                "This code expires in 5 minutes.\n" +
                "Do not share it with anyone.\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "— " + appName + " Security Team"
        );

        mailSender.send(message);
    }
}