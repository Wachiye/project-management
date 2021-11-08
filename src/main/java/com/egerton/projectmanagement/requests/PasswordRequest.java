package com.egerton.projectmanagement.requests;

import lombok.*;

import javax.validation.constraints.NotBlank;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Builder
public class PasswordRequest {
    @NotBlank(message = "Missing field. Email is required")
    private String email;
    @NotBlank( message = "Missing field. Old password is required")
    private String oldPassword;
    @NotBlank( message = "Missing field. New password is required")
    private String password;
}
