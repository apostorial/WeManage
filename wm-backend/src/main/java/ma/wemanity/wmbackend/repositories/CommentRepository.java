package ma.wemanity.wmbackend.repositories;

import ma.wemanity.wmbackend.entities.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByCardId(String id);
}
