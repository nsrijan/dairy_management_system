package com.jaysambhu.dairymanagementsystem.modules.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for transferring UserProfile data to and from the API.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfileDto {

    private Long id;

    private String address;

    private String city;

    private String state;

    private String postalCode;

    private String country;

    private String profilePictureUrl;

    private LocalDate dateOfBirth;
}