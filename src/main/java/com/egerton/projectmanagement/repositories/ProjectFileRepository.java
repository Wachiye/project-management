package com.egerton.projectmanagement.repositories;

import com.egerton.projectmanagement.models.Project;
import com.egerton.projectmanagement.models.ProjectFile;
import com.egerton.projectmanagement.models.Status;
import com.egerton.projectmanagement.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectFileRepository extends JpaRepository<ProjectFile, Long> {
    List<ProjectFile> findAllByProject( Project project);
    List<ProjectFile> findAllByStatus( Status status);
}
