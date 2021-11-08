package com.egerton.projectmanagement.requests;

import lombok.*;

import javax.validation.constraints.NotBlank;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Builder
public class LoginRequest {
    @NotBlank(message = "Missing field. Email is required")
    private String email;

    @NotBlank( message = "Missing field. Password is required")
    private String password;

    @NotBlank( message = "Missing field. Role is required")
    private  String role;
}
