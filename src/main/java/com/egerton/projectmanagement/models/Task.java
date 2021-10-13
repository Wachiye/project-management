package com.egerton.projectmanagement.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = "tasks")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

public class Task {

    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private long _id;

    @Column( name = "name", nullable = false)
    @NotBlank(message = "Missing field. Task name is required.")
    private String name;

    @Column( name = "description", nullable = false)
    @NotBlank(message = "Missing field. Task description is required.")
    private String description;

    @Column( name = "start_date", nullable = false)
    @NotNull(message = "Missing field. Task Start Date is required.")
    private Date startDate;

    @Column( name = "end_date", nullable = false)
    @NotNull(message = "Missing field. Task End Date is required.")
    private Date endDate;

    @Column( name = "started_on")
    private Date startedOn;

    @Column( name = "finished_on")
    private Date finishedOn;

    @Column( name = "pessimistic_time")
    @NotNull( message = "Missing field. Pessimistic Time is required.")
    private int pessimisticTime;

    @Column( name = "optimistic_time")
    @NotNull( message = "Missing field. Optimistic Time is required.")
    private int optimisticTime;

    @Column( name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column( name = "created_at", nullable = false)
    @CreatedDate
    private Date createdAt;

    @Column( name = "update_at", nullable = false)
    @LastModifiedDate
    private Date updateAt;

    @ManyToOne( cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "milestone_in")
    @JsonIgnoreProperties("tasks")
    private Milestone milestone;
}
