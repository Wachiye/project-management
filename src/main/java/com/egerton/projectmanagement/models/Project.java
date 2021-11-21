package com.egerton.projectmanagement.models;

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

    @Column( name = "description", nullable = false)
    @NotBlank(message = "Missing field. Project description is required.")
    private String description;

    @Column( name = "category", nullable = false)
    @NotNull(message = "Missing field. Project category is required.")
    @Enumerated(EnumType.STRING)
    private ProjectCategory category;

    @Column( name = "languages", nullable = false)
    @NotBlank(message = "Missing field. Project languages is required.")
    private String languages;

    @Column( name = "start_date", nullable = false)
    @NotNull(message = "Missing field. Project Start Date is required.")
    private Date startDate;

    @Column( name = "end_date", nullable = false)
    @NotNull(message = "Missing field. Project End Date is required.")
    private Date endDate;

    @Column( name = "started_on")
    private Date startedOn;

    @Column( name = "finished_on")
    private Date finishedOn;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name="evaluator_id", referencedColumnName = "_id")
    private Staff evaluator;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
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

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name="student_id", referencedColumnName = "_id")
    @JsonIgnoreProperties("projects")
    private Student student;

    @OneToMany( mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("project")
    private Set<Milestone> milestones;

    @OneToMany( mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("project")
    private Set<Comment> comments;

    @OneToMany( mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("project")
    private Set<ProjectFile> projectFiles;
}
