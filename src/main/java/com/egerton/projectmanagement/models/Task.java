package com.egerton.projectmanagement.models;

import com.egerton.projectmanagement.utils.DateUtil;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
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

    @Column( name = "start_date")
    private Date startDate;

    @Column( name = "end_date")
    private Date endDate;

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
    @JoinColumn(name = "milestone_id", referencedColumnName = "_id")
    @JsonIgnoreProperties("tasks")
    private Milestone milestone;

    @Transient
    private long taskDays;

    @Transient
    private long daysLeft;

    public long getTaskDays() {
        return DateUtil.getDaysBetween( endDate, startDate);
    }

    public long getDaysLeft() {
        return DateUtil.getDaysBetween(new Date(), endDate);
    }
}
