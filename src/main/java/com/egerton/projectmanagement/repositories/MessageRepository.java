package com.egerton.projectmanagement.repositories;

import com.egerton.projectmanagement.models.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
