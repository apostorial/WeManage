package ma.wemanity.wmbackend.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController @RequestMapping("/api/user") @Slf4j
public class UserRestController {

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Map<String, Object> userDetails = new HashMap<>();
        userDetails.put("email", principal.getAttribute("email"));
        userDetails.put("name", principal.getAttribute("name"));
        userDetails.put("picture", principal.getAttribute("picture"));

        return ResponseEntity.ok(userDetails);
    }
}
