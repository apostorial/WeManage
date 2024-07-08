package ma.wemanity.wmbackend.services;

import lombok.AllArgsConstructor;
import ma.wemanity.wmbackend.entities.Member;
import ma.wemanity.wmbackend.repositories.MemberRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service @AllArgsConstructor
public class MemberDetailService implements UserDetailsService {
    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Member> user = memberRepository.findByUsername(username);
        if (user.isPresent()) {
            var member = user.get();
            return User.builder()
                    .username(member.getUsername())
                    .password(member.getPassword())
                    .roles(String.valueOf(member.getRole()))
                    .build();
        } else {
            throw new UsernameNotFoundException(username);
        }
    }
}
