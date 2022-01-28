package com.egerton.projectmanagement.repositories;

import com.egerton.projectmanagement.models.Guide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuideRepository extends JpaRepository<Guide, Long> {
}
