package ma.wemanity.wmbackend.repositories;

import ma.wemanity.wmbackend.entities.Column;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ColumnRepository extends MongoRepository<Column, String> {
}
