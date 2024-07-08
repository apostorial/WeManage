package ma.wemanity.wmbackend.repositories;

import ma.wemanity.wmbackend.entities.Board;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BoardRepository extends MongoRepository<Board, String> {
}
