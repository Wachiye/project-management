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
public class MilestoneRequest {
    @NotBlank(message = "Missing field. Milestone name is required.")
    private String name;

    @NotNull(message = "Missing field. Milestone Start Date is required.")
    private Date startDate;

    @NotNull(message = "Missing field. Milestone End Date is required.")
    private Date endDate;

    @NotNull(message = "Missing field. Project ID is required.")
    private long projectId;
}
