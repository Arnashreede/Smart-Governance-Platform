package com.civicpulse.user_service.controller;

import com.civicpulse.user_service.dto.UserResponse;
import com.civicpulse.user_service.entity.User;
import com.civicpulse.user_service.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getRole(),
                        user.getDesignation(),
                        user.getDepartment() != null
                                ? user.getDepartment().getName()
                                : null,
                        user.isActive()
                ))
                .collect(Collectors.toList());
    }
}