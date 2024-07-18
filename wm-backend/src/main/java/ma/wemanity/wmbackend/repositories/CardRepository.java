package ma.wemanity.wmbackend.repositories;

import ma.wemanity.wmbackend.entities.Card;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CardRepository extends MongoRepository<Card, String> {
}
