package com.civicpulse.user_service.service;

import com.civicpulse.user_service.dto.LoginRequest;
import com.civicpulse.user_service.dto.LoginResponse;
import com.civicpulse.user_service.dto.RegisterRequest;
import com.civicpulse.user_service.entity.Department;
import com.civicpulse.user_service.entity.User;
import com.civicpulse.user_service.repository.DepartmentRepository;
import com.civicpulse.user_service.repository.UserRepository;
import com.civicpulse.user_service.security.JwtService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository,
                       DepartmentRepository departmentRepository,
                       JwtService jwtService) {

        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.jwtService = jwtService;
    }

    // Register User / Officer
    public User register(RegisterRequest request) {

    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
        throw new RuntimeException("Email already exists");
    }

    User user = new User();

    user.setFullName(request.getFullName());
    user.setEmail(request.getEmail());
    user.setPhone(request.getPhone());
    user.setDesignation(request.getDesignation());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(request.getRole());
    user.setActive(true);

    if (request.getDepartmentId() != null) {

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        user.setDepartment(department);
    }

    return userRepository.save(user);
}
    // Login User
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isActive()) {
            throw new RuntimeException("Account is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return new LoginResponse(
    token,
    user.getRole(),
    user.getId(),
    user.getEmail(),
    user.getFullName(),
    user.getDepartment() != null ? user.getDepartment().getId() : null,
    user.getDepartment() != null ? user.getDepartment().getName() : null
);
    }

    public User findByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}