package org.example.chat_app.service;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;

@Component
public class KeycloakAdminService {

    private final WebClient webClient;
    private final String clientId = "admin-service";
    private final String clientSecret = "QqBtIaNqpmJioMUuQHXiIIXobojUVjHH";
    private final String realm = "chat-app";

    // cache token trong memory
    private Mono<String> cachedToken;

    public KeycloakAdminService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
        this.cachedToken = fetchToken().cache(Duration.ofMinutes(50)); // TTL < token TTL
    }

    private Mono<String> fetchToken() {
        return webClient.post()
                .uri("http://localhost:8080/realms/" + realm + "/protocol/openid-connect/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters
                        .fromFormData("client_id", clientId)
                        .with("client_secret", clientSecret)
                        .with("grant_type", "client_credentials"))
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
//                .onStatus(HttpStatusCode::isError, res ->
//                        res.bodyToMono(String.class)
//                                .flatMap(body -> Mono.error(new RuntimeException("TOKEN ERROR: " + body)))
//                )
                .bodyToMono(Map.class)
                .map(map -> (String) map.get("access_token"));
    }

    public Mono<String> getToken() {
        return cachedToken.onErrorResume(e -> fetchToken().cache(Duration.ofMinutes(50)));
    }

    // Ví dụ call API Keycloak admin
    public Mono<Map> getUser(String userId) {
        return getToken().flatMap(token ->
                webClient.get()
                        .uri("http://localhost:8080/admin/realms/{realm}/users/{id}", realm, userId)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .retrieve()
                        .bodyToMono(Map.class)
        );
    }
}

