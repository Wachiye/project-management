package com.egerton.projectmanagement.repositories;

import com.egerton.projectmanagement.models.Comment;
import com.egerton.projectmanagement.models.Project;
import com.egerton.projectmanagement.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findAllByProject(Project project);
    List<Comment> findAllByStudent( Student student);
}
