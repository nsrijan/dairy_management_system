package com.jaysambhu.dairymanagementsystem.auth.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.jaysambhu.dairymanagementsystem.auth.model.User;
import com.jaysambhu.dairymanagementsystem.auth.repository.UserRepository;
import com.jaysambhu.dairymanagementsystem.auth.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}