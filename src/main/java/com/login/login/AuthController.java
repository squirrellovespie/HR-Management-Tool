package com.login.login;

import org.springframework.beans.factory.annotation.Autowired;
import java.security.SecureRandom;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Controller
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password) {
        if (userRepository.existsByEmail(email)) {
            User user = userRepository.findByEmail(email);
            if (passwordMatches(password, user.getPassword())) {
                return ResponseEntity.ok("success");
            }
        }
        return ResponseEntity.ok("error");
    }

    @GetMapping("/forgot-password")
    public String forgotPasswordPage() {
        return "forgot-password";
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        boolean userExists = userRepository.existsByEmail(email);
        
        if (userExists) {
            User user = userRepository.findByEmail(email);
            
            // Generate and save temporary password
            String temporaryPassword = generateTemporaryPassword();
            user.setPassword(temporaryPassword);
            userRepository.save(user);

            // Send temporary password via email (implement email sending logic here)
            sendTemporaryPasswordEmail(email, temporaryPassword);
            
            return ResponseEntity.ok("Temporary password sent to your email");
        } else {
            return ResponseEntity.badRequest().body("Email not found");
        }
    }
    
    private void sendTemporaryPasswordEmail(String toEmail, String temporaryPassword) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject("Temporary Password");
            helper.setText("Your temporary password is: " + temporaryPassword);

            mailSender.send(message);
        } catch (MessagingException e) {
            // Handle email sending error
            e.printStackTrace();
        }
    }
    
    private String generateTemporaryPassword() {
        // Define characters to be used in the password
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-_";

        // Set the length of the temporary password
        int length = 10; // You can adjust this as needed

        // Create a secure random number generator
        SecureRandom random = new SecureRandom();

        // Generate the password
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            password.append(characters.charAt(index));
        }

        return password.toString();
    }


    private boolean passwordMatches(String rawPassword, String encodedPassword) {
        // Implement your password comparison logic here.
        // You might use libraries like BCryptPasswordEncoder for secure password matching.
        // For the sake of this example, let's use a basic string comparison.
        return rawPassword.equals(encodedPassword);
    }
}
