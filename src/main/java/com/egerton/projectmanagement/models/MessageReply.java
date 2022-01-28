package com.egerton.projectmanagement.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="replies")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MessageReply {
    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private long _id;

    @Column( name="reply", columnDefinition = "TEXT")
    private String reply;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="user_id", referencedColumnName = "_id")
    private UserModel repliedBy;

    @ManyToOne
    @JoinColumn(name = "message_id", referencedColumnName = "_id")
    @JsonIgnoreProperties("replies")
    private Message _message;

    @Column( name = "created_at")
    @CreatedDate
    private Date createdAt;
}
