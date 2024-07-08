package ma.wemanity.wmbackend.entities;

import jakarta.persistence.*;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String username;
    @Column(nullable = false)
    private String password;
    @ManyToOne
    private Role role;
    @OneToMany(mappedBy = "owner")
    private Set<Board> ownerOf = new HashSet<>();
    @ManyToMany(mappedBy = "members")
    private Set<Board> memberOf = new HashSet<>();
    @OneToMany(mappedBy = "author")
    private Set<Comment> authorOf = new HashSet<>();
}
