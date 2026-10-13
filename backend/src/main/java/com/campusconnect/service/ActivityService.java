package com.campusconnect.service;

import com.campusconnect.dto.ActivityRequest;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventActivity;
import com.campusconnect.entity.Role;
import com.campusconnect.entity.User;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.exception.UnauthorizedException;
import com.campusconnect.repository.EventActivityRepository;
import com.campusconnect.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ActivityService {

    private final EventActivityRepository activityRepository;
    private final EventRepository eventRepository;
    private final AuthService authService;

    public ActivityService(
            EventActivityRepository activityRepository,
            EventRepository eventRepository,
            AuthService authService
    ) {
        this.activityRepository = activityRepository;
        this.eventRepository = eventRepository;
        this.authService = authService;
    }

    @Transactional
    public EventActivity createActivity(ActivityRequest request) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.getEventId()));

        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser.getRole() != Role.ADMIN && !event.getOrganizer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to add activities to this event");
        }

        EventActivity activity = new EventActivity();
        activity.setEvent(event);
        activity.setActivityName(request.getActivityName().trim());
        activity.setDescription(request.getDescription());
        activity.setActivityTime(request.getActivityTime());
        activity.setVenue(request.getVenue());

        return activityRepository.save(activity);
    }

    public List<EventActivity> getActivitiesByEvent(Long eventId) {
        return activityRepository.findByEventIdOrderByActivityTimeAsc(eventId);
    }

    @Transactional
    public EventActivity updateActivity(Long id, ActivityRequest request) {
        EventActivity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));

        User currentUser = authService.getCurrentAuthenticatedUser();
        Event event = activity.getEvent();
        if (currentUser.getRole() != Role.ADMIN && !event.getOrganizer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to update this activity");
        }

        activity.setActivityName(request.getActivityName().trim());
        activity.setDescription(request.getDescription());
        activity.setActivityTime(request.getActivityTime());
        activity.setVenue(request.getVenue());

        return activityRepository.save(activity);
    }

    @Transactional
    public void deleteActivity(Long id) {
        EventActivity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));

        User currentUser = authService.getCurrentAuthenticatedUser();
        Event event = activity.getEvent();
        if (currentUser.getRole() != Role.ADMIN && !event.getOrganizer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this activity");
        }

        activityRepository.delete(activity);
    }
}
