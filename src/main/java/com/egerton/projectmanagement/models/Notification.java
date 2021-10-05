package com.egerton.projectmanagement.models;

import java.util.Date;

public class Notification {
    private long _id;
    private String title;
    private String message;
    private NotificationTypes type;
    private long staffId;
    private Date createdAt;
    private Date updateAt;
}
