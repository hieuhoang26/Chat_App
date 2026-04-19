package org.example.chat_app.security.keycloak;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtGrantedAuthoritiesConverterAdapter;
import org.springframework.util.Assert;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collection;

/* ============================================================
 *  CHUYỂN JWT → REACTIVE AUTHENTICATION TOKEN
 * ============================================================ */
public final class ReactiveKeycloakJwtAuthenticationConverter implements Converter<Jwt, Mono<AbstractAuthenticationToken>> {

    private static final String USERNAME_CLAIM = "preferred_username";

    // Converter reactive để chuyển JWT -> Flux<GrantedAuthority>
    private final Converter<Jwt, Flux<GrantedAuthority>> jwtGrantedAuthoritiesConverter;

    public ReactiveKeycloakJwtAuthenticationConverter(
            Converter<Jwt, Collection<GrantedAuthority>> jwtGrantedAuthoritiesConverter) {
        Assert.notNull(jwtGrantedAuthoritiesConverter, "jwtGrantedAuthoritiesConverter cannot be null");
        this.jwtGrantedAuthoritiesConverter =
                new ReactiveJwtGrantedAuthoritiesConverterAdapter(jwtGrantedAuthoritiesConverter);
    }

    @Override
    public Mono<AbstractAuthenticationToken> convert(Jwt jwt) {
        // Chuyển JWT thành JwtAuthenticationToken (dùng trong Reactive Security)
        return this.jwtGrantedAuthoritiesConverter.convert(jwt)
                .collectList() // collect Flux<GrantedAuthority> → List<GrantedAuthority>
                .map(authorities -> new JwtAuthenticationToken(jwt, authorities, extractUsername(jwt)));
    }

    /**
     * Lấy username từ claim "preferred_username" (Keycloak mặc định)
     * Nếu không có → fallback về subject (sub)
     */
    protected String extractUsername(Jwt jwt) {
        String username = jwt.getClaimAsString(USERNAME_CLAIM);
        return (username != null && !username.isBlank())
                ? username
                : jwt.getSubject();
    }

}