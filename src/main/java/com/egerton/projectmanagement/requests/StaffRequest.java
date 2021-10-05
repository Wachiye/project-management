package com.egerton.projectmanagement.requests;

import lombok.*;

import javax.validation.constraints.NotBlank;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Data
public class StaffRequest {

    @NotBlank(message = "Missing field. Staff ID is required.")
    private String staffId;

    @NotBlank(message = "Missing field. First name is required.")
    private String firstName;

    @NotBlank(message = "Missing field. Last name is required.")
    private String lastName;

    @NotBlank(message = "Missing field. Email is required.")
    private String email;

    @NotBlank(message = "Missing field. Password is required.")
    private String password;

    @NotBlank(message = "Missing field. Staff Role is required.")
    private String role;
}
