package ma.wemanity.wmbackend.repositories;

import ma.wemanity.wmbackend.entities.Card;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CardRepository extends MongoRepository<Card, String> {
    List<Card> findByColumnId(String id);
}
