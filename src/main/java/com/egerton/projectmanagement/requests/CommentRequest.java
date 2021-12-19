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

    @NotNull(message = "Missing field. User ID is required.")
    private long userId;

}
