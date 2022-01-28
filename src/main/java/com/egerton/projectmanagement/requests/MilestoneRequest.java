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

    private Date startDate;

    private Date endDate;

    @NotNull(message = "Missing field. Project ID is required.")
    private long projectId;
}
