package ma.wemanity.wmbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class Card {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String company;
    private String position;
    private String email;
    private String number;
    private String website;
    @OneToMany(mappedBy = "card")
    private Set<Comment> comments = new HashSet<>();;
    @ManyToOne
    private Column column;
    @ManyToMany
    private Set<Label> labels = new HashSet<>();;
}
