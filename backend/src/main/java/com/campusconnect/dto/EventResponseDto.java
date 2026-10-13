package com.campusconnect.dto;

import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventActivity;
import com.campusconnect.entity.EventStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class EventResponseDto {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String venue;
    private LocalDate eventDate;
    private String startTime;
    private String endTime;
    private Long organizerId;
    private String organizerName;
    private String organizerEmail;
    private Integer maxParticipants;
    private LocalDate registrationDeadline;
    private String imageUrl;
    private EventStatus status;
    private LocalDateTime createdAt;
    private long registeredCount;
    private long availableSeats;
    private boolean isRegistered;
    private List<EventActivity> activities;

    public EventResponseDto() {}

    public EventResponseDto(Event event, long registeredCount, boolean isRegistered, List<EventActivity> activities) {
        if (event != null) {
            this.id = event.getId();
            this.title = event.getTitle();
            this.description = event.getDescription();
            this.category = event.getCategory();
            this.venue = event.getVenue();
            this.eventDate = event.getEventDate();
            this.startTime = event.getStartTime();
            this.endTime = event.getEndTime();
            if (event.getOrganizer() != null) {
                this.organizerId = event.getOrganizer().getId();
                this.organizerName = event.getOrganizer().getName();
                this.organizerEmail = event.getOrganizer().getEmail();
            }
            this.maxParticipants = event.getMaxParticipants();
            this.registrationDeadline = event.getRegistrationDeadline();
            this.imageUrl = event.getImageUrl();
            this.status = event.getStatus();
            this.createdAt = event.getCreatedAt();
            this.registeredCount = registeredCount;
            this.availableSeats = Math.max(0, (event.getMaxParticipants() != null ? event.getMaxParticipants() : 0) - registeredCount);
            this.isRegistered = isRegistered;
            this.activities = activities;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }

    public String getOrganizerName() {
        return organizerName;
    }

    public void setOrganizerName(String organizerName) {
        this.organizerName = organizerName;
    }

    public String getOrganizerEmail() {
        return organizerEmail;
    }

    public void setOrganizerEmail(String organizerEmail) {
        this.organizerEmail = organizerEmail;
    }

    public Integer getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public LocalDate getRegistrationDeadline() {
        return registrationDeadline;
    }

    public void setRegistrationDeadline(LocalDate registrationDeadline) {
        this.registrationDeadline = registrationDeadline;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public long getRegisteredCount() {
        return registeredCount;
    }

    public void setRegisteredCount(long registeredCount) {
        this.registeredCount = registeredCount;
    }

    public long getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(long availableSeats) {
        this.availableSeats = availableSeats;
    }

    public boolean isRegistered() {
        return isRegistered;
    }

    public void setRegistered(boolean registered) {
        isRegistered = registered;
    }

    public List<EventActivity> getActivities() {
        return activities;
    }

    public void setActivities(List<EventActivity> activities) {
        this.activities = activities;
    }
}
