package com.egerton.projectmanagement.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import javax.validation.constraints.Email;
import java.util.Date;
import java.util.List;

@Entity
@Table(name="messages")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Message {
    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private long _id;

    @Column( name="sender_name", nullable=false)
    private String senderName;

    @Column( name="sender_email", nullable=false)
    @Email
    private String senderEmail;

    @Column( name="receiver_name")
    private String receiverName = null;

    @Column( name = "receiver_email")
    private String receiverEmail = null;

    @Column( name="message", columnDefinition = "TEXT")
    private String message;

    @Column( name = "created_at")
    @CreatedDate
    private Date createdAt;

    @OneToMany(mappedBy ="_message",cascade = CascadeType.ALL)
    @JsonIgnoreProperties("_message")
    private List<MessageReply> replies;
}
