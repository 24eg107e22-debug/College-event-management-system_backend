package com.campusconnect.service;

import com.campusconnect.dto.DashboardStatsDto;
import com.campusconnect.dto.UserDto;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventStatus;
import com.campusconnect.entity.Role;
import com.campusconnect.entity.User;
import com.campusconnect.exception.BadRequestException;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.EventActivityRepository;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.RegistrationRepository;
import com.campusconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final EventActivityRepository activityRepository;

    public UserService(
            UserRepository userRepository,
            EventRepository eventRepository,
            RegistrationRepository registrationRepository,
            EventActivityRepository activityRepository
    ) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.activityRepository = activityRepository;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return new UserDto(user);
    }

    @Transactional
    public UserDto updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            user.setName(dto.getName().trim());
        }
        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone().trim());
        }
        if (dto.getCollegeId() != null && !dto.getCollegeId().trim().isEmpty()) {
            // Check uniqueness if changing
            if (!dto.getCollegeId().equalsIgnoreCase(user.getCollegeId()) &&
                userRepository.existsByCollegeId(dto.getCollegeId().trim())) {
                throw new BadRequestException("College ID is already in use by another user");
            }
            user.setCollegeId(dto.getCollegeId().trim());
        }
        if (dto.getRole() != null) {
            user.setRole(dto.getRole());
        }
        if (dto.getStatus() != null) {
            user.setStatus(dto.getStatus().toUpperCase());
        }

        User updated = userRepository.save(user);
        return new UserDto(updated);
    }

    @Transactional
    public void updateUserStatus(Long id, String status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setStatus(status.toUpperCase());
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Clean up registrations as student
        registrationRepository.deleteByStudentId(id);

        // If organizer, clean up events or activities
        List<Event> organizerEvents = eventRepository.findByOrganizerIdOrderByCreatedAtDesc(id);
        for (Event event : organizerEvents) {
            activityRepository.deleteByEventId(event.getId());
            registrationRepository.deleteByEventId(event.getId());
            eventRepository.delete(event);
        }

        userRepository.delete(user);
    }

    public DashboardStatsDto getAdminStats() {
        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalStudents(userRepository.countByRole(Role.STUDENT));
        stats.setTotalOrganizers(userRepository.countByRole(Role.ORGANIZER));
        stats.setTotalEvents(eventRepository.count());
        stats.setTotalRegistrations(registrationRepository.count());
        stats.setUpcomingEvents(eventRepository.countByStatus(EventStatus.UPCOMING));
        stats.setCompletedEvents(eventRepository.countByStatus(EventStatus.COMPLETED));

        // Category breakdown
        Map<String, Long> categoryMap = new HashMap<>();
        List<Event> allEvents = eventRepository.findAll();
        for (Event e : allEvents) {
            String cat = e.getCategory() != null ? e.getCategory() : "Other";
            categoryMap.put(cat, categoryMap.getOrDefault(cat, 0L) + 1);
        }
        stats.setEventsByCategory(categoryMap);

        // Status breakdown
        Map<String, Long> statusMap = new HashMap<>();
        for (EventStatus s : EventStatus.values()) {
            statusMap.put(s.name(), eventRepository.countByStatus(s));
        }
        stats.setEventStatusCounts(statusMap);

        return stats;
    }
}
