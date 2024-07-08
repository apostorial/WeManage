package ma.wemanity.wmbackend.web;

import ma.wemanity.wmbackend.entities.Member;
import ma.wemanity.wmbackend.repositories.MemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/user")
public class MemberRestController {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberRestController(MemberRepository memberRepository, PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public Member register(@RequestBody Member user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return memberRepository.save(user);
    }
}
