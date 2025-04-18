package com.jaysambhu.dairymanagementsystem.auth.service;

import java.util.Optional;

import com.jaysambhu.dairymanagementsystem.auth.model.User;

public interface UserService {
    User saveUser(User user);
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}