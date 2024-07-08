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
public class Card {
    @Id
    private String id;
    @NotNull
    private String name;
    private String company;
    private String position;
    private String email;
    private String number;
    private String website;
    @DBRef
    private Set<Comment> comments = new HashSet<>();;
    @DBRef
    private Column column;
    @DBRef
    private Set<Label> labels = new HashSet<>();;
}
