package com.campusconnect;

import com.campusconnect.dto.*;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.Registration;
import com.campusconnect.entity.RegistrationStatus;
import com.campusconnect.entity.Role;
import com.campusconnect.entity.User;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.RegistrationRepository;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.service.AuthService;
import com.campusconnect.service.EventService;
import com.campusconnect.service.RegistrationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class CampusConnectIntegrationTests {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private AuthService authService;

    @Autowired
    private EventService eventService;

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    @Test
    @DisplayName("1. Health Endpoint Check")
    public void testHealthEndpoint() {
        String url = "http://localhost:" + port + "/api/health";
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("UP", response.getBody().get("status"));
        assertEquals("CampusConnect Backend API", response.getBody().get("service"));
    }

    @Test
    @DisplayName("2. User Registration and Persistence in Database")
    public void testUserRegistrationAndPersistence() {
        String email = "teststudent" + System.currentTimeMillis() + "@campusconnect.com";
        RegisterRequest request = new RegisterRequest();
        request.setName("Test Student");
        request.setEmail(email);
        request.setPassword("SecurePass123!");
        request.setConfirmPassword("SecurePass123!");
        request.setRole(Role.STUDENT);
        request.setCollegeId("STU-" + System.currentTimeMillis());

        AuthResponse authResponse = authService.register(request);

        assertNotNull(authResponse);
        assertNotNull(authResponse.getToken());
        assertEquals(email, authResponse.getEmail());

        // Verify direct database persistence
        User persisted = userRepository.findByEmail(email).orElse(null);
        assertNotNull(persisted, "User must be persisted in database");
        assertEquals("Test Student", persisted.getName());
        assertEquals("ACTIVE", persisted.getStatus());
        assertEquals(Role.STUDENT, persisted.getRole());
    }

    @Test
    @DisplayName("3. User Login Authentication Flow")
    public void testUserLogin() {
        String email = "logintest" + System.currentTimeMillis() + "@campusconnect.com";
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setName("Login Tester");
        registerReq.setEmail(email);
        registerReq.setPassword("Password123!");
        registerReq.setConfirmPassword("Password123!");
        registerReq.setRole(Role.STUDENT);
        authService.register(registerReq);

        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail(email);
        loginReq.setPassword("Password123!");

        AuthResponse loginRes = authService.login(loginReq);
        assertNotNull(loginRes);
        assertNotNull(loginRes.getToken());
        assertEquals(email, loginRes.getEmail());
    }

    @Test
    @DisplayName("4. Public Events Listing Endpoint")
    public void testGetEventsEndpoint() {
        String url = "http://localhost:" + port + "/api/events?status=UPCOMING";
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue((Boolean) response.getBody().get("success"));
        assertNotNull(response.getBody().get("data"));
    }

    @Test
    @DisplayName("5. Event Creation and Database Persistence Flow")
    public void testEventCreationAndPersistence() {
        // Create an organizer
        String organizerEmail = "org" + System.currentTimeMillis() + "@campusconnect.com";
        RegisterRequest orgReq = new RegisterRequest();
        orgReq.setName("Prof. Organizer");
        orgReq.setEmail(organizerEmail);
        orgReq.setPassword("Password123!");
        orgReq.setConfirmPassword("Password123!");
        orgReq.setRole(Role.ORGANIZER);
        orgReq.setCollegeId("ORG-" + System.currentTimeMillis());
        authService.register(orgReq);

        // Set security context for organizer
        User orgUser = userRepository.findByEmail(organizerEmail).orElseThrow();
        org.springframework.security.core.userdetails.UserDetails userDetails =
                org.springframework.security.core.userdetails.User
                        .withUsername(orgUser.getEmail())
                        .password(orgUser.getPassword())
                        .authorities("ROLE_ORGANIZER")
                        .build();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities())
        );

        // Create an event
        EventRequest eventReq = new EventRequest();
        eventReq.setTitle("Automated Test Hackathon " + System.currentTimeMillis());
        eventReq.setDescription("Annual test coding hackathon event");
        eventReq.setCategory("Technical");
        eventReq.setVenue("CS Lab 1");
        eventReq.setEventDate(LocalDate.now().plusDays(10));
        eventReq.setStartTime("09:00 AM");
        eventReq.setEndTime("05:00 PM");
        eventReq.setMaxParticipants(50);
        eventReq.setRegistrationDeadline(LocalDate.now().plusDays(8));

        EventResponseDto createdEvent = eventService.createEvent(eventReq);
        assertNotNull(createdEvent);
        assertNotNull(createdEvent.getId());

        // Verify entity persisted in database
        Event dbEvent = eventRepository.findById(createdEvent.getId()).orElse(null);
        assertNotNull(dbEvent);
        assertEquals(eventReq.getTitle(), dbEvent.getTitle());
        assertEquals("Technical", dbEvent.getCategory());
        assertEquals(50, dbEvent.getMaxParticipants());
    }

    @Test
    @DisplayName("6. Student Event Registration and Persistence Flow")
    public void testStudentRegistrationForEvent() {
        // Create an organizer and an event
        String organizerEmail = "org_reg_" + System.currentTimeMillis() + "@campusconnect.com";
        RegisterRequest orgReq = new RegisterRequest();
        orgReq.setName("Event Host");
        orgReq.setEmail(organizerEmail);
        orgReq.setPassword("Password123!");
        orgReq.setRole(Role.ORGANIZER);
        authService.register(orgReq);

        User orgUser = userRepository.findByEmail(organizerEmail).orElseThrow();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(orgUser.getEmail(), null, java.util.List.of())
        );

        EventRequest eventReq = new EventRequest();
        eventReq.setTitle("Sports Championship " + System.currentTimeMillis());
        eventReq.setCategory("Sports");
        eventReq.setVenue("Campus Ground");
        eventReq.setEventDate(LocalDate.now().plusDays(15));
        eventReq.setRegistrationDeadline(LocalDate.now().plusDays(12));
        eventReq.setMaxParticipants(100);
        EventResponseDto createdEvent = eventService.createEvent(eventReq);

        // Create a student and set auth context
        String studentEmail = "stu_reg_" + System.currentTimeMillis() + "@campusconnect.com";
        RegisterRequest stuReq = new RegisterRequest();
        stuReq.setName("Athletic Student");
        stuReq.setEmail(studentEmail);
        stuReq.setPassword("Password123!");
        stuReq.setRole(Role.STUDENT);
        authService.register(stuReq);

        User stuUser = userRepository.findByEmail(studentEmail).orElseThrow();
        org.springframework.security.core.userdetails.UserDetails stuDetails =
                org.springframework.security.core.userdetails.User
                        .withUsername(stuUser.getEmail())
                        .password(stuUser.getPassword())
                        .authorities("ROLE_STUDENT")
                        .build();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(stuDetails, null, stuDetails.getAuthorities())
        );

        // Register student for event
        RegistrationRequest regReq = new RegistrationRequest(createdEvent.getId());
        RegistrationResponseDto regResponse = registrationService.registerForEvent(regReq);

        assertNotNull(regResponse);
        assertEquals(createdEvent.getId(), regResponse.getEventId());
        assertEquals(RegistrationStatus.REGISTERED, regResponse.getStatus());

        // Verify record in registrations table
        Registration dbReg = registrationRepository.findByStudentIdAndEventId(stuUser.getId(), createdEvent.getId()).orElse(null);
        assertNotNull(dbReg);
        assertEquals(RegistrationStatus.REGISTERED, dbReg.getStatus());
    }
}
