package org.example.chat_app.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chat_app.dto.request.LogInRequest;
import org.example.chat_app.dto.response.TokenResponse;
import org.example.chat_app.service.KeycloakAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final KeycloakAdminService keycloakAdminService;

    @GetMapping("/admin")
    public Mono<String> getAdminToken() {
        return keycloakAdminService.getToken();
    }
}
