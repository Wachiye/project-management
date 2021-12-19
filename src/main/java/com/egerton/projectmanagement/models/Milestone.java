package com.egerton.projectmanagement.models;

import com.egerton.projectmanagement.utils.DateUtil;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "milestones")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

public class Milestone {
    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private long _id;

    @Column( name = "name", nullable = false)
    @NotBlank(message = "Missing field. Milestone name is required.")
    private String name;

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

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name="project_id", referencedColumnName = "_id")
    @JsonIgnoreProperties("milestones")
    private Project project;

    @OneToMany( mappedBy = "milestone", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("milestone")
    private Set<Task> tasks;

    @Transient
    private long milestoneDays;

    @Transient
    private long daysLeft;

    public long getMilestoneDays() {
        return DateUtil.getDaysBetween( endDate, startDate);
    }

    public long getDaysLeft() {
        return DateUtil.getDaysBetween(endDate, new Date());
    }
}
