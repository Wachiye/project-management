package com.egerton.projectmanagement.requests;

import lombok.*;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
@Builder
public class SettingRequest {
    private int year;
    private String category;
    private Date startDate;
    private Date endDate;
}
