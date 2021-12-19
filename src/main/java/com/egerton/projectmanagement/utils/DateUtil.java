package com.egerton.projectmanagement.utils;

import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.TimeUnit;

public class DateUtil {
    public static long getDaysBetween(Date startDate, Date endDate){
        long days = endDate.getTime() - startDate.getTime();
        long daysBetween = TimeUnit.DAYS.convert(days, TimeUnit.MILLISECONDS);
        return daysBetween >= 1? daysBetween : 0;
    }
    public static int thisYear(){
        return Calendar.getInstance().get(Calendar.YEAR);
    }
}
