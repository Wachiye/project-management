package com.egerton.projectmanagement.repositories;

import com.egerton.projectmanagement.models.Milestone;
import com.egerton.projectmanagement.models.Project;
import com.egerton.projectmanagement.models.Status;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    List<Milestone> findAllByProject(Project project);
    List<Milestone> findAllByStatus(Status status);
}
