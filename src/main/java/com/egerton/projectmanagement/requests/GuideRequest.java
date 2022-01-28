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
public class GuideRequest {
    @NotBlank(message = "Missing field. Title is required.")
    private String title;

    @NotBlank(message = "Missing field. Content is required.")
    private String content;

    @NotNull(message = "Missing field. Staff ID is required.")
    private long staffId;
}
