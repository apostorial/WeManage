package ma.wemanity.wmbackend.entities;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Document @Data @NoArgsConstructor @AllArgsConstructor
public class Board {
    @Id
    private Long id;
    @NotNull
    private String name;
    private String description;
    @DBRef
    private Set<Column> columns = new HashSet<>();;
    @DBRef
    private User owner;
    @DBRef
    private Set<User> members = new HashSet<>();;
}
