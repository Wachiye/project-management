package com.egerton.projectmanagement.requests;

import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Data
public class StudentUpdate {
    @NotBlank(message = "Missing field. First name is required.")
    private String firstName;

    @NotBlank(message = "Missing field. Last name is required.")
    private String lastName;

    @NotBlank(message = "Missing field. Email is required.")
    @Email(message = "Invalid email address")
    private String email;

    @NotBlank(message = "Missing field. Reg No.  is required.")
    private String regNo;
}