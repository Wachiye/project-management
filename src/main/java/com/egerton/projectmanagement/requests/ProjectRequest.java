package com.egerton.projectmanagement.requests;

import lombok.*;

import javax.validation.constraints.NotBlank;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Data
public class ProjectRequest {
    @NotBlank(message = "Missing field. Project name is required.")
    private String name;

    @NotBlank(message = "Missing field. Short description is required.")
    private String shortDesc;

    @NotBlank(message = "Missing field. Project description is required.")
    private String description;

    @NotBlank(message = "Missing field. Project category is required.")
    private String category;

    @NotBlank(message = "Missing field. Project languages is required.")
    private String languages;

    @NotBlank(message = "Missing field. Project Start Date is required.")
    private Date startDate;

    @NotBlank(message = "Missing field. Project End Date is required.")
    private Date endDate;


    @NotBlank(message = "Missing field. Student ID is required.")
    private long studentId;

    @NotBlank(message = "Missing field. Evaluator ID is required.")
    private long evaluatorId;
}
