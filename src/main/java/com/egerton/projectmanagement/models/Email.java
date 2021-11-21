package com.egerton.projectmanagement.models;

import lombok.*;

import java.util.ArrayList;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Data
public class Email {
    private String from;
    private String senderName;
    private String to;
    private String subject;
    private String text;
    private ArrayList<String> attachments;
}
