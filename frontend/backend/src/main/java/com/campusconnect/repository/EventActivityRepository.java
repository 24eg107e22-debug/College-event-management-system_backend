package com.campusconnect.repository;

import com.campusconnect.entity.EventActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventActivityRepository extends JpaRepository<EventActivity, Long> {
    List<EventActivity> findByEventIdOrderByActivityTimeAsc(Long eventId);
    void deleteByEventId(Long eventId);
}
