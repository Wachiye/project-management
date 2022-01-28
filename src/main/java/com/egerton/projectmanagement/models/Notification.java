package com.egerton.projectmanagement.models;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;
@Entity
@Table(name = "notifications")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

public class Notification {
    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private long _id;

    @Column( name = "title", nullable = false)
    @NotBlank(message = "Missing Field. Title is required")
    private String title;

    @Column( name = "message", nullable = false,  columnDefinition = "TEXT")
    @NotBlank(message = "Missing Field. Message is required")
    private String message;

    @Column( name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationTypes type;

    @ManyToOne( targetEntity = UserModel.class, fetch = FetchType.EAGER)
    @JoinColumn( name = "posted_by", referencedColumnName = "_id")
    private UserModel postedBy;

    @Column( name = "created_at", nullable = false)
    @CreatedDate
    private Date createdAt;

    @Column( name = "update_at", nullable = false)
    @LastModifiedDate
    private Date updateAt;
}
