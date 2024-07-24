package ma.wemanity.wmbackend.services;

import lombok.AllArgsConstructor;
import ma.wemanity.wmbackend.entities.User;
import ma.wemanity.wmbackend.repositories.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Service @AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            var member = user.get();
            return new org.springframework.security.core.userdetails.User(
                    member.getUsername(),
                    member.getPassword(),
                    member.getRole().stream()
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                            .collect(Collectors.toList())
            );
        } else {
            throw new UsernameNotFoundException(username);
        }
    }
}