package com.egerton.projectmanagement.repositories;

import com.egerton.projectmanagement.models.Notification;
import com.egerton.projectmanagement.models.NotificationTypes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByType(NotificationTypes types);
}
