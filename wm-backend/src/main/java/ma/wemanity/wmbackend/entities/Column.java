package ma.wemanity.wmbackend.entities;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Document
@Data @NoArgsConstructor @AllArgsConstructor
public class Column {
    @Id
    private String id;
    @NotNull @Indexed(unique=true)
    private String name;
    private String description;
    @DBRef
    private Board board;
    @DBRef
    private Set<Card> cards;
}
