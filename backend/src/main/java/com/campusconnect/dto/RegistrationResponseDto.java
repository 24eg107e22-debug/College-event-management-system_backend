package com.campusconnect.dto;

import com.campusconnect.entity.Registration;
import com.campusconnect.entity.RegistrationStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class RegistrationResponseDto {
    private Long id;
    private LocalDateTime registrationDate;
    private RegistrationStatus status;

    // Student info
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private String collegeId;

    // Event info
    private Long eventId;
    private String eventTitle;
    private String category;
    private String venue;
    private LocalDate eventDate;
    private String startTime;
    private String eventStatus;
    private String imageUrl;

    public RegistrationResponseDto() {}

    public RegistrationResponseDto(Registration reg) {
        if (reg != null) {
            this.id = reg.getId();
            this.registrationDate = reg.getRegistrationDate();
            this.status = reg.getStatus();

            if (reg.getStudent() != null) {
                this.studentId = reg.getStudent().getId();
                this.studentName = reg.getStudent().getName();
                this.studentEmail = reg.getStudent().getEmail();
                this.studentPhone = reg.getStudent().getPhone();
                this.collegeId = reg.getStudent().getCollegeId();
            }

            if (reg.getEvent() != null) {
                this.eventId = reg.getEvent().getId();
                this.eventTitle = reg.getEvent().getTitle();
                this.category = reg.getEvent().getCategory();
                this.venue = reg.getEvent().getVenue();
                this.eventDate = reg.getEvent().getEventDate();
                this.startTime = reg.getEvent().getStartTime();
                this.eventStatus = reg.getEvent().getStatus() != null ? reg.getEvent().getStatus().name() : null;
                this.imageUrl = reg.getEvent().getImageUrl();
            }
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }

    public RegistrationStatus getStatus() {
        return status;
    }

    public void setStatus(RegistrationStatus status) {
        this.status = status;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getStudentPhone() {
        return studentPhone;
    }

    public void setStudentPhone(String studentPhone) {
        this.studentPhone = studentPhone;
    }

    public String getCollegeId() {
        return collegeId;
    }

    public void setCollegeId(String collegeId) {
        this.collegeId = collegeId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
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

    public String getEventStatus() {
        return eventStatus;
    }

    public void setEventStatus(String eventStatus) {
        this.eventStatus = eventStatus;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
