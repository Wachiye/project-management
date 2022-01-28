package com.egerton.projectmanagement.requests;

import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Data
public class RegisterRequest {
    @NotBlank(message = "Missing field. First name is required.")
    private String firstName;

    @NotBlank(message = "Missing field. Last name is required.")
    private String lastName;

    @NotBlank(message = "Missing field. Email is required.")
    private String email;

    @NotBlank(message = "Missing field. Password is required.")
    private String password;

    @NotNull(message = "Missing field. Role (Student/Staff)")
    private String role;

    @NotBlank( message =  "Missing field. Verification URL is required.")
    private String verificationURL;
}
