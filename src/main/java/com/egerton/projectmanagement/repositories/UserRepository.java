package com.egerton.projectmanagement.repositories;

import com.egerton.projectmanagement.models.UserModel;
import com.egerton.projectmanagement.models.UserRoles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserModel, Long> {
    Optional<UserModel> findUserByEmail(String email);

    List<UserModel> findAllByRole(UserRoles roles);

    Optional<UserModel> findUserModelByVerificationCode(String verificationCode);
}