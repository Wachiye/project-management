package com.egerton.projectmanagement.repositories;

import com.egerton.projectmanagement.models.*;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByStudent(Student student);
    List<Project> findAllByStatus(Status status);
    List<Project> findAllByCategory(ProjectCategory category);
    List<Project> findAllByEvaluator(Staff evaluator);
    List<Project> findAllBySupervisor(Staff supervisor);

}
