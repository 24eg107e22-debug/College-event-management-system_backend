package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.dto.DashboardStatsDto;
import com.campusconnect.dto.EventRequest;
import com.campusconnect.dto.EventResponseDto;
import com.campusconnect.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponseDto>>> getAllEvents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "upcoming") String sort
    ) {
        List<EventResponseDto> events = eventService.getAllEvents(search, category, status, sort);
        return ResponseEntity.ok(ApiResponse.ok("Events retrieved successfully", events));
    }

    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<ApiResponse<EventResponseDto>> getEventById(@PathVariable Long id) {
        EventResponseDto event = eventService.getEventById(id);
        return ResponseEntity.ok(ApiResponse.ok("Event retrieved successfully", event));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<EventResponseDto>> createEvent(@Valid @RequestBody EventRequest request) {
        EventResponseDto event = eventService.createEvent(request);
        return ResponseEntity.ok(ApiResponse.ok("Event created successfully!", event));
    }

    @PutMapping("/{id:[0-9]+}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<EventResponseDto>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request
    ) {
        EventResponseDto event = eventService.updateEvent(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Event updated successfully!", event));
    }

    @DeleteMapping("/{id:[0-9]+}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.ok("Event deleted successfully"));
    }

    @PutMapping("/{id:[0-9]+}/cancel")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<EventResponseDto>> cancelEvent(@PathVariable Long id) {
        EventResponseDto event = eventService.cancelEvent(id);
        return ResponseEntity.ok(ApiResponse.ok("Event cancelled successfully", event));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<EventResponseDto>>> getEventsByCategory(@PathVariable String category) {
        List<EventResponseDto> events = eventService.getEventsByCategory(category);
        return ResponseEntity.ok(ApiResponse.ok("Events retrieved for category: " + category, events));
    }

    @GetMapping("/organizer/{organizerId:[0-9]+}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<EventResponseDto>>> getOrganizerEvents(@PathVariable Long organizerId) {
        List<EventResponseDto> events = eventService.getOrganizerEvents(organizerId);
        return ResponseEntity.ok(ApiResponse.ok("Organizer events retrieved successfully", events));
    }

    @GetMapping("/stats/organizer/{organizerId:[0-9]+}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getOrganizerStats(@PathVariable Long organizerId) {
        DashboardStatsDto stats = eventService.getOrganizerStats(organizerId);
        return ResponseEntity.ok(ApiResponse.ok("Organizer stats retrieved successfully", stats));
    }
}
