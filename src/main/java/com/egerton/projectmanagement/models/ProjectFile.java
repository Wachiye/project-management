package com.egerton.projectmanagement.models;

import java.util.Date;

public class ProjectFile {
    private long _id;
    private String name;
    private String description;
    private String fileURL;
    private long projectId;
    private long studentId;
    private Status status;
    private Date createdAt;
    private Date updateAt;
}
