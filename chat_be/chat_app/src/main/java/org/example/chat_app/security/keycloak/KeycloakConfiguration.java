package org.example.chat_app.security.keycloak;



import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import reactor.core.publisher.Mono;

import java.util.Collection;

@Configuration
public class KeycloakConfiguration {
    

    /**
     * Bean chuyển JWT → danh sách quyền (GrantedAuthority)
     * Roles sẽ được lấy từ cả realm-level và client-level của Keycloak.
     */
    @Bean
    Converter<Jwt, Collection<GrantedAuthority>> keycloakGrantedAuthoritiesConverter( @Value("${spring.security.oauth2.client.registration.keycloak.client-id}") String clientId) {
        return new KeycloakGrantedAuthoritiesConverter(clientId);
    }

    /**
     * Bean chuyển JWT → đối tượng AuthenticationToken (Reactive)
     */
    @Bean
    Converter<Jwt, Mono<AbstractAuthenticationToken>> keycloakJwtAuthenticationConverter(
            Converter<Jwt, Collection<GrantedAuthority>> converter) {
        return new ReactiveKeycloakJwtAuthenticationConverter(converter);
    }
}
