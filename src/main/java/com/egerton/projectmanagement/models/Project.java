package com.egerton.projectmanagement.models;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Date;

@Entity
@Table(name = "projects")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Data
public class Project {
    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private long _id;

    @Column( name = "name", nullable = false)
    @NotBlank(message = "Missing field. Project name is required.")
    private String name;

    @Column( name = "short_desc", nullable = false)
    @NotBlank(message = "Missing field. Short description is required.")
    private String shortDesc;

    @Column( name = "description", nullable = false)
    @NotBlank(message = "Missing field. Project description is required.")
    private String description;

    @Column( name = "category", nullable = false)
    @NotBlank(message = "Missing field. Project category is required.")
    @Enumerated(EnumType.STRING)
    private ProjectCategory category;

    @Column( name = "languages", nullable = false)
    @NotBlank(message = "Missing field. Project languages is required.")
    private String languages;

    @Column( name = "start_date", nullable = false)
    @NotBlank(message = "Missing field. Project Start Date is required.")
    private Date startDate;

    @Column( name = "end_date", nullable = false)
    @NotBlank(message = "Missing field. Project End Date is required.")
    private Date endDate;

    @Column( name = "started_on")
    private Date startedOn;

    @Column( name = "finished_on")
    private Date finishedOn;

    @Column( name = "student_id", nullable = false)
    @NotBlank(message = "Missing field. Student ID is required.")
    private long studentId;

    @Column( name = "evaluator_id", nullable = false)
    @NotBlank(message = "Missing field. Evaluator ID is required.")
    private long evaluatorId;

    @Column( name = "supervisor_id")
    private long supervisorId;

    @Column( name = "student_id", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column( name = "created_at", nullable = false)
    @CreatedDate
    private Date createdAt;

    @Column( name = "update_at", nullable = false)
    @LastModifiedDate
    private Date updateAt;
}
