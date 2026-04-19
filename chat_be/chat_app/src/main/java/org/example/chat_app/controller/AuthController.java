package org.example.chat_app.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chat_app.dto.request.LogInRequest;
import org.example.chat_app.dto.request.SignUpRequest;
import org.example.chat_app.dto.response.TokenResponse;
import org.example.chat_app.service.KeycloakService;
import org.example.chat_app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final KeycloakService keycloakService;
    private final UserService userSyncService;

    @PostMapping("/login")
    public Mono<ResponseEntity<TokenResponse>> login(@RequestBody LogInRequest request) {
        return keycloakService.login(request.getUsername(), request.getPassword())
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.status(401).build()));
    }

    @PostMapping("/register")
    public Mono<ResponseEntity<Void>> register(@RequestBody SignUpRequest request) {
        return keycloakService.register(request)
                .thenReturn(ResponseEntity.ok().<Void>build())
                .onErrorResume(e -> {
                    e.printStackTrace();
                    return Mono.just(ResponseEntity.<Void>badRequest().build());
                });
    }


    /**
     * Lấy thông tin user hiện tại từ token Keycloak
     */
    @GetMapping("/me")
    public Mono<Map<String, Object>> me(JwtAuthenticationToken auth) {
        return userSyncService.syncUserFromKeycloak(auth)
                .map(user -> {
                    Map<String, Object> result = new LinkedHashMap<>();
                    if (user.getUserId() != null) result.put("user_id", user.getUserId());
                    if (user.getUsername() != null) result.put("username", user.getUsername());
                    if (user.getEmail() != null) result.put("email", user.getEmail());
                    if (user.getRoles() != null && !user.getRoles().isEmpty()) result.put("roles", user.getRoles());
                    return result;
                });

    }
}
