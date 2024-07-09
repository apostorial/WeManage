package ma.wemanity.wmbackend.services;

import lombok.AllArgsConstructor;
import ma.wemanity.wmbackend.entities.Member;
import ma.wemanity.wmbackend.repositories.MemberRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

@Service @AllArgsConstructor
public class MemberDetailsService implements UserDetailsService {
    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Member> user = memberRepository.findByUsername(username);
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

    private Collection<? extends GrantedAuthority> getAuthorities(Member member) {
        return member.getRole().stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .collect(Collectors.toList());
    }
}
