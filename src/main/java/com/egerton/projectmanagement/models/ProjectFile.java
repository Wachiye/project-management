package com.egerton.projectmanagement.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Date;

@Entity
@Table(name = "project_files")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

public class ProjectFile {
    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private long _id;

    @Column( name = "name", nullable = false)
    @NotBlank(message = "Missing field. Project name is required.")
    private String name;

    @Column( name = "description", nullable = false,  columnDefinition = "TEXT")
    @NotBlank(message = "Missing field. Task description is required.")
    private String description;

    @Column( name = "file_url", nullable = false)
    @NotBlank(message = "Missing field. File URL description is required.")
    private String fileURL;

    @Column( name ="file_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private FileType fileType;

    @Column( name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column( name = "created_at", nullable = false)
    @CreatedDate
    private Date createdAt;

    @Column( name = "update_at", nullable = false)
    @LastModifiedDate
    private Date updateAt;

    @Column( name = "accepted_date")
    private Date acceptedDate;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonIgnoreProperties("projectFiles")
    private Project project;

}
