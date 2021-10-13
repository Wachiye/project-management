package com.egerton.projectmanagement.repositories;

import com.egerton.projectmanagement.models.Project;
import com.egerton.projectmanagement.models.ProjectCategory;
import com.egerton.projectmanagement.models.Status;
import com.egerton.projectmanagement.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByStudent(Student student);
    List<Project> findAllByStatus(Status status);
    List<Project> findAllByCategory(ProjectCategory category);

}
