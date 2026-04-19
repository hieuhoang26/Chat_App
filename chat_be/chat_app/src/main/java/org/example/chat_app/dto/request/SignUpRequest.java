package org.example.chat_app.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SignUpRequest {
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
}
