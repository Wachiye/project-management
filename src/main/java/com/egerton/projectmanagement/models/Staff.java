package com.egerton.projectmanagement.models;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

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

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name="user_id", referencedColumnName = "_id")
    private UserModel user;

    @Column( name = "staff_id", nullable = false, unique = true)
    @NotBlank(message = "Missing field. Staff Id is required.")
    private String staffId;

   }
