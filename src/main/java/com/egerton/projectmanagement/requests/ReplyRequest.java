package com.egerton.projectmanagement.requests;

import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Data
public class ReplyRequest {
    @NotNull( message = "Missing field. User ID is required")
    private long userId;

    @NotNull( message = "Missing field. Message ID is required")
    private long messageId;

    @NotBlank( message = "Missing field. Reply is required")
    private String reply;
}
