package com.campusconnect;

import com.campusconnect.dto.AuthResponse;
import com.campusconnect.dto.LoginRequest;
import com.campusconnect.dto.RegisterRequest;
import com.campusconnect.entity.Role;
import com.campusconnect.entity.User;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

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
    private UserRepository userRepository;

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
        String email = "testuser" + System.currentTimeMillis() + "@campusconnect.com";
        RegisterRequest request = new RegisterRequest();
        request.setName("Test Student");
        request.setEmail(email);
        request.setPassword("SecurePass123!");
        request.setConfirmPassword("SecurePass123!");
        request.setRole(Role.STUDENT);
        request.setCollegeId("TEST-" + System.currentTimeMillis());

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
}
