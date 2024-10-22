package ma.wemanity.wmbackend.repositories;

import ma.wemanity.wmbackend.entities.Board;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BoardRepository extends MongoRepository<Board, String> {
    List<Board> findByOwnerId(String id);
}
