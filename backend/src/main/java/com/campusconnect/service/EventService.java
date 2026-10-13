package com.campusconnect.service;

import com.campusconnect.dto.DashboardStatsDto;
import com.campusconnect.dto.EventRequest;
import com.campusconnect.dto.EventResponseDto;
import com.campusconnect.entity.*;
import com.campusconnect.exception.BadRequestException;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.exception.UnauthorizedException;
import com.campusconnect.repository.EventActivityRepository;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.RegistrationRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final EventActivityRepository activityRepository;
    private final AuthService authService;

    public EventService(
            EventRepository eventRepository,
            RegistrationRepository registrationRepository,
            EventActivityRepository activityRepository,
            AuthService authService
    ) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.activityRepository = activityRepository;
        this.authService = authService;
    }

    public List<EventResponseDto> getAllEvents(String keyword, String category, String status, String sort) {
        EventStatus eventStatus = null;
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            try {
                eventStatus = EventStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String searchCategory = (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) ? category.trim() : null;

        List<Event> events = eventRepository.searchEvents(searchKeyword, searchCategory, eventStatus);

        Long currentUserId = getCurrentUserIdSafe();

        List<EventResponseDto> dtoList = events.stream().map(event -> {
            long regCount = registrationRepository.countByEventIdAndStatusNot(event.getId(), RegistrationStatus.CANCELLED);
            boolean isRegistered = false;
            if (currentUserId != null) {
                isRegistered = registrationRepository.existsByStudentIdAndEventIdAndStatusNot(
                        currentUserId, event.getId(), RegistrationStatus.CANCELLED
                );
            }
            return new EventResponseDto(event, regCount, isRegistered, null);
        }).collect(Collectors.toList());

        // Sort options
        if ("popular".equalsIgnoreCase(sort)) {
            dtoList.sort((a, b) -> Long.compare(b.getRegisteredCount(), a.getRegisteredCount()));
        } else if ("latest".equalsIgnoreCase(sort)) {
            dtoList.sort((a, b) -> {
                if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
                return b.getCreatedAt().compareTo(a.getCreatedAt());
            });
        } else {
            // default: upcoming / eventDate ascending
            dtoList.sort((a, b) -> {
                if (a.getEventDate() == null || b.getEventDate() == null) return 0;
                return a.getEventDate().compareTo(b.getEventDate());
            });
        }

        return dtoList;
    }

    public EventResponseDto getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        long regCount = registrationRepository.countByEventIdAndStatusNot(id, RegistrationStatus.CANCELLED);
        Long currentUserId = getCurrentUserIdSafe();
        boolean isRegistered = false;
        if (currentUserId != null) {
            isRegistered = registrationRepository.existsByStudentIdAndEventIdAndStatusNot(
                    currentUserId, id, RegistrationStatus.CANCELLED
            );
        }

        List<EventActivity> activities = activityRepository.findByEventIdOrderByActivityTimeAsc(id);

        return new EventResponseDto(event, regCount, isRegistered, activities);
    }

    @Transactional
    public EventResponseDto createEvent(EventRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser.getRole() == Role.STUDENT) {
            throw new UnauthorizedException("Students are not permitted to create events");
        }

        if (request.getRegistrationDeadline().isAfter(request.getEventDate())) {
            throw new BadRequestException("Registration deadline cannot be after the event date");
        }

        Event event = new Event();
        event.setTitle(request.getTitle().trim());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory().trim());
        event.setVenue(request.getVenue().trim());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setOrganizer(currentUser);
        event.setMaxParticipants(request.getMaxParticipants());
        event.setRegistrationDeadline(request.getRegistrationDeadline());
        event.setImageUrl(request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()
                ? request.getImageUrl().trim()
                : getDefaultImage(request.getCategory()));
        event.setStatus(request.getStatus() != null ? request.getStatus() : EventStatus.UPCOMING);
        event.setCreatedAt(LocalDateTime.now());

        Event savedEvent = eventRepository.save(event);
        return new EventResponseDto(savedEvent, 0, false, new ArrayList<>());
    }

    @Transactional
    public EventResponseDto updateEvent(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        User currentUser = authService.getCurrentAuthenticatedUser();
        checkOwnershipOrAdmin(event, currentUser);

        if (request.getRegistrationDeadline().isAfter(request.getEventDate())) {
            throw new BadRequestException("Registration deadline cannot be after the event date");
        }

        event.setTitle(request.getTitle().trim());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory().trim());
        event.setVenue(request.getVenue().trim());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setRegistrationDeadline(request.getRegistrationDeadline());
        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            event.setImageUrl(request.getImageUrl().trim());
        }
        if (request.getStatus() != null) {
            event.setStatus(request.getStatus());
        }

        Event updated = eventRepository.save(event);
        long regCount = registrationRepository.countByEventIdAndStatusNot(id, RegistrationStatus.CANCELLED);
        List<EventActivity> activities = activityRepository.findByEventIdOrderByActivityTimeAsc(id);
        return new EventResponseDto(updated, regCount, false, activities);
    }

    @Transactional
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        User currentUser = authService.getCurrentAuthenticatedUser();
        checkOwnershipOrAdmin(event, currentUser);

        activityRepository.deleteByEventId(id);
        registrationRepository.deleteByEventId(id);
        eventRepository.delete(event);
    }

    @Transactional
    public EventResponseDto cancelEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        User currentUser = authService.getCurrentAuthenticatedUser();
        checkOwnershipOrAdmin(event, currentUser);

        event.setStatus(EventStatus.CANCELLED);
        Event updated = eventRepository.save(event);
        long regCount = registrationRepository.countByEventIdAndStatusNot(id, RegistrationStatus.CANCELLED);
        return new EventResponseDto(updated, regCount, false, activityRepository.findByEventIdOrderByActivityTimeAsc(id));
    }

    public List<EventResponseDto> getEventsByCategory(String category) {
        List<Event> events = eventRepository.findByCategoryIgnoreCaseOrderByEventDateAsc(category);
        Long currentUserId = getCurrentUserIdSafe();

        return events.stream().map(event -> {
            long regCount = registrationRepository.countByEventIdAndStatusNot(event.getId(), RegistrationStatus.CANCELLED);
            boolean isRegistered = false;
            if (currentUserId != null) {
                isRegistered = registrationRepository.existsByStudentIdAndEventIdAndStatusNot(
                        currentUserId, event.getId(), RegistrationStatus.CANCELLED
                );
            }
            return new EventResponseDto(event, regCount, isRegistered, null);
        }).collect(Collectors.toList());
    }

    public List<EventResponseDto> getOrganizerEvents(Long organizerId) {
        List<Event> events = eventRepository.findByOrganizerIdOrderByCreatedAtDesc(organizerId);
        return events.stream().map(event -> {
            long regCount = registrationRepository.countByEventIdAndStatusNot(event.getId(), RegistrationStatus.CANCELLED);
            return new EventResponseDto(event, regCount, false, null);
        }).collect(Collectors.toList());
    }

    public DashboardStatsDto getOrganizerStats(Long organizerId) {
        List<Event> events = eventRepository.findByOrganizerIdOrderByCreatedAtDesc(organizerId);
        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalEvents(events.size());

        long upcoming = 0;
        long completed = 0;
        long totalRegs = 0;

        for (Event e : events) {
            if (e.getStatus() == EventStatus.UPCOMING) upcoming++;
            if (e.getStatus() == EventStatus.COMPLETED) completed++;
            totalRegs += registrationRepository.countByEventIdAndStatusNot(e.getId(), RegistrationStatus.CANCELLED);
        }

        stats.setUpcomingEvents(upcoming);
        stats.setCompletedEvents(completed);
        stats.setTotalRegistrations(totalRegs);

        return stats;
    }

    private void checkOwnershipOrAdmin(Event event, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return;
        }
        if (!event.getOrganizer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to modify this event");
        }
    }

    private Long getCurrentUserIdSafe() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                return authService.getCurrentAuthenticatedUser().getId();
            }
        } catch (Exception ignored) {}
        return null;
    }

    private String getDefaultImage(String category) {
        if (category == null) return "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80";
        return switch (category.toLowerCase()) {
            case "technical" -> "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80";
            case "cultural" -> "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80";
            case "sports" -> "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80";
            case "workshop" -> "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80";
            case "seminar" -> "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80";
            case "competition" -> "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80";
            case "fest" -> "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80";
            default -> "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80";
        };
    }
}
