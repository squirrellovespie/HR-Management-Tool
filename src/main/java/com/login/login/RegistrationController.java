package com.login.login;

import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/*import com.login.login.User;
import com.login.login.UserRepository;*/

@Controller
public class RegistrationController {

    private final UserRepository userRepository;

    @Autowired
    public RegistrationController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/registration")
    public String registrationPage() {
        return "registration";
    }

    @PostMapping("/api/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User userDto) {
        // Check if the email is already registered
        if (userRepository.existsByEmail(userDto.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email address is already registered.");
            return ResponseEntity.badRequest().body(response);
        }

        // Validate userDto and create User entity
        User user = new User();
        user.setId(UUID.randomUUID()); // Generate a UUID
        user.setFirst_name(userDto.getFirst_name());
        user.setLast_name(userDto.getLast_name());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setRole(userDto.getRole());

        userRepository.save(user); // Save user to the database
        userRepository.flush();

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully.");

        return ResponseEntity.ok(response);
    }
}
