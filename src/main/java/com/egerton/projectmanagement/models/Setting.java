package com.egerton.projectmanagement.models;

import com.egerton.projectmanagement.utils.SettingsUtil;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
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
    @NotNull(message = "Missing field. Setting category is required.")
    @Enumerated(EnumType.STRING)
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
