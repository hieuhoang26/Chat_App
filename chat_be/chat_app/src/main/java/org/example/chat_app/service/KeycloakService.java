package org.example.chat_app.service;

import lombok.RequiredArgsConstructor;
import org.example.chat_app.dto.request.SignUpRequest;
import org.example.chat_app.dto.response.TokenResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class KeycloakService {

    private final KeycloakAdminService keycloakAdminService;
    private final WebClient webClient = WebClient.builder().build();

    private final String authServerUrl = "http://localhost:8080";
    private final String realm = "chat-app";

    @Value("${spring.security.oauth2.client.registration.keycloak.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.keycloak.client-secret}")
    private String clientSecret;

    /**
     * Login -> JWT token
     */
    public Mono<TokenResponse> login(String username, String password){
        return webClient.post()
                .uri(authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters
                        .fromFormData("grant_type", "password")
                        .with("client_id", clientId)
                        .with("client_secret", clientSecret)
                        .with("scope","openid")
                        .with("username", username)
                        .with("password", password))
                .retrieve()
                .bodyToMono(TokenResponse.class);
    }

    public Mono<Void> register(SignUpRequest req) {
        return createUser(req)
                .then(findUserId(req.getUsername()))
                .flatMap(userId -> assignDefaultRole(userId,"User"))
                .then();
    }

    public Mono<Void> createUser(SignUpRequest req) {
        Map<String, Object> userPayload = Map.of(
                "username", req.getUsername(),
                "email", req.getEmail(),
                "enabled", true,
                "firstName", req.getFirstName(),
                "lastName", req.getLastName(),
                "credentials", List.of(
                        Map.of(
                                "type", "password",
                                "value", req.getPassword(),
                                "temporary", false
                        )
                )
        );
        return keycloakAdminService.getToken()
                .flatMap(token ->
                        webClient.post()
                                .uri(authServerUrl + "/admin/realms/" + realm + "/users")
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                                .contentType(MediaType.APPLICATION_JSON)
                                .bodyValue(userPayload)
                                .retrieve()
                                .toBodilessEntity()  // bỏ body
                                .then()
                );
    }


    private Mono<String> findUserId(String username) {
        return keycloakAdminService.getToken()
                .flatMap(token ->
                        webClient.get()
                                .uri(uriBuilder -> uriBuilder
                                        .scheme("http")
                                        .host("localhost")
                                        .port(8080)
                                        .path("/admin/realms/" + realm + "/users")
                                        .queryParam("username", username)
                                        .build()
                                )
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                                .retrieve()
                                .bodyToFlux(Map.class)
                                .single() // nếu username là unique
                                .map(user -> (String) user.get("id"))
                );
    }
    private Mono<Void> assignDefaultRole(String userId, String roleName) {
        return keycloakAdminService.getToken()
                .flatMap(token ->
                        // 3.1 get role detail
                        webClient.get()
                                .uri(authServerUrl + "/admin/realms/" + realm + "/roles/" + roleName)
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                                .retrieve()
                                .bodyToMono(Map.class)
                                .flatMap(role ->
                                        // 3.2 assign role
                                        webClient.post()
                                                .uri(authServerUrl + "/admin/realms/" + realm + "/users/" + userId + "/role-mappings/realm")
                                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .bodyValue(List.of(role))
                                                .retrieve()
                                                .toBodilessEntity()
                                                .then()
                                )
                );
    }




}
