package ma.wemanity.wmbackend.entities;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.wemanity.wmbackend.enums.Role;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.HashSet;
import java.util.Set;

@Document @Data @NoArgsConstructor @AllArgsConstructor
public class User{
    @Id
    private String id;
    private String name;
    private String googleId;
    private String email;
    @NotNull
    private Set<Role> role = new HashSet<>();
    @DBRef
    private Set<Board> ownerOf = new HashSet<>();
    @DBRef
    private Set<Board> memberOf = new HashSet<>();
    @DBRef
    private Set<Comment> authorOf = new HashSet<>();

    public User(String name, String email, String googleId) {
        this.name = name;
        this.email = email;
        this.googleId = googleId;
        this.role.add(Role.USER);
    }
}