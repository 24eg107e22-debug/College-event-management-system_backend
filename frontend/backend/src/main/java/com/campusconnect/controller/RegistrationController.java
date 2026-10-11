package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.dto.RegistrationRequest;
import com.campusconnect.dto.RegistrationResponseDto;
import com.campusconnect.entity.RegistrationStatus;
import com.campusconnect.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RegistrationResponseDto>> registerForEvent(@Valid @RequestBody RegistrationRequest request) {
        RegistrationResponseDto registration = registrationService.registerForEvent(request);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful!", registration));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<RegistrationResponseDto>>> getMyRegistrations() {
        List<RegistrationResponseDto> myRegistrations = registrationService.getMyRegistrations();
        return ResponseEntity.ok(ApiResponse.ok("My registrations retrieved successfully", myRegistrations));
    }

    @GetMapping("/event/{eventId:[0-9]+}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<RegistrationResponseDto>>> getEventRegistrations(@PathVariable Long eventId) {
        List<RegistrationResponseDto> registrations = registrationService.getEventRegistrations(eventId);
        return ResponseEntity.ok(ApiResponse.ok("Event participants retrieved successfully", registrations));
    }

    @DeleteMapping("/{id:[0-9]+}")
    public ResponseEntity<ApiResponse<Void>> cancelRegistration(@PathVariable Long id) {
        registrationService.cancelRegistration(id);
        return ResponseEntity.ok(ApiResponse.ok("Registration cancelled successfully"));
    }

    @PutMapping("/{id:[0-9]+}/status")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<RegistrationResponseDto>> updateRegistrationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusBody
    ) {
        String statusStr = statusBody.get("status");
        RegistrationStatus status = RegistrationStatus.valueOf(statusStr.toUpperCase());
        RegistrationResponseDto updated = registrationService.updateRegistrationStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Registration status updated to " + status, updated));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RegistrationResponseDto>>> getAllRegistrations() {
        List<RegistrationResponseDto> all = registrationService.getAllRegistrations();
        return ResponseEntity.ok(ApiResponse.ok("All registrations retrieved successfully", all));
    }
}
