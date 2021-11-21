package com.egerton.projectmanagement.repositories;

import com.egerton.projectmanagement.models.Login;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginRepository extends JpaRepository<Login, Long> {
    Optional<Login> findLoginByEmail( String email);
    Optional<Login> findLoginByToken(String token);
}
