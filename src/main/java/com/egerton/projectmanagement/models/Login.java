package com.egerton.projectmanagement.models;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Date;

@Entity
@Table(name = "login")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Login {
    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private long _id;

    @Column(name = "email", nullable = false)
    @NotBlank(message = "Missing field. Email cannot be blank")
    private String email;

    @Column(name = "role", nullable = false)
    @NotBlank(message = "Missing field. Role cannot be blank")
    private String role;

    @Column(name = "token", nullable = false)
    @NotBlank( message = "Missing field. Token cannot be blank")
    private String token;

    @Column( name = "login_at", nullable = false)
    @CreationTimestamp
    private Date loginAt;

    @Column( name = "logout_at", nullable = false)
    @UpdateTimestamp
    private Date logoutAt;
}
