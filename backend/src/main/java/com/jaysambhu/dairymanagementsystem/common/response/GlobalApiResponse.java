package com.jaysambhu.dairymanagementsystem.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Standard API response wrapper to ensure consistent response format.
 *
 * Example usage:
 * 
 * @GetMapping("/users/{id}")
 * public ResponseEntity<GlobalApiResponse<UserDTO>> getUser(@PathVariable Long
 * id) {
 * UserDTO user = userService.findById(id);
 * return ResponseEntity.ok(
 * GlobalApiResponse.<UserDTO>builder()
 * .success(true)
 * .message("User retrieved successfully")
 * .data(user)
 * .build()
 * );
 * }
 *
 * @param <T> Type of data being returned
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalApiResponse<T> {

    @Builder.Default
    private boolean success = true;

    private String message;

    private T data;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}