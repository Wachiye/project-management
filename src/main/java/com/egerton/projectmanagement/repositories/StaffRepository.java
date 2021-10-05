package com.egerton.projectmanagement.repositories;

import com.egerton.projectmanagement.models.Staff;
import com.egerton.projectmanagement.models.StaffRoles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    List<Staff> findAllByRole(StaffRoles roles);
}
