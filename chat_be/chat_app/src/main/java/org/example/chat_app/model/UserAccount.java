package org.example.chat_app.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Table("user_account")

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserAccount  {
    @Id
    @Column("user_id")
    private UUID userId;

    @Column("keycloak_id")
    private UUID keycloakId;

    @Column("username")
    private String username;

    @Column("email")
    private String email;

    @Column("phone_number")
    private String phoneNumber;

    @Column("first_name")
    private String firstName;

    @Column("last_name")
    private String lastName;

    @Column("profile_photo")
    private String profilePhoto;

    @Column("status_message")
    private String statusMessage;

    @Column("is_online")
    private Boolean isOnline = false;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("last_login")
    private LocalDateTime lastLogin;

    @Column("roles")
    private List<String> roles;

    public UserAccount(UUID uuid, UUID keycloakId, String username, String email, LocalDateTime now) {
         this.userId = uuid;
         this.keycloakId = keycloakId;
         this.email = email;
         this.lastLogin = now;

    }

    public UserAccount(UUID keycloakId, String username, String email) {
        this.keycloakId = Objects.requireNonNull(keycloakId, "keycloakId must not be null");
        this.username = Objects.requireNonNull(username, "username must not be null");
        this.email = email;
        this.isOnline = false;
        this.createdAt = LocalDateTime.now();
    }
}
