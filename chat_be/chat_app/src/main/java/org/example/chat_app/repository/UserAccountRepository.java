package org.example.chat_app.repository;

import org.example.chat_app.model.UserAccount;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface UserAccountRepository extends R2dbcRepository<UserAccount, UUID> {
    Mono<UserAccount> findByUsername(String username);

    Mono<UserAccount> findByKeycloakId(UUID keycloakId);;
    Mono<UserAccount> findByEmail(String email);
    Mono<Boolean> existsByUsername(String username);
}