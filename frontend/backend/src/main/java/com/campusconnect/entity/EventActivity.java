package com.campusconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "event_activities")
public class EventActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "activity_name", nullable = false, length = 150)
    private String activityName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "activity_time", length = 50)
    private String activityTime;

    @Column(length = 150)
    private String venue;

    public EventActivity() {
    }

    public EventActivity(Long id, Event event, String activityName, String description, String activityTime, String venue) {
        this.id = id;
        this.event = event;
        this.activityName = activityName;
        this.description = description;
        this.activityTime = activityTime;
        this.venue = venue;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getActivityTime() {
        return activityTime;
    }

    public void setActivityTime(String activityTime) {
        this.activityTime = activityTime;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }
}
