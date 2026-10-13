package com.campusconnect.controller;

import com.campusconnect.dto.ActivityRequest;
import com.campusconnect.dto.ApiResponse;
import com.campusconnect.entity.EventActivity;
import com.campusconnect.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<EventActivity>> createActivity(@Valid @RequestBody ActivityRequest request) {
        EventActivity activity = activityService.createActivity(request);
        return ResponseEntity.ok(ApiResponse.ok("Activity added successfully", activity));
    }

    @GetMapping("/event/{eventId:[0-9]+}")
    public ResponseEntity<ApiResponse<List<EventActivity>>> getActivitiesByEvent(@PathVariable Long eventId) {
        List<EventActivity> activities = activityService.getActivitiesByEvent(eventId);
        return ResponseEntity.ok(ApiResponse.ok("Activities retrieved successfully", activities));
    }

    @PutMapping("/{id:[0-9]+}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<EventActivity>> updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody ActivityRequest request
    ) {
        EventActivity activity = activityService.updateActivity(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Activity updated successfully", activity));
    }

    @DeleteMapping("/{id:[0-9]+}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
        return ResponseEntity.ok(ApiResponse.ok("Activity deleted successfully"));
    }
}
