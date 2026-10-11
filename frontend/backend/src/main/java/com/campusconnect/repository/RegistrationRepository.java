package com.campusconnect.repository;

import com.campusconnect.entity.Registration;
import com.campusconnect.entity.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByStudentIdOrderByRegistrationDateDesc(Long studentId);
    List<Registration> findByEventIdOrderByRegistrationDateDesc(Long eventId);
    Optional<Registration> findByStudentIdAndEventId(Long studentId, Long eventId);
    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);
    boolean existsByStudentIdAndEventIdAndStatusNot(Long studentId, Long eventId, RegistrationStatus status);
    long countByEventIdAndStatusNot(Long eventId, RegistrationStatus status);
    long countByEventId(Long eventId);
    long countByStudentId(Long studentId);
    void deleteByStudentId(Long studentId);
    void deleteByEventId(Long eventId);
}
