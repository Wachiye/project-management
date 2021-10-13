package com.egerton.projectmanagement.models;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = "staff")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

public class Staff {
    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private long _id;

    @Column( name = "first_name", nullable = false)
    @NotBlank(message = "Missing field. First name is required.")
    private String firstName;

    @Column( name = "last_name", nullable = false)
    @NotBlank(message = "Missing field. Last name is required.")
    private String lastName;

    @Column( name = "staff_id", nullable = false, unique = true)
    @NotBlank(message = "Missing field. Staff Id is required.")
    private String staffId;

    @Column( name = "email_address", nullable = false, unique = true)
    @NotBlank(message = "Missing field. Email is required.")
    private String email;

    @Column( name = "password", nullable = false)
    @NotBlank(message = "Missing field. Password is required.")
    private String password;

    @Column( name = "role", nullable = false)
    @NotNull(message = "Missing field. Staff Role is required.")
    @Enumerated(EnumType.STRING)
    private StaffRoles role;

    @Column( name = "created_at", nullable = false)
    @CreatedDate
    private Date createdAt;

    @Column( name = "update_at", nullable = false)
    @LastModifiedDate
    private Date updateAt;
}
