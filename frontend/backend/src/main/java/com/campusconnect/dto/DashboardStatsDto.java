package com.campusconnect.dto;

import java.util.Map;

public class DashboardStatsDto {
    private long totalUsers;
    private long totalStudents;
    private long totalOrganizers;
    private long totalEvents;
    private long upcomingEvents;
    private long completedEvents;
    private long totalRegistrations;
    private Map<String, Long> eventsByCategory;
    private Map<String, Long> eventStatusCounts;

    public DashboardStatsDto() {}

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalOrganizers() {
        return totalOrganizers;
    }

    public void setTotalOrganizers(long totalOrganizers) {
        this.totalOrganizers = totalOrganizers;
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getUpcomingEvents() {
        return upcomingEvents;
    }

    public void setUpcomingEvents(long upcomingEvents) {
        this.upcomingEvents = upcomingEvents;
    }

    public long getCompletedEvents() {
        return completedEvents;
    }

    public void setCompletedEvents(long completedEvents) {
        this.completedEvents = completedEvents;
    }

    public long getTotalRegistrations() {
        return totalRegistrations;
    }

    public void setTotalRegistrations(long totalRegistrations) {
        this.totalRegistrations = totalRegistrations;
    }

    public Map<String, Long> getEventsByCategory() {
        return eventsByCategory;
    }

    public void setEventsByCategory(Map<String, Long> eventsByCategory) {
        this.eventsByCategory = eventsByCategory;
    }

    public Map<String, Long> getEventStatusCounts() {
        return eventStatusCounts;
    }

    public void setEventStatusCounts(Map<String, Long> eventStatusCounts) {
        this.eventStatusCounts = eventStatusCounts;
    }
}
