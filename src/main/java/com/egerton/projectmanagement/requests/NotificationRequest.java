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
public class NotificationRequest {
    @NotBlank(message = "Missing field. Title is required.")
    private String title;

    @NotNull(message = "Missing field. Message is required.")
    private String message;

   @NotNull(message = "Missing field. Notification type is required.")
    private String type;

   @NotNull(message = "Missing field. User ID is required.")
    private long userId;
}
