package ma.wemanity.wmbackend.repositories;

import ma.wemanity.wmbackend.entities.Member;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface MemberRepository extends MongoRepository<Member, String> {
    Optional<Member> findByUsername(String username);
}
