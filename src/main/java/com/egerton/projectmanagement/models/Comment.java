package com.egerton.projectmanagement.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Date;

@Entity
@Table(name = "comments")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Comment {

    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private long _id;

    @Column( name = "message", nullable = false,  columnDefinition = "TEXT")
    @NotBlank(message = "Missing field. Message is required.")
    private String message;

    @Column( name = "created_at", nullable = false)
    @CreatedDate
    @OrderBy
    private Date createdAt;

    @Column( name = "update_at", nullable = false)
    @LastModifiedDate
    private Date updateAt;

    @ManyToOne
    @JoinColumn( name = "project_id", referencedColumnName = "_id")
    @JsonIgnoreProperties("comments")
    private Project project;

    @ManyToOne
    @JoinColumn( name = "user_id", referencedColumnName = "_id")
    private UserModel user;
}
