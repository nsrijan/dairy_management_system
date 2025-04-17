package com.jaysambhu.dairymanagementsystem.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jaysambhu.dairymanagementsystem.auth.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    // For supporting login by username as well
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}