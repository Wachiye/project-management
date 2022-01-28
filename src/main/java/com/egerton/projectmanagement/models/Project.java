package com.egerton.projectmanagement.models;

import com.egerton.projectmanagement.utils.DateUtil;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "projects")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

public class Project {
    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private long _id;

    @Column( name = "name", nullable = false)
    @NotBlank(message = "Missing field. Project name is required.")
    private String name;

    @Column( name = "description", nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "Missing field. Project description is required.")
    private String description;

    @Column( name = "category", nullable = false)
    @NotNull(message = "Missing field. Project category is required.")
    @Enumerated(EnumType.STRING)
    private ProjectCategory category;

    @Column( name = "languages", nullable = false)
    @NotBlank(message = "Missing field. Project languages is required.")
    private String languages;

    @Column( name = "start_date")
    private Date startDate;

    @Column( name = "end_date")
    private Date endDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="student_id", referencedColumnName = "_id")
    @JsonIgnoreProperties("projects")
    private Student student;

    @ManyToOne
    @JoinColumn(name="evaluator_id", referencedColumnName = "_id")
    private Staff evaluator;

    @ManyToOne
    @JoinColumn(name="supervisor_id", referencedColumnName = "_id")
    private Staff supervisor;

    @Column( name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column( name = "created_at", nullable = false)
    @CreatedDate
    private Date createdAt;

    @Column( name = "update_at", nullable = false)
    @LastModifiedDate
    private Date updateAt;

    @OneToMany( mappedBy = "project", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("project")
    private List<Milestone> milestones;

    @OneToMany( mappedBy = "project", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("project")
    private List<Comment> comments;

    @OneToMany( mappedBy = "project", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("project")
    private List<ProjectFile> projectFiles;

    @Column( name = "accepted_date")
    private Date acceptedDate;

    @Transient
    private long projectDays;

    @Transient
    private long daysLeft;

    public long getProjectDays() {
        return DateUtil.getDaysBetween( startDate, endDate);
    }

    public long getDaysLeft() {
        return DateUtil.getDaysBetween( new Date(), endDate);
    }
}
