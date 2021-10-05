package com.egerton.projectmanagement.repositories;

import com.egerton.projectmanagement.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

}
