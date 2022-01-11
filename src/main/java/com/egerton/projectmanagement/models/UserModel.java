package com.egerton.projectmanagement.models;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.Date;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserModel {
    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private long _id;

    @NotBlank(message = "Missing field. First name is required.")
    private String firstName;

    @NotBlank(message = "Missing field. Last name is required.")
    private String lastName;

    @NotBlank(message = "Missing field. Email is required.")
    @Email(message = "Invalid email address")
    private String email;

    @NotBlank(message = "Missing field. Password is required.")
    private String password;

    @Column( name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRoles role;

    @Column(name = "active")
    private boolean active;

    @Column(name = "verification_code", updatable = false)
    private String verificationCode;

    @Column( name = "created_at", nullable = false)
    @CreatedDate
    private Date createdAt;

    @Column( name = "update_at", nullable = false)
    @LastModifiedDate
    private Date updateAt;

    @Transient
    private String fullName;

    public String getFullName(){
        return firstName + " " + lastName;
    }
}
