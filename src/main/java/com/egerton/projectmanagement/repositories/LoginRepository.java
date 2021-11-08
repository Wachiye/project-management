package com.egerton.projectmanagement.repositories;

import com.egerton.projectmanagement.models.Login;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoginRepository extends JpaRepository<Login, Long> {

}
