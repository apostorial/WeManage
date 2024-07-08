package ma.wemanity.wmbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class Board {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    @OneToMany(mappedBy = "board")
    private Set<Column> columns = new HashSet<>();;
    @ManyToOne
    private User owner;
    @ManyToMany
    private Set<User> members = new HashSet<>();;
}
