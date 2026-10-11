package com.campusconnect.repository;

import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByOrganizerIdOrderByCreatedAtDesc(Long organizerId);
    List<Event> findByCategoryIgnoreCaseOrderByEventDateAsc(String category);
    List<Event> findByStatusOrderByEventDateAsc(EventStatus status);
    long countByStatus(EventStatus status);
    long countByOrganizerId(Long organizerId);

    @Query("SELECT e FROM Event e WHERE " +
           "(:keyword IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(e.venue) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:category IS NULL OR LOWER(e.category) = LOWER(:category)) AND " +
           "(:status IS NULL OR e.status = :status) " +
           "ORDER BY e.eventDate ASC")
    List<Event> searchEvents(@Param("keyword") String keyword,
                             @Param("category") String category,
                             @Param("status") EventStatus status);
}
