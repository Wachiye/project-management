package com.egerton.projectmanagement.models;

import java.util.Date;

public class Comment {
    private long _id;
    private String message;
    private long projectId;
    private long staffId;
    private long studentId;
    private Date createdAt;
    private Date updateAt;
}
