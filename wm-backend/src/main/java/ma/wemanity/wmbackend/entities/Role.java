package ma.wemanity.wmbackend.entities;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Document @Data @NoArgsConstructor @AllArgsConstructor
public class Role {
    @Id
    private Long id;
    @NotNull @Indexed(unique=true)
    private String name;
    @DBRef
    private Set<User> users = new HashSet<>();;
}
