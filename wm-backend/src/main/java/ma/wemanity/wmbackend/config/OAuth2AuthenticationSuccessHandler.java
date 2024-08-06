package ma.wemanity.wmbackend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import ma.wemanity.wmbackend.entities.User;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import ma.wemanity.wmbackend.repositories.UserRepository;
import ma.wemanity.wmbackend.services.BoardServiceImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component @AllArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private static final String ALLOWED_DOMAIN = "wemanity.com";
    private static final String LOGIN_PAGE_URL = "http://localhost:5173/";
    private final BoardServiceImpl boardServiceImpl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = token.getPrincipal();

        String googleId = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        if (email == null || !email.endsWith("@" + ALLOWED_DOMAIN)) {
            getRedirectStrategy().sendRedirect(request, response, LOGIN_PAGE_URL);
//            + "?error=invalid_domain"
            return;
        }

        Optional<User> existingUser = userRepository.findByGoogleId(googleId);
        if (existingUser.isEmpty()) {
            User newUser = new User(name, email, googleId);
            userRepository.save(newUser);
            try {
                boardServiceImpl.createBoard("Board", "Default board");
            } catch (ServiceException e) {
                throw new RuntimeException(e);
            }
        }

        String targetUrl = determineTargetUrl(request, response, authentication);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    @Override
    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        return "http://localhost:5173/main";
    }
}