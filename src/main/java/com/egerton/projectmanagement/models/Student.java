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
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "students")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

public class Student {
    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private long _id;

    @Column( name = "first_name", nullable = false)
    @NotBlank(message = "Missing field. First name is required.")
    private String firstName;

    @Column( name = "last_name", nullable = false)
    @NotBlank(message = "Missing field. Last name is required.")
    private String lastName;

    @Column( name = "reg_no", nullable = false, unique = true)
    @NotBlank(message = "Missing field. Reg No is required.")
    private String regNo;

    @Column( name = "email_address", nullable = false, unique = true)
    @NotBlank(message = "Missing field. Email is required.")
    private String email;

    @Column( name = "password", nullable = false)
    @NotBlank(message = "Missing field. Password is required.")
    private String password;

    @Column( name = "created_at", nullable = false)
    @CreatedDate
    private Date createdAt;

    @Column( name = "update_at", nullable = false)
    @LastModifiedDate
    private Date updateAt;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("student")
    private Set<Project> projects;

    @OneToMany(mappedBy = "student",cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("student")
    private Set<ProjectFile> projectFiles;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("student")
    private Set<Comment> comments;
}
