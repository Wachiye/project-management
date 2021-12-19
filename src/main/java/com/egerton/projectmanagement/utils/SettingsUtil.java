package com.egerton.projectmanagement.utils;

import com.egerton.projectmanagement.models.Setting;
import java.util.Date;

public class SettingsUtil {
    public static boolean isActive(Setting setting){
       long days = DateUtil.getDaysBetween( setting.getStartDate(), new Date());
       long daysLeft = DateUtil.getDaysBetween( new Date(), setting.getEndDate());
        return days >= 1 && daysLeft >= 1;
    }
}
