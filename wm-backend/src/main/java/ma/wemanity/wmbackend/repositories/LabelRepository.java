package ma.wemanity.wmbackend.repositories;

import ma.wemanity.wmbackend.entities.Label;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LabelRepository extends MongoRepository<Label, String> {
}
