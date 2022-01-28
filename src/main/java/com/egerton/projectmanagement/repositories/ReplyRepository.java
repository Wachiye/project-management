package com.egerton.projectmanagement.repositories;

import com.egerton.projectmanagement.models.MessageReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReplyRepository extends JpaRepository<MessageReply, Long> {
}
