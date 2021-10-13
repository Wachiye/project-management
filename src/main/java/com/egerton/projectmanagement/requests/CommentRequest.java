package com.egerton.projectmanagement.requests;

import lombok.*;

import javax.persistence.Column;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Data
public class CommentRequest {
    @NotBlank(message = "Missing field. Message is required.")
    private String message;

    @NotNull(message = "Missing field. Project ID is required.")
    private long projectId;

    @Column( name = "staff_id", nullable = false)
    @NotNull(message = "Missing field. Staff ID is required.")
    private long staffId;

    @Column( name = "student_id", nullable = false)
    @NotNull(message = "Missing field. Student ID is required.")
    private long studentId;
}
