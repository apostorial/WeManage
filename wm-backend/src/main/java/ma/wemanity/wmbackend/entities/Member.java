package ma.wemanity.wmbackend.entities;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.wemanity.wmbackend.enums.Role;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Document @Data @NoArgsConstructor @AllArgsConstructor
public class Member {
    @Id
    private String id;
    @NotNull @Indexed(unique = true)
    private String username;
    @NotNull
    private String password;
    @NotNull
    private Set<Role> role;
    @DBRef
    private Set<Board> ownerOf = new HashSet<>();
    @DBRef
    private Set<Board> memberOf = new HashSet<>();
    @DBRef
    private Set<Comment> authorOf = new HashSet<>();
}
