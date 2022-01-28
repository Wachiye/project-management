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
public class MessageRequest {
    @NotBlank( message = "Missing field. Sender Name is required")
    private String senderName;

    @NotNull( message = "Missing field. Sender Email is required")
    private String senderEmail;

    private String receiverName;

    private String receiverEmail;

    @NotBlank(message = "Missing field. Message is required.")
    private String message;

}
