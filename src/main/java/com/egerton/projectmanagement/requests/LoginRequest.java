package com.egerton.projectmanagement.requests;

import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Builder
public class LoginRequest {
    @NotBlank(message = "Missing field. Email is required")
    @Email(message = "Invalid email address")
    private String email;

    @NotBlank( message = "Missing field. Password is required")
    private String password;
}
