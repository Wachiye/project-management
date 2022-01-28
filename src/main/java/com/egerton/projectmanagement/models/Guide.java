package com.egerton.projectmanagement.models;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "guides")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Guide {

    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private long _id;

    @Column(name="title",nullable = false)
    private String title;

    @Column(name="content",nullable = false, columnDefinition = "TEXT")
    private String content;

    @OneToOne
    @JoinColumn(name="created_by", referencedColumnName = "_id")
    private Staff createdBy;

    @Column( name = "created_at", nullable = false)
    @CreatedDate
    private Date createdAt;

    @Column( name = "update_at", nullable = false)
    @LastModifiedDate
    private Date updateAt;
}
