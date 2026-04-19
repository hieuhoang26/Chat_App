package org.example.chat_app.service;

import lombok.RequiredArgsConstructor;
import org.example.chat_app.model.UserAccount;
import org.example.chat_app.repository.UserAccountRepository;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    final UserAccountRepository userAccountRepository;


    public Mono<UserAccount> syncUserFromKeycloak(JwtAuthenticationToken auth) {
        if (auth == null || auth.getToken() == null) {
            return Mono.error(new IllegalArgumentException("Auth token is null"));
        }

        Jwt jwt = auth.getToken();
        String subject = jwt.getSubject();
        String username = jwt.getClaimAsString("preferred_username");
        String email = jwt.getClaimAsString("email");
        // given_name
        // family_name

        // roles từ resource_access
//        List<String> roles = Optional.ofNullable(jwt.getClaim("resource_access"))
//                .filter(Map.class::isInstance)
//                .map(m -> (Map<String, Object>) m)
//                .map(resourceAccess -> {
//                    // Lấy roles từ resource_access.account
//                    return Optional.ofNullable(resourceAccess.get("account"))
//                            .filter(Map.class::isInstance)
//                            .map(account -> (Map<String, Object>) account)
//                            .map(account -> (List<String>) account.get("roles"))
//                            .orElse(List.of());
//                })
//                .orElse(List.of());
        // roles từ realm_role
        List<String> roles = Optional.ofNullable(jwt.getClaim("realm_access"))
                .filter(Map.class::isInstance)
                .map(m -> (Map<String, Object>) m)
                .map(realm -> (List<String>) realm.get("roles"))
                .orElse(List.of());


        UUID keycloakId;
        try {
            keycloakId = UUID.fromString(subject);
        } catch (IllegalArgumentException e) {
            return Mono.error(new IllegalArgumentException("JWT subject is not a valid UUID"));
        }

        return userAccountRepository.findByKeycloakId(keycloakId)
                .flatMap(user -> {
                    user.setLastLogin(LocalDateTime.now());
                    if (email != null) user.setEmail(email);
                    if (username != null) user.setUsername(username);
                    if (!roles.isEmpty()) user.setRoles(roles);
                    return userAccountRepository.save(user);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    UserAccount newUser = new UserAccount(keycloakId, username, email);
                    newUser.setKeycloakId(keycloakId);
                    newUser.setUsername(username);
                    newUser.setEmail(email);
                    newUser.setRoles(roles);
                    newUser.setLastLogin(LocalDateTime.now());
                    return userAccountRepository.save(newUser);
                }));
    }


}
