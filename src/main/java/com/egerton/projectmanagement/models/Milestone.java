package com.egerton.projectmanagement.models;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Date;

@Entity
@Table(name = "milestones")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Data
public class Milestone {
    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private long _id;

    @Column( name = "name", nullable = false)
    @NotBlank(message = "Missing field. Milestone name is required.")
    private String name;

    @Column( name = "start_date", nullable = false)
    @NotBlank(message = "Missing field. Milestone Start Date is required.")
    private Date startDate;

    @Column( name = "end_date", nullable = false)
    @NotBlank(message = "Missing field. Milestone End Date is required.")
    private Date endDate;

    @Column( name = "started_on")
    private Date startedOn;

    @Column( name = "finished_on")
    private Date finishedOn;

    @Column( name = "project_id", nullable = false)
    @NotBlank(message = "Missing field. Project ID is required.")
    private long projectId;

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
