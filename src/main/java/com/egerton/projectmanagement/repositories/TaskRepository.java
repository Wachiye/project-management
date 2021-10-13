package com.egerton.projectmanagement.repositories;

import com.egerton.projectmanagement.models.Milestone;
import com.egerton.projectmanagement.models.Status;
import com.egerton.projectmanagement.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByMilestone( Milestone milestone);
    List<Task> findAllByStatus(Status status);
}
