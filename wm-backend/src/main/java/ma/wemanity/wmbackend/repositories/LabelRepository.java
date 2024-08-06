package ma.wemanity.wmbackend.repositories;

import ma.wemanity.wmbackend.entities.Board;
import ma.wemanity.wmbackend.entities.Label;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LabelRepository extends MongoRepository<Label, String> {
    List<Label> findByOwnerId(String id);
}
