package ma.wemanity.wmbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class Column {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    @ManyToOne
    private Board board;
    @OneToMany(mappedBy = "column")
    private Set<Card> cards;
}
