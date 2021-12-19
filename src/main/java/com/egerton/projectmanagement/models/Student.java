package com.egerton.projectmanagement.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
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

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name="user_id", referencedColumnName = "_id")
    private UserModel user;

    @Column( name = "reg_no", nullable = false, unique = true)
    @NotBlank(message = "Missing field. Reg No is required.")
    private String regNo;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("student")
    private Set<Project> projects;
}
