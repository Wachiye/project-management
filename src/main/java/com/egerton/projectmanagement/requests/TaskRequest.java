package com.egerton.projectmanagement.requests;

import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Data
public class TaskRequest {
    @NotBlank(message = "Missing field. Task name is required.")
    private String name;

    @NotBlank(message = "Missing field. Task description is required.")
    private String description;

    @NotNull(message = "Missing field. Task Start Date is required.")
    private Date startDate;

    @NotNull(message = "Missing field. Task End Date is required.")
    private Date endDate;

    @NotNull(message = "Missing field. Milestone ID is required.")
    private long milestoneId;
}
