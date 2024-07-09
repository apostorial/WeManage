package ma.wemanity.wmbackend.repositories;

import ma.wemanity.wmbackend.entities.Column;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ColumnRepository extends MongoRepository<Column, String> {
    List<Column> findByBoardId(String id);
}
