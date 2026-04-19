package org.example.chat_app.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenResponse {
    //    private String id;
//    private String role;
//    private String phone;
//    private Boolean verify;
//    private String accessToken;
//    private String refreshToken;
//    private String message;
//    private String token_type;
//    private long expires_in;
//    private long refresh_expires_in;
    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("refresh_token")
    private String refreshToken;

    @JsonProperty("token_type")
    private String tokenType;

    @JsonProperty("expires_in")
    private long expiresIn;

    @JsonProperty("refresh_expires_in")
    private long refreshExpiresIn;
}
