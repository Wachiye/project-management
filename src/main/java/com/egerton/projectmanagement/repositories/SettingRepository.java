package com.egerton.projectmanagement.repositories;

import com.egerton.projectmanagement.models.Setting;
import com.egerton.projectmanagement.models.SettingCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SettingRepository extends JpaRepository<Setting, Long> {
    List<Setting> findAllByYear(int year);
    Optional<Setting> findSettingByYearAndCategory(int year, SettingCategory setting);
}
