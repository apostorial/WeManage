package ma.wemanity.wmbackend.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service @AllArgsConstructor @Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private static final String ALLOWED_DOMAIN = "wemanity.com";

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest);

        String email = user.getAttribute("email");
        if (email == null || !email.endsWith("@" + ALLOWED_DOMAIN)) {
            throw new OAuth2AuthenticationException(new OAuth2Error("invalid_domain",
                    "Only users from wemanity.com are allowed", null));
        }

        return user;
    }
}
