package com.egerton.projectmanagement.models;

import java.util.Date;

public class Task {
    private long _id;
    private String name;
    private String description;
    private Date startDate;
    private Date endDate;
    private int pessimisticTime;
    private int optimisticTime;
    private Date startedOn;
    private Date finishedOn;
    private long milestoneId;
    private Status status;
    private Date createdAt;
    private Date updateAt;
}
