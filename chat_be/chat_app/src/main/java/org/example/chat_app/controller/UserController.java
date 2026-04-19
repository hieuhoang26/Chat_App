package org.example.chat_app.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
public class UserController {

    @GetMapping("/hi")
    public Mono<Map<String, Object>> me(Authentication authentication) {
        System.out.println(authentication);
        if (authentication == null) {
            return Mono.just(Map.of("authenticated", false));
        }
        return Mono.just(Map.of(
                "authenticated", authentication.isAuthenticated(),
                "name", authentication.getName(),
                "authorities", authentication.getAuthorities()
        ));
    }
}