package org.example.chat_app.security.keycloak;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.util.ObjectUtils;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
/* ============================================================
 *  CHUYỂN JWT → DANH SÁCH QUYỀN (ROLE)
 * ============================================================ */

@Slf4j
@RequiredArgsConstructor
public class KeycloakGrantedAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
    private static final String ROLES = "roles";
    private static final String CLAIM_REALM_ACCESS = "realm_access";
    private static final String RESOURCE_ACCESS = "resource_access";

    private final Converter<Jwt, Collection<GrantedAuthority>> defaultAuthoritiesConverter =
            new JwtGrantedAuthoritiesConverter();

    private final String clientId;

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        // Lấy roles từ realm và client
        var realmRoles = realmRoles(jwt);
        var clientRoles = clientRoles(jwt, clientId);
        System.out.println(realmRoles);

        // Gộp tất cả roles → GrantedAuthority (prefix: ROLE_)
        Set<GrantedAuthority> authorities = Stream.concat(realmRoles.stream(), clientRoles.stream())
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                .collect(Collectors.toSet());

        // Gộp thêm quyền mặc định (vd: scope từ OIDC)
        authorities.addAll(defaultGrantedAuthorities(jwt));

        return authorities;
    }

    private Collection<GrantedAuthority> defaultGrantedAuthorities(Jwt jwt) {
        return Optional.ofNullable(defaultAuthoritiesConverter.convert(jwt)).orElse(Set.of());
    }

    /**
     * Lấy realm roles từ claim "realm_access"
     * Ví dụ: "realm_access": {"roles": ["admin", "user"]}
     */
    @SuppressWarnings("unchecked")
    private List<String> realmRoles(Jwt jwt) {
        return Optional.ofNullable(jwt.getClaimAsMap(CLAIM_REALM_ACCESS))
                .map(realm -> (List<String>) realm.get(ROLES))
                .orElse(List.of());
    }

    /**
     * Lấy client roles từ claim "resource_access"
     * Ví dụ:
     * "resource_access": {
     *   "my-client": {"roles": ["client_admin", "client_user"]}
     * }
     */
    @SuppressWarnings("unchecked")
    private List<String> clientRoles(Jwt jwt, String clientId) {
        if (ObjectUtils.isEmpty(clientId)) return List.of();

        return Optional.ofNullable(jwt.getClaimAsMap(RESOURCE_ACCESS))
                .map(resourceAccess -> (Map<String, Object>) resourceAccess.get(clientId))
                .map(client -> (List<String>) client.get(ROLES))
                .orElse(List.of());
    }
}

