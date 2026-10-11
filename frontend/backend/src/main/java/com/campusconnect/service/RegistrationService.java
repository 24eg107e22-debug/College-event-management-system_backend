package com.campusconnect.service;

import com.campusconnect.dto.RegistrationRequest;
import com.campusconnect.dto.RegistrationResponseDto;
import com.campusconnect.entity.*;
import com.campusconnect.exception.BadRequestException;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.exception.UnauthorizedException;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.RegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final AuthService authService;

    public RegistrationService(
            RegistrationRepository registrationRepository,
            EventRepository eventRepository,
            AuthService authService
    ) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.authService = authService;
    }

    @Transactional
    public RegistrationResponseDto registerForEvent(RegistrationRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.getEventId()));

        // Rule 6: Cancelled / Completed events
        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new BadRequestException("Registration failed: This event has been cancelled");
        }
        if (event.getStatus() == EventStatus.COMPLETED) {
            throw new BadRequestException("Registration failed: This event is already completed");
        }

        // Rule 2: Registration deadline
        if (event.getRegistrationDeadline() != null && LocalDate.now().isAfter(event.getRegistrationDeadline())) {
            throw new BadRequestException("Registration closed: The deadline was " + event.getRegistrationDeadline());
        }

        // Rule 3: Max participants capacity
        long currentRegisteredCount = registrationRepository.countByEventIdAndStatusNot(event.getId(), RegistrationStatus.CANCELLED);
        if (event.getMaxParticipants() != null && currentRegisteredCount >= event.getMaxParticipants()) {
            throw new BadRequestException("Registration failed: Event has reached its maximum capacity of " + event.getMaxParticipants() + " participants");
        }

        // Rule 1: Prevent duplicate active registration
        Optional<Registration> existingReg = registrationRepository.findByStudentIdAndEventId(currentUser.getId(), event.getId());
        if (existingReg.isPresent()) {
            Registration reg = existingReg.get();
            if (reg.getStatus() != RegistrationStatus.CANCELLED) {
                throw new BadRequestException("You are already registered for this event");
            } else {
                // Re-activate previously cancelled registration
                reg.setStatus(RegistrationStatus.REGISTERED);
                reg.setRegistrationDate(LocalDateTime.now());
                Registration saved = registrationRepository.save(reg);
                return new RegistrationResponseDto(saved);
            }
        }

        Registration registration = new Registration();
        registration.setStudent(currentUser);
        registration.setEvent(event);
        registration.setRegistrationDate(LocalDateTime.now());
        registration.setStatus(RegistrationStatus.REGISTERED);

        Registration saved = registrationRepository.save(registration);
        return new RegistrationResponseDto(saved);
    }

    public List<RegistrationResponseDto> getMyRegistrations() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        List<Registration> registrations = registrationRepository.findByStudentIdOrderByRegistrationDateDesc(currentUser.getId());
        return registrations.stream()
                .map(RegistrationResponseDto::new)
                .collect(Collectors.toList());
    }

    public List<RegistrationResponseDto> getEventRegistrations(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser.getRole() != Role.ADMIN && !event.getOrganizer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to view participants for this event");
        }

        List<Registration> registrations = registrationRepository.findByEventIdOrderByRegistrationDateDesc(eventId);
        return registrations.stream()
                .map(RegistrationResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelRegistration(Long id) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + id));

        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser.getRole() != Role.ADMIN && !registration.getStudent().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to cancel this registration");
        }

        registration.setStatus(RegistrationStatus.CANCELLED);
        registrationRepository.save(registration);
    }

    @Transactional
    public RegistrationResponseDto updateRegistrationStatus(Long id, RegistrationStatus status) {
        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + id));

        User currentUser = authService.getCurrentAuthenticatedUser();
        Event event = registration.getEvent();

        if (currentUser.getRole() != Role.ADMIN && !event.getOrganizer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to update registration status for this event");
        }

        registration.setStatus(status);
        Registration saved = registrationRepository.save(registration);
        return new RegistrationResponseDto(saved);
    }

    public List<RegistrationResponseDto> getAllRegistrations() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only administrators can view all registrations");
        }
        return registrationRepository.findAll().stream()
                .map(RegistrationResponseDto::new)
                .collect(Collectors.toList());
    }
}
