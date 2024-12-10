package ua.es.iap_api.dtos;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokensDTO {
    private String accessToken;
    private String refreshToken;
    private String username;
}
