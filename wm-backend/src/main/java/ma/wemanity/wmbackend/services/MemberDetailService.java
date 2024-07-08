package ma.wemanity.wmbackend.services;

import ma.wemanity.wmbackend.entities.Member;
import ma.wemanity.wmbackend.repositories.MemberRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MemberDetailService implements UserDetailsService {
    private final MemberRepository memberRepository;

    public MemberDetailService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

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
