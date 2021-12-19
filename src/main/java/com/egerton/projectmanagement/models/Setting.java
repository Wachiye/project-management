package com.egerton.projectmanagement.models;

import com.egerton.projectmanagement.utils.SettingsUtil;
import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table( name = "settings")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Setting {
    @Id
    @GeneratedValue( strategy = GenerationType.AUTO)
    private long _id;

    @Column( name = "year")
    private int year;

    @Column(name = "setting")
    private SettingCategory category;

    @Column(name = "startDate")
    private Date startDate;

    @Column( name = "endDate")
    private Date endDate;

    @Transient
    private boolean isActive;

    public boolean getIsActive(){
        return SettingsUtil.isActive(this);
    }
}
